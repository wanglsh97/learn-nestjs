# 第 03 课：请求生命周期

一个 HTTP 请求进入 NestJS 后，不会直接调用控制器（Controller）。认证、输入转换、日志和异常格式化分布在不同扩展点；如果不知道它们的执行位置，很容易把规则放错层，或误判为什么某段代码没有运行。

本课用创建笔记的请求串起中间件（Middleware）、守卫（Guard）、拦截器（Interceptor）、管道（Pipe）、控制器和异常过滤器（Exception Filter）。DTO 的声明式校验留到第 4 课。

## 一条请求的主路径

![NestJS 请求生命周期](diagram/request-lifecycle.svg)

对本课 `POST /api/notes`，成功路径可以记成：

1. Express 收到请求，`RequestIdMiddleware` 最先生成或透传请求 ID；
2. 路由匹配后，`ApiKeyGuard` 判断请求是否允许继续；
3. `RequestLoggingInterceptor` 在处理器之前记录开始时间；
4. `TrimStringsPipe` 转换 `@Body()` 参数；
5. `NotesController` 调用 `NotesService` 创建笔记；
6. 拦截器在 Observable 完成时记录方法、路径和耗时；
7. HTTP 适配器序列化返回值并发送响应。

如果守卫抛出 `UnauthorizedException`，控制器、管道和服务（Service）都不会执行，异常交给 `HttpExceptionFilter` 生成统一 JSON。拦截器是否能观察到异常取决于异常发生在它所覆盖的调用范围内；不要把异常过滤器当成普通的最后一步。

## 中间件：路由处理前的协议层工作

中间件接近 Express 请求管线，适合关联 ID、底层请求头处理或兼容旧协议：

```ts
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = request.header('x-request-id') ?? randomUUID();
    response.setHeader('x-request-id', requestId);
    next();
  }
}
```

在根模块中显式指定作用范围：

```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}');
  }
}
```

中间件不知道最终会调用哪个控制器方法，也不适合承载业务权限规则。忘记调用 `next()` 会让请求悬挂。

## 守卫：能否进入路由

守卫在已经知道目标控制器和路由处理器（Handler）后执行，因此可以读取元数据并做认证授权。本课用固定 API 密钥观察位置：

```ts
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = process.env.DEMO_API_KEY ?? 'learning-key';

    if (request.header('x-api-key') !== expected) {
      throw new UnauthorizedException('Invalid x-api-key');
    }
    return true;
  }
}
```

`@UseGuards(ApiKeyGuard)` 只保护创建接口，读取列表仍公开。真实 JWT 认证在第 7 课，RBAC 在第 8 课；本课只关心守卫位于请求链的哪里。

## 拦截器（Interceptor）：观察调用前后

拦截器的心智模型接近前端 HTTP 客户端的拦截器或函数装饰器：它既有“进入”阶段，也能通过 RxJS 操作符观察“返回”阶段。

```ts
intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
  const request = context.switchToHttp().getRequest<Request>();
  const startedAt = Date.now();

  return next.handle().pipe(
    finalize(() => {
      this.logger.log(
        `${request.method} ${request.originalUrl} ${Date.now() - startedAt}ms`,
      );
    }),
  );
}
```

`next.handle()` 才会进入后续管道和路由处理器。适合统一日志、耗时、响应映射和缓存，但不要在这里堆积笔记业务规则。

## 管道：转换当前参数

管道针对控制器参数运行。本课把请求体（Body）顶层字符串两端空格移除：

```ts
@Post()
@UseGuards(ApiKeyGuard)
create(@Body(TrimStringsPipe) dto: CreateNoteDto): Note {
  return this.notesService.create(dto);
}
```

```ts
transform(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      typeof item === 'string' ? item.trim() : item,
    ]),
  );
}
```

它只处理一层对象，是刻意保持的最小示例。第 4 课会使用 `ValidationPipe`、`class-validator` 和转换选项建立完整输入边界。

## 异常过滤器：控制失败响应

Nest 默认已经能把 `HttpException` 转为响应。自定义异常过滤器的价值是统一团队需要的错误字段：

```ts
response.status(statusCode).json({
  statusCode,
  message: exception.message,
  path: request.originalUrl,
  timestamp: new Date().toISOString(),
});
```

本课通过 `app.useGlobalFilters()` 注册它，所以所有捕获到的 `HttpException` 使用同一结构。异常过滤器不应吞掉未知错误或泄露堆栈；生产系统还需要区分可公开消息与内部日志。

## 运行并观察两条分支

```bash
cd lessons/03-request-lifecycle/demo
npm run start:dev
```

先省略密钥：

```bash
curl -i -X POST http://localhost:3003/api/notes \
  -H 'content-type: application/json' \
  -H 'x-request-id: lifecycle-denied' \
  -d '{"title":" Lifecycle ","content":" denied "}'
```

响应头会透传 `x-request-id`，响应体是统一的 `401`：

```json
{
  "statusCode": 401,
  "message": "Invalid x-api-key",
  "path": "/api/notes",
  "timestamp": "<ISO timestamp>"
}
```

再带上密钥：

```bash
curl -i -X POST http://localhost:3003/api/notes \
  -H 'content-type: application/json' \
  -H 'x-api-key: learning-key' \
  -d '{"title":" Lifecycle ","content":" ordered stages "}'
```

响应里的 `title` 和 `content` 已去掉两端空格，终端出现类似 `POST /api/notes 3ms` 的拦截器日志。实际耗时会变化。

```bash
npm run lint
npm run build
```

本课 Demo 不包含测试用例；上述两次请求就是可重复的本地验证路径。

## 选择扩展点时先问职责

- 所有请求都要做、且接近原始 HTTP 协议：中间件；
- 是否允许进入路由处理器：守卫；
- 转换或校验某个参数：管道；
- 观察或改写路由处理器调用前后的过程：拦截器；
- 把异常映射为响应：异常过滤器；
- 协议适配后的业务规则：服务。

全局注册能保证一致性，但也扩大影响面。先在控制器或方法级验证规则，再把确实通用的能力提升为全局配置。执行顺序不是用来背 API 的清单，而是定位“当前还能访问哪些上下文、失败会跳过哪些阶段”的调试地图。

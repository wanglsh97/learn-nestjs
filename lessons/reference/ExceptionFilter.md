# Exception Filter

Exception Filter 负责捕获进入异常层的未处理异常，并把它们映射为当前协议的响应。Nest 已有 built-in exceptions layer，普通 `HttpException` 不需要自定义 Exception Filter 也能得到 HTTP 响应；自定义 Exception Filter 的主要价值是统一团队需要的错误结构和日志上下文。

## 平台无关的最小实现

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<{ originalUrl?: string; url: string }>();
    const response = context.getResponse<unknown>();
    const statusCode = exception.getStatus();
    const detail = exception.getResponse();

    this.adapterHost.httpAdapter.reply(
      response,
      {
        statusCode,
        message: typeof detail === 'string' ? detail : exception.message,
        path: request.originalUrl ?? request.url,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
```

## `@Catch()`

`@Catch(...exceptions)` 把 class 声明为 Exception Filter，并限定捕获类型：

- `@Catch(HttpException)` 只匹配 `HttpException` 及其 subclass；
- 可传多个 exception class，例如 `@Catch(HttpException, QueryFailedError)`；
- `@Catch()` 不传参数时是 catch-all Filter，必须自行区分未知错误并避免泄露内部信息。

参数必须是运行时存在的 exception class，不能使用编译后消失的 TypeScript interface。`ExceptionFilter<T>` 的 generic 只提供静态类型约束，不决定运行时捕获范围，真正的匹配范围由 `@Catch()` 参数决定。

## `@UseFilters()`

`@UseFilters(...filters)` 把 Exception Filter 绑定到 Controller class 或 Handler method：

- 参数可以是一个或多个 Filter class/instance；传 class 时 Nest 负责实例化并支持 Dependency Injection，传 instance 时由调用方构造；
- 放在 Controller class 上时处理该 Controller 内的异常，放在 method 上时只处理当前 Handler；
- Filter 不会形成与 Interceptor 相同的双向调用链；异常命中某个 Filter 后，不会继续级联到后续 Filter；
- Filter 的 `@Catch()` 类型必须与实际异常匹配，否则由更外层的 Exception Filter 或 Nest built-in exceptions layer 处理。

示例中的 `@Module()` 属于 Module 主题，本章不展开。

## Binding scope

Exception Filter 有三种 binding scope：

| scope | 注册方式 | 影响范围 |
| --- | --- | --- |
| method-scoped | Handler 上的 `@UseFilters()` | 单个 Handler |
| Controller-scoped | Controller class 上的 `@UseFilters()` | 当前 Controller 的全部 Handler |
| global-scoped | `app.useGlobalFilters()` 或 `APP_FILTER` | application 中的全部 Controller/Handler |

优先传 Filter class，而不是手动创建 instance：

```ts
@UseFilters(HttpExceptionFilter)
@Post()
create(): never {
  throw new ConflictException('Note already exists');
}
```

这样 Nest 可以复用 instance 并完成 Dependency Injection。只有需要调用方显式传入 constructor 参数时，才考虑手动创建 instance。

## Global Exception Filter

Global Exception Filter 适合所有 HTTP endpoint 都必须一致的失败策略，例如：

- 统一 `{ statusCode, code, message, path, timestamp, requestId }` response shape；
- 把 ORM、SDK 或 domain error 映射为稳定的 HTTP status/code；
- 对未知 exception 记录完整 server-side context，同时只向客户端返回安全信息；
- 统一错误日志、trace/span status 和 correlation ID；
- 保留 built-in `HttpException` 语义，只补充团队级字段。

如果只是少数 Handler 的特殊协议映射，应使用 method/Controller scope，不要把 feature-specific 规则放进 global Filter。

### `app.useGlobalFilters()`

可以在 bootstrap 阶段直接注册 instance：

```ts
import { HttpAdapterHost } from '@nestjs/core';

const app = await NestFactory.create(AppModule);
const adapterHost = app.get(HttpAdapterHost);

app.useGlobalFilters(new HttpExceptionFilter(adapterHost));
await app.listen(3000);
```

`useGlobalFilters(...filters)` 接收一个或多个已经创建的 Filter instance。它在 Module context 外注册，因此 Nest 不会为这些 instance 自动执行 constructor injection。示例必须通过 `app.get()` 手动取得 `HttpAdapterHost` 再传入。

这种方式适合无 dependency 的简单 Filter，或 bootstrap 确实需要显式组装的 instance。它的限制是：

- 依赖需要手动解析和传入；
- `useGlobalFilters()` 不会自动为 Gateway 或 hybrid application 设置 Filter；
- 手动 `new` 会让 lifecycle 与测试替换更难统一。

### `APP_FILTER`

需要 Dependency Injection 时，推荐在 Filter 所属 Module 中使用 `APP_FILTER`：

```ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ErrorHandlingModule {}
```

`APP_FILTER` 是 framework token，不是 Decorator。无论把这段 custom provider 注册放在哪个 Module，产生的 Filter 都是 global-scoped；通常应放在定义该 Filter 的 Module，使 dependency ownership 清晰。

`useClass` 让 Nest 创建 Filter 并完成 constructor injection。需要复用一个已经注册的 Filter instance 时，可以使用 `useExisting`：

```ts
@Module({
  providers: [
    HttpExceptionFilter,
    {
      provide: APP_FILTER,
      useExisting: HttpExceptionFilter,
    },
  ],
})
export class ErrorHandlingModule {}
```

不要同时用 `useGlobalFilters()` 和 `APP_FILTER` 注册同一个 Filter，否则一次 exception 可能进入重复的全局配置，行为和维护成本都会变得不清晰。

### 多个 global Filter

可以注册多个 `APP_FILTER` custom provider，但每个 Filter 的 `@Catch()` 应有清晰且尽量不重叠的范围。若同时存在 catch-all Filter 与特定 Exception Filter，按 Nest 官方要求先声明 catch-all，再声明特定 Filter，确保特定类型有机会被对应 Filter 处理。

global Filter 仍受 transport context 限制。HTTP Filter 使用 `host.switchToHttp()`；WebSocket 和 Microservice 应使用各自的 Exception 类型与 context，不应假设一个 HTTP response writer 可以跨 transport 复用。

## 不要破坏默认错误边界

- 不要把所有错误都返回 `200`。
- 不要把未知错误的堆栈、SQL、密钥或内部对象返回给客户端。
- 不要捕获异常后既不发送响应也不继续抛出。
- 如果只是想扩展默认行为，可继承 `BaseExceptionFilter` 并对未知异常调用 `super.catch()`。
- 业务 Service 负责选择 `404`、`409` 等异常语义，Exception Filter 负责稳定响应形状。

Exception Filter 不等同于成功链路的“最后一步”。异常可能在 Middleware、Guard、Pipe、Controller 或 Service 中产生；某个 Exception Filter 是否生效取决于异常发生位置和注册 scope。

官方资料：[Exception filters](https://docs.nestjs.com/exception-filters)、[Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)。本仓库示例：[第 3 课 Exception Filter](../03-request-lifecycle/index.md#异常过滤器控制失败响应)。

# Middleware

Middleware 位于路由处理前的底层 HTTP 管线，适合请求 ID、访问日志起点、兼容旧请求头、Cookie 解析等协议级工作。它可以读取和修改请求/响应，也可以提前结束请求。

Middleware 有两种实现形式和两种主要注册方式：

| 实现/注册 | Dependency Injection | 典型用途 |
| --- | --- | --- |
| class-based Middleware + `MiddlewareConsumer` | 支持 | 依赖 ConfigService、Logger 等 Provider |
| functional Middleware + `MiddlewareConsumer` | 不依赖 Module DI | 简单、可复用的 request/response 操作 |
| functional Middleware + `app.use()` | 无法访问 Module DI container | application-level global Middleware |

## 最小实现

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = request.header('x-request-id') ?? randomUUID();
    response.setHeader('x-request-id', requestId);
    next();
  }
}
```

## Module-scoped Middleware

在 Module 中声明作用范围：

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}');
  }
}
```

### Middleware 没有绑定 Decorator

Nest 没有 `@UseMiddleware()`。class-based Middleware 实现 `NestMiddleware`，再由 Module 的 `configure()` 调用 `consumer.apply(...middleware).forRoutes(...routes)` 完成绑定：

- `apply()` 接收一个或多个 Middleware class/function，并按传入顺序执行；
- `forRoutes()` 接收 Controller、path string 或 `RouteInfo`，决定应用范围；
- `exclude()` 在 `forRoutes()` 前排除指定 route。

因此本章不展开示例中的通用 `@Injectable()` 和 `@Module()`；它们分别属于 Provider 与 Module 主题，不是 Middleware 专用 Decorator。`configure()` 可以是 `async` method，但不要把每次请求才需要的工作放到 application bootstrap 阶段执行。

### `apply()`、`forRoutes()` 与 `exclude()`

`apply(...middleware)` 接收 class-based Middleware、functional Middleware 或第三方 Middleware function。一次传入多个参数时按声明顺序执行：

```ts
consumer
  .apply(RequestIdMiddleware, accessLogger)
  .forRoutes(NotesController);
```

`forRoutes(...routes)` 支持：

- path string，例如 `'notes'`；
- Controller class，例如 `NotesController`；
- 多个 string/Controller；
- `RouteInfo` object，例如 `{ path: 'notes', method: RequestMethod.GET }`。

`exclude(...routes)` 必须放在 `forRoutes()` 前，用相同的 string 或 `RouteInfo` 形式排除 route：

```ts
consumer
  .apply(RequestIdMiddleware)
  .exclude(
    { path: 'health', method: RequestMethod.GET },
    'docs/{*splat}',
  )
  .forRoutes({ path: '{*splat}', method: RequestMethod.ALL });
```

### Route wildcard

Middleware route pattern 使用 named wildcard：

- `'notes/*splat'` 匹配 `notes/1` 等带后续 segment 的路径，但不匹配空的 `notes/`；
- `'notes/{*splat}'` 把 wildcard 变为 optional，也能匹配 `notes/`；
- `'{*splat}'` 配合 `RequestMethod.ALL` 可覆盖当前 Module 配置所能匹配的全部 route。

wildcard name（这里是 `splat`）没有特殊含义，可以换成其他名称。应优先绑定 Controller 或明确的 `RouteInfo`，只有真正需要全覆盖时才使用 catch-all pattern。

## Global Middleware

`INestApplication.use()` 注册 application-level global Middleware：

```ts
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

function requestId(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  response.setHeader(
    'x-request-id',
    request.header('x-request-id') ?? randomUUID(),
  );
  next();
}

const app = await NestFactory.create(AppModule);
app.use(requestId);
await app.listen(3000);
```

`app.use(...middleware)` 的参数是底层 platform 接受的 Middleware function。它在 bootstrap 中注册，适合必须覆盖整个 application 的简单协议逻辑。

关键限制：通过 `app.use()` 注册的 global Middleware 无法访问 Nest Module DI container，不能让 Nest 为它注入 `ConfigService` 等 Provider。如果 Middleware 需要 Dependency Injection，应使用 class-based Middleware，并在 root Module 中通过：

```ts
consumer
  .apply(RequestIdMiddleware)
  .forRoutes({ path: '{*splat}', method: RequestMethod.ALL });
```

这在作用范围上接近 global Middleware，同时保留 Module context 和 constructor injection。不要为了获得 DI 在 `main.ts` 中手动 `new RequestIdMiddleware(...)`，那会绕过 Nest 的 dependency graph。

## Functional 与 class-based Middleware

没有 dependency 的简单逻辑优先写成 function：

```ts
export function accessLogger(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  response.once('finish', () => {
    console.log(request.method, request.originalUrl, response.statusCode);
  });
  next();
}
```

需要 constructor injection、复用 Nest Provider 或维护清晰 class contract 时，使用实现 `NestMiddleware` 的 class。两种形式都必须遵守相同的 `next()`/结束响应规则。

## Dependency Injection

通过 `MiddlewareConsumer` 注册的 class-based Middleware 可以注入当前 Module context 中可见的 Provider：

```ts
@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    this.logger.info(`${request.method} ${request.originalUrl}`);
    next();
  }
}
```

可见范围遵循普通 Module encapsulation：Provider 要么注册在当前 Module，要么由 imported Module 导出。Middleware 本身不需要放入 `providers` 数组；`consumer.apply()` 负责声明它。

## 执行顺序与 platform 边界

- 同一次 `apply(A, B)` 中，`A` 先于 `B` 执行；
- global `app.use()` 在 platform application 上注册，通常先于通过 Module 配置的 route Middleware；
- Middleware 在 Guard、Interceptor、Pipe 和 Handler 之前运行；
- Middleware API 与 HTTP adapter 有关，Express 和 Fastify 的签名及 plugin 模型并不完全相同；
- Express adapter 默认注册 JSON 和 URL-encoded body parsing。需要替换它们时，要在 `NestFactory.create()` 中显式设置 `bodyParser: false`，再自行注册 parser。

## 能看到什么

Middleware 接近底层适配器，通常不知道最终 Controller method 及其反射元数据。需要读取 `@Roles()` 等路由元数据时，应使用 Guard；需要处理某个参数时，应使用 Pipe。

调用 `next()` 才会继续后续管线。若 Middleware 自行发送响应，就不要再调用 `next()`；既不响应也不调用会使请求悬挂。

## 工程边界

- 适合所有请求共有的协议级能力。
- 适合 correlation ID、基础 access log、header normalization、cookie/parser 等 platform-level concern。
- 不适合依赖路由元数据的认证授权。
- 不要在 Middleware 中堆积领域业务规则。
- 若要统计包括 404、Guard 拒绝在内的全部请求，可在外层 Middleware 监听响应 `finish` 事件。
- 调用异步逻辑时必须处理 rejected Promise；不要让 Middleware 静默挂起请求。

官方资料：[Middleware](https://docs.nestjs.com/middleware)。本仓库示例：[第 3 课请求 ID Middleware](../03-request-lifecycle/index.md#中间件路由处理前的协议层工作)。

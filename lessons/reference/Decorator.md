# Decorator

NestJS 使用 Decorator 为 class、method、parameter 或 property 添加 metadata。Nest runtime 再读取这些 metadata，构建 Module graph、routing table、Dependency Injection、request lifecycle 和 OpenAPI schema。

Decorator 通常不直接执行业务逻辑。例如 `@UseGuards(AuthGuard)` 只声明当前 Controller/Handler 绑定哪个 Guard，真正的认证逻辑仍在 Guard 的 `canActivate()` 中执行。

## 先理解 Decorator 装饰什么

| 目标 | 典型 Decorator | Nest 用这些 metadata 做什么 |
| --- | --- | --- |
| class | `@Module()`、`@Controller()`、`@Injectable()`、`@Catch()` | 创建 Module、Controller、Provider 或 Exception Filter |
| method | `@Get()`、`@Post()`、`@UseGuards()`、`@HttpCode()` | 建立 route 并绑定 request lifecycle 能力 |
| parameter | `@Body()`、`@Param()`、`@Inject()`、custom parameter decorator | 解析 Handler 参数或 constructor dependency |
| property | `@Inject()`、部分 Swagger/validation Decorator | property injection 或 schema metadata |

Decorator 的位置决定 metadata target。相同 Decorator 放在 Controller class 与 Handler method 上时，scope 往往不同；最终是覆盖、合并还是同时执行，由对应 Nest component 决定。

## 常用 Nest core Decorator

### Application structure

| Decorator | 目标 | 主要参数与作用 |
| --- | --- | --- |
| `@Module(metadata)` | class | `imports`、`controllers`、`providers`、`exports` 描述 Module boundary |
| `@Controller(pathOrOptions?)` | class | 设置 route prefix，或通过 options 设置 `path`、`host`、`scope`、`version` |
| `@Injectable(options?)` | class | 添加 DI metadata；options 可设置 Provider `scope` 和特定 durable 行为 |
| `@Global()` | Module class | 将 Module 标记为 global-scoped；仍需通过 `exports` 暴露 Provider |

这些 Decorator 的完整参数分别见 [Module](Module.md)、[Controller](Controller.md) 和 [Provider](Provider.md)。

### HTTP route method

| Decorator | HTTP method | 参数 |
| --- | --- | --- |
| `@Get(path?)` | GET | 相对 Controller prefix 的 path |
| `@Post(path?)` | POST | 相对 path |
| `@Put(path?)` | PUT | 相对 path |
| `@Patch(path?)` | PATCH | 相对 path |
| `@Delete(path?)` | DELETE | 相对 path |
| `@Options(path?)` | OPTIONS | 相对 path |
| `@Head(path?)` | HEAD | 相对 path |
| `@All(path?)` | 所有 method | 相对 path |

不传 `path` 时，Handler 绑定到 Controller prefix 本身。例如：

```ts
@Controller('notes')
export class NotesController {
  @Get(':id')
  findOne(): Note {}
}
```

最终 route 是 `GET /notes/:id`。method name `findOne` 不参与 route matching。

### HTTP parameter

| Decorator | 不传 key | 传入 key |
| --- | --- | --- |
| `@Req()` / `@Request()` | platform request | 无 key 参数 |
| `@Res(options?)` / `@Response()` | platform response | `{ passthrough: true }` 保留 Nest response handling |
| `@Next()` | platform `next` function | 无 key 参数 |
| `@Session()` | session object | 无 key 参数 |
| `@Param(key?, ...pipes)` | 全部 path parameters | 指定 path parameter |
| `@Body(key?, ...pipes)` | 完整 request body | body 中指定 property |
| `@Query(key?, ...pipes)` | 完整 query object | 指定 query parameter |
| `@Headers(name?)` | 全部 request headers | 指定 header |
| `@Ip()` | client IP | 无参数 |
| `@HostParam(key?)` | host parameters | 指定 host parameter |
| `@UploadedFile(fileKey?)` | 单个 uploaded file | 与 `FileInterceptor` 的 field name 对应 |
| `@UploadedFiles()` | 多个 uploaded files | 与 `FilesInterceptor`/`FileFieldsInterceptor` 配合 |

`@Param()`、`@Body()`、`@Query()` 的末尾可以传 Pipe class/instance：

```ts
@Get(':id')
findOne(
  @Param('id', ParseUUIDPipe) id: string,
): Promise<Note> {
  return this.notesService.findOne(id);
}
```

直接使用 `@Res()` 会让当前 Handler 进入 library-specific response mode，由代码负责结束响应。只想设置 cookie/header 时，应明确使用 `@Res({ passthrough: true })`。

### HTTP response

| Decorator | 参数 | 作用 |
| --- | --- | --- |
| `@HttpCode(statusCode)` | HTTP status number | 覆盖静态成功 status code |
| `@Header(name, value)` | header name/value | 设置静态 response header |
| `@Redirect(url?, statusCode?)` | URL 与 status | 声明 redirect，默认 status 是 `302` |
| `@Render(template)` | template name | 使用配置的 template engine 渲染 view |
| `@Sse(path?)` | route path | 声明 Server-Sent Events Handler |
| `@SerializeOptions(options)` | serialization options | 为 Controller/Handler 配置 `ClassSerializerInterceptor` 行为 |

需要根据运行结果动态决定 status/header 时，优先抛出明确 Exception 或使用 Interceptor；不要为每个 Handler 随意切换到 platform response。

### Request lifecycle binding

| Decorator | 参数 | class scope | method scope |
| --- | --- | --- | --- |
| `@UseGuards(...guards)` | Guard class/instance | 当前 Controller | 当前 Handler |
| `@UseInterceptors(...interceptors)` | Interceptor class/instance | 当前 Controller | 当前 Handler |
| `@UsePipes(...pipes)` | Pipe class/instance | 当前 Controller | 当前 Handler |
| `@UseFilters(...filters)` | Exception Filter class/instance | 当前 Controller | 当前 Handler |

传 class 时 Nest 负责实例化并支持 Dependency Injection；传 `new SomeGuard()` 这样的 instance 时，由调用方负责创建。通常优先传 class。

### Exception Filter

`@Catch(...exceptionTypes)` 把 class 声明为 Exception Filter：

```ts
@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter<HttpException> {}
```

不传参数的 `@Catch()` 是 catch-all Filter。generic type 只提供 TypeScript 约束，运行时匹配范围由 `@Catch()` 参数决定。详见 [Exception Filter](ExceptionFilter.md)。

### Dependency Injection

| Decorator | 参数 | 作用 |
| --- | --- | --- |
| `@Inject(token)` | class/string/symbol token | 显式指定需要解析的 Provider token |
| `@Optional()` | 无 | token 缺失时注入 `undefined`，不让 bootstrap 失败 |

class token 通常可以由 constructor parameter type 推断，因此不需要 `@Inject()`。interface、配置 value 或 custom token 在运行时无法从 TypeScript type 推断，必须显式使用：

```ts
@Injectable()
export class NotesService {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly repository: NoteRepository,
  ) {}
}
```

详见 [Provider](Provider.md)。

### Version 与 metadata

| Decorator | 参数 | 作用 |
| --- | --- | --- |
| `@Version(version)` | string/string[]/`VERSION_NEUTRAL` | 覆盖 Handler 的 API version |
| `@SetMetadata(key, value)` | metadata key/value | 为 class 或 method 写入 custom metadata |

`@SetMetadata()` 通常不应直接散落在 Controller 中，应封装成 `@Roles()`、`@Public()` 等有业务含义的 Custom Decorator，再由 Guard/Interceptor 通过 `Reflector` 读取。

## Custom metadata Decorator

Custom metadata Decorator 负责声明静态规则。例如：只有 Admin 可以删除 Note。

### 使用 `SetMetadata()`

```ts
import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const ROLES_KEY = Symbol('roles');

export const Roles = (...roles: Role[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
```

`SetMetadata(key, value)` 把 `value` 写到被装饰的 class/method 上。这里：

- `ROLES_KEY` 是读取 metadata 的稳定 key；
- `roles` 是当前 route 声明的 `Role[]`；
- `@Roles()` 本身不执行 authorization。

使用：

```ts
@Roles(Role.Admin)
@Delete(':id')
remove(@Param('id') id: string): Promise<void> {
  return this.notesService.remove(id);
}
```

Guard 读取：

```ts
const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
  context.getHandler(),
  context.getClass(),
]);
```

`context.getHandler()` 是当前 method target，`context.getClass()` 是 Controller class target。数组顺序表示优先级，因此 method metadata 可以覆盖 class metadata。

### 使用 `Reflector.createDecorator()`

`Reflector.createDecorator<T>()` 同时创建 Decorator reference 和类型安全 metadata key：

```ts
import { Reflector } from '@nestjs/core';

export const RequiredRoles = Reflector.createDecorator<Role[]>();
```

```ts
@RequiredRoles([Role.Admin])
@Delete(':id')
remove(): Promise<void> {}
```

```ts
const roles = this.reflector.getAllAndOverride(RequiredRoles, [
  context.getHandler(),
  context.getClass(),
]);
```

它适合单个 typed value。若希望 `@Roles(Role.Admin, Role.User)` 使用 rest parameter，手动封装 `SetMetadata()` 更自然。完整授权示例见 [Guard](Guard.md)。

## Custom parameter Decorator

`createParamDecorator()` 用于从 `ExecutionContext` 中提取 Handler parameter。常见场景是读取 authentication layer 写入 request 的 user：

```ts
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator<
  keyof AuthenticatedUser | undefined
>((property, context: ExecutionContext) => {
  const request = context
    .switchToHttp()
    .getRequest<AuthenticatedRequest>();

  return property ? request.user[property] : request.user;
});
```

使用：

```ts
@Get('me')
findMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
  return user;
}

@Get('me/id')
findMyId(@CurrentUser('id') userId: string): string {
  return userId;
}
```

`createParamDecorator<TData>(factory)` 中：

- generic `TData` 约束调用 Decorator 时允许传入的 data；
- factory 第一个参数是 `@CurrentUser(data)` 中的 data；
- factory 第二个参数是当前 `ExecutionContext`；
- factory return value 成为 Handler parameter 的实际值。

不要在 parameter Decorator 中执行数据库查询或复杂业务逻辑。它应只完成 context extraction；需要异步业务数据时交给 Guard、Pipe 或 Service。

### Custom parameter Decorator 与 Pipe

Custom parameter Decorator 和 `@Body()`、`@Param()` 一样可以绑定 Pipe：

```ts
findMe(
  @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
  user: AuthenticatedUser,
): AuthenticatedUser {
  return user;
}
```

`ValidationPipe` 默认不校验 Custom Decorator 提取的参数；确实需要时设置 `validateCustomDecorators: true`。普通 transformation Pipe 仍可按 parameter binding 规则执行。

## 使用 `applyDecorators()` 组合 Decorator

多个固定搭配的 Decorator 可以组合成一个语义化 Decorator：

```ts
import {
  applyDecorators,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function Auth(...roles: Role[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
```

```ts
@Auth(Role.Admin)
@Get('admin/notes')
findAllForAdmin(): Promise<Note[]> {}
```

`applyDecorators(...decorators)` 依次应用传入的 class/method Decorator。它适合组合始终一起出现的认证、authorization 和 OpenAPI metadata，但不要把互不相关的行为塞进一个难以理解的“万能 Decorator”。Nest 官方特别说明 `@ApiHideProperty()` 不能通过 `applyDecorators()` 正常组合。

## Swagger 与 validation Decorator 不属于 Nest core

常见项目还会使用另外两个 package 的 Decorator：

### `@nestjs/swagger`

- class/model：`@ApiProperty()`、`@ApiExtraModels()`；
- Controller：`@ApiTags()`、`@ApiBearerAuth()`；
- Handler：`@ApiOperation()`、`@ApiResponse()`、`@ApiParam()`、`@ApiQuery()`、`@ApiBody()`。

它们用于生成 OpenAPI document，不负责 runtime validation 或 authorization。

### `class-validator` / `class-transformer`

- validation：`@IsString()`、`@IsUUID()`、`@Length()`、`@IsOptional()`、`@ValidateNested()`；
- transformation：`@Type()`、`@Transform()`、`@Expose()`、`@Exclude()`。

这些 Decorator 的 metadata 由 `ValidationPipe`、`class-validator` 或 `class-transformer` 消费，不是 Nest routing Decorator。Swagger schema、runtime validation 和 TypeScript type 是三套不同机制，需要分别配置。

## 工程边界与易错点

- Decorator 声明 metadata，不把复杂业务逻辑藏进 Decorator factory。
- Custom Decorator 名称表达业务语义，例如 `@Public()`，而不是暴露内部实现名称。
- metadata key 集中定义并导出；使用同一个 `symbol` instance，不要在写入和读取处分别创建 `Symbol('roles')`。
- class-level 与 method-level metadata 的 override/merge 策略由 consumer 明确决定。
- parameter Decorator 只提取 context，不把 Service locator 或数据库访问塞进去。
- 组合 Decorator 保持小而稳定，避免调用方无法看出实际绑定了哪些 Guard/Interceptor。
- 不依赖肉眼猜测 Decorator 执行顺序；涉及多个 Guard、Interceptor 或 Pipe 时按各自 request lifecycle 规则验证。

官方资料：[Custom decorators](https://docs.nestjs.com/custom-decorators)、[Controllers](https://docs.nestjs.com/controllers)、[Execution context](https://docs.nestjs.com/fundamentals/execution-context)、[OpenAPI decorators](https://docs.nestjs.com/openapi/decorators)。

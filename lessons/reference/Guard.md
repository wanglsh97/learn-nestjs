# Guard

Guard 回答“当前请求能否进入这个路由”。它在 Nest 已经知道目标 Controller 和 Handler 后运行，因此可以结合用户身份、路由元数据和 ExecutionContext 完成认证授权。

## 最小实现

```ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.header('x-api-key') !== process.env.DEMO_API_KEY) {
      throw new UnauthorizedException('Invalid x-api-key');
    }

    return true;
  }
}
```

局部注册：

```ts
@UseGuards(ApiKeyGuard)
@Post()
create(@Body() dto: CreateNoteDto): Promise<Note> {
  return this.notesService.create(dto);
}
```

## `@UseGuards()`

`@UseGuards(...guards)` 把 Guard 绑定到 Controller class 或 Handler method：

- 每个参数可以是 Guard class 或 instance；传 class 时 Nest 负责实例化并支持 Dependency Injection，传 instance 时由调用方负责构造；
- 可以一次传入多个 Guard，例如 `@UseGuards(AuthGuard, RolesGuard)`；它们按声明顺序执行，任一 Guard 拒绝后都不会进入 Handler；
- 放在 Controller class 上时作用于该 Controller 的所有 Handler，放在 method 上时只作用于当前 Handler；
- `@UseGuards()` 不传参数没有实际作用，也不会清除 class-level 或 global Guard。

示例中的 `@Post()` 和 `@Body()` 属于 Controller routing 与参数读取，不在本章展开。

需要 Dependency Injection (DI) 的 global Guard 宜在 Module 中注册：

```ts
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
```

`APP_GUARD` 是 global Guard 的 framework token，不是 Decorator；它让 Guard 保持在 Dependency Injection context 中。

## 返回值与失败语义

`canActivate()` 可以返回 `boolean`、`Promise<boolean>` 或 `Observable<boolean>`：

- 返回 `true`：继续请求链；
- 返回 `false`：Nest 默认抛出 `ForbiddenException`；
- 主动抛出 `UnauthorizedException`、`ForbiddenException` 等：精确表达失败语义。

认证失败通常是 `401`，身份有效但权限不足通常是 `403`。不要把两者都压成相同状态码。

## Custom metadata 场景

Guard 已经知道当前 Handler 和 Controller class，因此适合读取它们的 static metadata。常见场景包括：

- `@Roles()`：声明允许访问的 role；
- `@RequirePermissions()`：声明所需 permission/claim；
- `@Public()`：让少数 Handler 跳过 global AuthGuard；
- `@CheckPolicies()`：声明需要执行的 authorization policy；
- `@TenantRequired()`：声明 route 是否要求 tenant context。

metadata 描述的是 route 的静态规则，不应存放当前用户、request 或数据库查询结果。动态数据仍应从 `ExecutionContext` 和 Service/Repository 获取。

### 使用 `SetMetadata()` 定义 `@Roles()`

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

`SetMetadata(metadataKey, metadataValue)` 的两个参数分别是：

- `metadataKey`：Guard 查找规则时使用的 key；应导出并在写入、读取两端复用，优先使用 `symbol` 避免冲突；
- `metadataValue`：附加到 Controller class 或 Handler method 上的值，这里是 `Role[]`。

`Roles(...roles)` 只是对 `SetMetadata()` 的类型安全封装。不要在业务代码中到处直接写 `SetMetadata('roles', ...)`，否则 key、value type 和命名容易失去约束。

### 在 Controller 和 Handler 上声明

```ts
@Roles(Role.User)
@Controller('notes')
export class NotesController {
  @Get()
  findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(): Promise<void> {
    return this.notesService.remove();
  }
}
```

这里 Controller-level metadata 提供默认规则 `Role.User`，`remove()` 上的 Handler-level metadata 声明更具体的 `Role.Admin`。最终是覆盖还是合并，由 Guard 选择的 `Reflector` method 决定。

### 使用 `Reflector` 读取 metadata

```ts
interface AuthenticatedRequest extends Request {
  user: {
    roles: Role[];
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles === undefined) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    return requiredRoles.some((role) => request.user.roles.includes(role));
  }
}
```

- `context.getHandler()` 返回当前 Handler method，是 method-level metadata target；
- `context.getClass()` 返回当前 Controller class，是 class-level metadata target；
- targets 数组的顺序表示优先级，这里先检查 Handler，再检查 Controller；
- `getAllAndOverride()` 返回第一个不为 `undefined` 的值，因此 Handler rule 覆盖 Controller 默认值。

要区分 `undefined` 和空数组：`undefined` 表示没有声明规则；`[]` 是明确声明的 metadata value。两者是否都放行必须由授权策略显式决定。

### Override 与 merge

若 Controller role 是默认值，而 Handler role 应完全替换它，使用：

```ts
this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
  context.getHandler(),
  context.getClass(),
]);
```

若 class 与 method 声明的 permission 都必须保留，使用：

```ts
const permissions = this.reflector.getAllAndMerge<Permission[]>(
  PERMISSIONS_KEY,
  [context.getClass(), context.getHandler()],
);
```

`getAllAndMerge()` 会合并多个 target 的 array/object metadata。合并后的 permission 应使用 `every()` 还是 `some()`，分别代表“全部满足”或“满足任一项”，必须由业务语义明确决定。

### 使用 `Reflector.createDecorator()`

`Reflector.createDecorator<T>()` 可以同时创建 metadata key 与类型安全 Decorator，避免手动维护 key：

```ts
import { Reflector } from '@nestjs/core';

export const RequiredRoles = Reflector.createDecorator<Role[]>();
```

声明和读取时直接使用 Decorator reference：

```ts
@RequiredRoles([Role.Admin])
@Delete(':id')
remove(): Promise<void> {
  return this.notesService.remove();
}

const roles = this.reflector.getAllAndOverride(RequiredRoles, [
  context.getHandler(),
  context.getClass(),
]);
```

`SetMetadata()` 适合需要 `@Roles(Role.Admin, Role.User)` 这类 rest parameter API 的场景；`Reflector.createDecorator()` 更容易保持 metadata value 与读取结果的类型一致。

### `@Public()` 跳过 global AuthGuard

global AuthGuard 常用“默认保护、显式公开”的方式：

```ts
export const IS_PUBLIC_KEY = Symbol('isPublic');
export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);
```

```ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return this.validateRequest(context);
  }

  private validateRequest(context: ExecutionContext): boolean {
    // 校验 credential，并把 authenticated user 写入 request context。
    return true;
  }
}
```

```ts
@Public()
@Post('login')
login(): Promise<TokenResponse> {
  return this.authService.login();
}
```

`@Public()` 只影响读取该 metadata 的 Guard，本身不会改变 Nest 的访问控制。若 Guard 忘记读取 `IS_PUBLIC_KEY`，Decorator 不会产生任何效果。

### Metadata 与 authorization 的边界

- metadata 只声明规则，Guard 负责结合 authenticated user 作出放行决定；
- role/permission 来自可信的 server-side identity，不信任客户端自行提交的字段；
- route-level metadata 适合粗粒度授权，resource ownership 仍需进入 Service/Repository 查询条件；
- metadata key 和 Decorator 集中定义并导出，不在多个 feature 中复制相同字符串；
- global Guard 应明确“未声明 metadata 时默认放行还是默认拒绝”，避免隐式安全策略。

## 工程边界

- Guard 负责是否放行，不负责转换 DTO。
- 资源所有权最终仍要进入 Service/Repository 查询条件，不能只检查角色。
- 客户端隐藏按钮不是授权，server-side Guard 和数据查询才是安全边界。
- 复用请求对象上的用户上下文时，应给请求类型增加明确声明，避免 `any`。

官方资料：[Guards](https://docs.nestjs.com/guards)、[Execution context](https://docs.nestjs.com/fundamentals/execution-context)、[Authorization](https://docs.nestjs.com/security/authorization)。本仓库示例：[第 8 课 RBAC](../08-authorization-rbac/index.md)。

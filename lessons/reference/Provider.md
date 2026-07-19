# Provider

Provider 是可以由 Nest IoC container 创建、组合和注入的 dependency。按创建方式和使用场景，可以先分成三类：

| 类型 | 典型写法 | 适用场景 |
| --- | --- | --- |
| 基础 Service | `providers: [NotesService]` | 应用用例、业务规则和依赖协作 |
| Custom Provider | `{ provide, useClass/useValue/useFactory/useExisting }` | 替换实现、注入配置、Factory 或 alias |
| Async Provider | `{ provide, useFactory: async () => ... }` | 启动阶段异步建立连接或加载配置 |

Service、Repository、Factory 和 Helper 都可以成为 Provider。NestJS 没有 `@Service()`；Service 是 class-based Provider 的常见职责与命名约定。

## 基础 Service

Service 通常承担应用用例、业务规则和跨 Repository 的协作，让 Controller 只负责协议适配。

```ts
import { Injectable, NotFoundException } from '@nestjs/common';

export interface Note {
  id: string;
  title: string;
}

@Injectable()
export class NotesService {
  private readonly notes = new Map<string, Note>();

  findOne(id: string): Note {
    const note = this.notes.get(id);

    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }

    return note;
  }

  create(note: Note): Note {
    this.notes.set(note.id, note);
    return note;
  }
}
```

### `@Injectable()`

`@Injectable(options?)` 为 class 添加 Dependency Injection metadata，使 Nest 可以分析 constructor dependency 并由 IoC container 创建 instance。

- 不传参数时使用 `Scope.DEFAULT`；
- `{ scope: Scope.REQUEST }` 为每个 request context 创建 instance；
- `{ scope: Scope.TRANSIENT }` 为每个 consumer 创建 instance；
- `{ durable: true }` 只用于特定的 request-scoped durable Provider tree，普通 Service 不应设置。

`@Injectable()` 不会单独完成注册。Service 还需出现在 Module 的 `providers` 中：

```ts
@Module({
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
```

`providers` 让当前 Module 可以解析 `NotesService`；`exports` 允许 importing Module 注入它。不要在多个 Module 重复注册同一个有状态 Service，否则可能得到多个 instance。

### Constructor injection

class-based Provider 可以直接使用 class token：

```ts
@Injectable()
export class NotesService {
  constructor(private readonly repository: NotesRepository) {}
}
```

Nest 使用 `NotesRepository` class 作为 injection token。不要在 Service 内手动 `new NotesRepository()`，否则会绕过 scope、实现替换和测试隔离。

### Service 边界

- Controller 负责 HTTP 输入输出，Service 不读取 Express/Fastify request/response。
- Service 负责用例编排，Repository 负责持久化细节。
- Service method 应表达业务输入，不必让所有内部调用都依赖 HTTP DTO。
- 可复用领域层更适合抛出 domain error，再由应用外层映射 HTTP exception。
- singleton Service 不保存 request-specific mutable state；用户、tenant、transaction 等 context 应显式传入。

## Custom Provider

当 class 本身不适合作为 token，或 Provider 的创建方式不是简单的 `new Class()` 时，使用 custom provider object。它必须包含 `provide`，并且只能选择一种创建策略。

### `useClass`

```ts
{
  provide: NOTE_REPOSITORY,
  useClass: PostgresNoteRepository,
}
```

`provide` 是对外暴露的 injection token，`useClass` 是 Nest 实际实例化的 class。适合按环境或配置替换实现。

### `useValue`

```ts
{
  provide: 'NOTE_OPTIONS',
  useValue: { maxTitleLength: 120 },
}
```

`useValue` 直接提供已有 value/object，不发生 class 实例化。适合静态配置、第三方 library instance 和测试替身；不要把 request-specific mutable object 注册成 singleton value。

### `useFactory`

```ts
{
  provide: NOTE_REPOSITORY,
  inject: [ConfigService],
  useFactory: (config: ConfigService): NoteRepository => {
    return new PostgresNoteRepository(config.getOrThrow('DATABASE_URL'));
  },
}
```

`inject` 列出 Factory 的 dependency token，Nest 解析后按数组顺序传给 `useFactory`。Factory 的返回值就是最终注入的 Provider value。

### `useExisting`

```ts
{
  provide: NOTE_READER,
  useExisting: NOTE_REPOSITORY,
}
```

`useExisting` 为已经注册的 Provider 创建 alias；两个 token 指向同一个 instance。它不同于 `useClass`，后者可能创建新的 instance。

### `@Inject()` 与 custom token

TypeScript interface 在运行时不存在，不能直接作为 injection token。依赖 interface、配置值或第三方对象时，使用稳定的 `string`/`symbol` token：

```ts
export const NOTE_REPOSITORY = Symbol('NOTE_REPOSITORY');

@Injectable()
export class NotesService {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly repository: NoteRepository,
  ) {}
}
```

`@Inject(token)` 的参数必须与 Provider 注册时的 `provide` 完全一致。优先导出并复用 `symbol` 常量，避免散落的字符串拼写错误。

### `@Optional()`

`@Optional()` 表示对应 dependency 未注册时注入 `undefined`，而不是让 application bootstrap 失败：

```ts
constructor(
  @Optional()
  @Inject('AUDIT_SINK')
  private readonly auditSink?: AuditSink,
) {}
```

它没有参数，只改变 dependency resolution 的失败行为。核心 Repository、transaction manager 等必要依赖不应标为 optional。

## Async Provider

Async Provider 是返回 `Promise` 的 Factory Provider。Nest 会等待 Promise resolve，再实例化依赖该 token 的其他 Provider，因此适合在 application bootstrap 阶段建立数据库连接、读取远程配置或初始化 SDK。

```ts
export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

const databaseProvider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<DatabaseConnection> => {
    const connection = new DatabaseConnection(
      config.getOrThrow('DATABASE_URL'),
    );

    await connection.connect();
    return connection;
  },
};
```

Async Provider 的参数语义与同步 `useFactory` 相同：

- `provide`：其他 consumer 使用的 injection token；
- `inject`：Factory dependency token 数组，顺序必须与函数参数一致；
- `useFactory`：返回 value 或 `Promise<value>` 的 Factory function。

如果 Factory reject，依赖图无法完成创建，application bootstrap 应失败。这通常比带着无效连接继续运行更安全。初始化逻辑需要注意：

- 设置明确的连接 timeout，避免 bootstrap 无限等待；
- 不在多个 Module 重复创建同一外部连接；
- 在 lifecycle hook 中关闭连接或释放资源；
- 将 Provider 从定义它的 Module 导出，consumer Module 再通过 `imports` 使用；
- 需要可配置复用时，将 Async Provider 封装进 Dynamic Module 的 `registerAsync()`/`forRootAsync()`。

## Scope 的共同规则

- `Scope.DEFAULT`：application lifecycle 内共享 singleton，通常是首选；
- `Scope.REQUEST`：每个 request context 创建 instance，并可能向依赖链上游传播；
- `Scope.TRANSIENT`：每个 consumer 获得独立 instance，不会像 request scope 一样向上冒泡。

Provider scope 必须与状态生命周期一致。连接池、配置和无状态 Service 通常应保持 singleton；只有确实依赖 request-local state 时才使用 request scope。

官方资料：[Providers](https://docs.nestjs.com/providers)、[Custom providers](https://docs.nestjs.com/fundamentals/custom-providers)、[Async providers](https://docs.nestjs.com/fundamentals/async-providers)、[Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)。本仓库示例：[第 2 课 Module 与 Dependency Injection](../02-modules-and-dependency-injection/index.md)。

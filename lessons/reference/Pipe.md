# Pipe

Pipe 处理即将传给 Handler 的单个参数，主要承担转换和校验。Pipe 抛出异常后，当前 Controller method 不会执行，异常进入 Nest 的异常层。

## 自定义转换 Pipe

```ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body' || typeof value !== 'object' || value === null) {
      return value;
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        typeof item === 'string' ? item.trim() : item,
      ]),
    );
  }
}
```

参数级注册：

```ts
@Post()
create(@Body(TrimStringsPipe) dto: CreateNoteDto): Promise<Note> {
  return this.notesService.create(dto);
}
```

`@Body(TrimStringsPipe)` 是 parameter-scoped 绑定：Pipe 只处理这个参数。`@Param('id', ParseUUIDPipe)`、`@Query('limit', ParseIntPipe)` 使用相同的末尾 Pipe 参数机制。

## `@UsePipes()`

`@UsePipes(...pipes)` 把 Pipe 绑定到 Controller class 或 Handler method：

```ts
@UsePipes(TrimStringsPipe)
@Post()
create(@Body() dto: CreateNoteDto): Promise<Note> {
  return this.notesService.create(dto);
}
```

- 参数可以是一个或多个 Pipe class/instance；传 class 时 Nest 负责实例化并支持 Dependency Injection；
- 放在 Controller class 上时处理该 Controller 的全部 Handler 参数，放在 method 上时只处理当前 Handler；
- 多个 Pipe 按绑定顺序执行，前一个 Pipe 的返回值会成为后一个 Pipe 的输入；
- `@UsePipes()` 是 Controller/method scope，parameter decorator 末尾传入 Pipe 则是 parameter scope。

示例中的 `@Post()`、`@Body()`、`@Param()` 属于 Controller routing 与参数读取；本章只说明它们作为 Pipe binding point 的部分。

Nest 还提供 `ParseIntPipe`、`ParseUUIDPipe`、`ParseEnumPipe`、`DefaultValuePipe`、`ValidationPipe` 等 built-in Pipe。

## 全局校验

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

- `transform`：把普通输入转换成声明类型或 DTO 实例；
- `whitelist`：移除没有校验 Decorator 的属性；
- `forbidNonWhitelisted`：发现额外属性时直接返回错误。

若 global Pipe 需要注入 Service，应使用 `APP_PIPE` 在 Module context 中注册，而不是在 `main.ts` 中手动 `new`：

```ts
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
```

`APP_PIPE` 是 global Pipe 的 framework token，不是 Decorator。这里用 `useClass` 时 Nest 调用默认 constructor，因此无法直接传 `ValidationPipeOptions`；需要 options 时可改用自定义 subclass，或用 `useFactory` 返回配置好的 instance。

## `ArgumentMetadata`

`transform(value, metadata)` 中常用字段：

- `type`：`body`、`query`、`param` 或 `custom`；
- `metatype`：参数声明的运行时类型；
- `data`：传给 `@Body('name')`、`@Param('id')` 等 Decorator 的键。

TypeScript 接口在编译后消失，无法作为可靠的 `metatype`；需要运行时校验时应使用类 DTO 或显式 schema。

## 工程边界

- Pipe 处理参数，不负责判断用户是否有权限。
- 转换不是通用安全消毒；SQL 参数化、输出编码和授权各有独立边界。
- global 策略保持一致，局部例外应显式注册 local Pipe。
- 深层对象转换应使用明确 DTO/schema，不要让通用递归逻辑静默修改任意输入。

官方资料：[Pipes](https://docs.nestjs.com/pipes)、[Validation](https://docs.nestjs.com/techniques/validation)。本仓库示例：[第 4 课 DTO 校验](../04-rest-dto-validation-swagger/index.md#全局管道pipe统一输入策略)。

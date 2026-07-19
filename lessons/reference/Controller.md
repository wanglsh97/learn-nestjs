# Controller

Controller 负责把传入请求适配为应用调用，并把返回值交给 Nest 序列化。业务规则应进入 Service 或其他 Provider，Controller 不直接承担持久化、事务和复杂授权。

## 最小实现

```ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(dto);
  }
}
```

## `@Controller()`

`@Controller(pathOrOptions?)` 是 Controller 的核心 class decorator。它把 class 标记为 Controller，并为其中的 Handler 建立共同的 routing metadata。

- 不传参数：不设置 route prefix，例如 `@Controller()`；
- 传 `string` 或 `string[]`：设置一个或多个 route prefix。示例中的 `'notes'` 使 `@Get(':id')` 最终匹配 `GET /notes/:id`；
- 传 `ControllerOptions`：可设置 `path`、`host`、`scope`、`version` 等选项。`path` 是 prefix，`host` 限制 host pattern，`scope` 控制 Controller instance 生命周期，`version` 声明 route version。

`@Controller()` 只声明 Controller 身份和 class-level routing 范围，不注册业务依赖，也不替代 method-level route decorator。Controller 仍需出现在某个 Module 的 `controllers` 中，Nest 才会创建它。

## 返回响应

优先直接返回值，让 Nest 负责状态码和序列化：

- 普通 `GET` 默认返回 `200`；
- `POST` 默认返回 `201`；
- 可用 `@HttpCode()`、`@Header()` 等 Decorator 调整协议行为；
- 可以返回普通值、`Promise` 或 RxJS `Observable`。

只有流式响应、文件下载或平台专属能力确实需要时，才直接注入 `@Res()`。一旦使用原生响应对象，通常就由当前方法负责发送响应；若只想设置少量响应属性，应明确使用 `@Res({ passthrough: true })`。

## 工程边界

- Controller 负责协议适配，Service 负责业务用例。
- DTO 表达外部输入；不要直接把数据库实体作为写入模型。
- 认证授权由 Guard 执行，输入转换与校验由 Pipe 执行。
- 不要在每个方法复制 `try/catch` 来统一错误结构，应使用异常和 Exception Filter。

官方资料：[Controllers](https://docs.nestjs.com/controllers)。本仓库示例：[第 4 课 Controller 与 DTO](../04-rest-dto-validation-swagger/index.md#控制器只接收已校验输入)。

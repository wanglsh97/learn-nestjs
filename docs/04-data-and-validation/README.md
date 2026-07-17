# 04. 数据与校验

## DTO

- TypeScript 类型只在编译期存在，不能单独保护运行时输入。
- DTO 使用具体的 `class`，配合 `class-validator` 装饰器提供运行时校验元数据。
- 输入 DTO、领域对象和数据库实体职责不同；项目变复杂后不要让一个类型承担全部职责。

## ValidationPipe

Demo 的全局配置展示了三个常用选项：

- `transform: true`：把普通输入转换为 DTO 实例，并支持基础类型转换。
- `whitelist: true`：移除 DTO 中未声明的属性。
- `forbidNonWhitelisted: true`：遇到额外属性直接返回错误，适合尽早暴露客户端问题。

## 配置

- 环境变量属于部署配置，不要提交真实密钥。
- 使用 `ConfigModule` 集中读取配置；较大项目应增加配置校验，避免错误延迟到首次请求才暴露。
- 仓库只提交 `.env.example`，本地 `.env` 已被 Git 忽略。

## 持久化边界

Demo 使用内存 `Map`，重点是展示 Nest 机制。接入数据库时，可以新增 Repository Provider，并让 `NotesService` 依赖抽象的数据访问能力；Controller 不需要知道数据来自内存、Prisma 还是 TypeORM。

## 对照代码

- DTO：`demo/src/notes/dto`
- 全局校验：`demo/src/app.setup.ts`
- 配置：`demo/src/app.module.ts`、`demo/.env.example`
- 当前内存存储：`demo/src/notes/notes.service.ts`

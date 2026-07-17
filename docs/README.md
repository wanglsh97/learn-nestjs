# 知识导航与学习路线

## 建议顺序

1. 先理解 [基础与心智模型](01-foundations/README.md)，知道 Nest 如何组织应用。
2. 掌握 [核心组件](02-core-components/README.md)，能够独立写出一个功能模块。
3. 沿着 [请求生命周期](03-request-lifecycle/README.md) 理解一次请求经过的扩展点。
4. 学习 [数据与校验](04-data-and-validation/README.md) 和 [认证与安全](05-security/README.md)。
5. 使用 [测试](06-testing/README.md) 固化行为，再补齐 [工程化](07-engineering/README.md)。
6. 有明确业务需求后再进入 [进阶能力](08-advanced/README.md)，不要为了使用技术而使用技术。

## 推荐学习循环

每个主题都按下面的循环学习：

1. 阅读该分类中的“核心结论”。
2. 打开分类末尾链接的 Demo 文件。
3. 修改一个行为，并先预测测试结果。
4. 运行单元测试和 E2E 测试验证理解。
5. 用 [知识点模板](topic-template.md) 写下自己的总结。

## Demo 覆盖关系

| 机制 | Demo 位置 |
| --- | --- |
| 应用启动与全局配置 | `demo/src/main.ts`、`demo/src/app.setup.ts` |
| 根模块与配置模块 | `demo/src/app.module.ts` |
| 功能模块 | `demo/src/health`、`demo/src/notes` |
| Controller / Provider / DI | `demo/src/notes/notes.controller.ts`、`notes.service.ts` |
| DTO 与全局校验 | `demo/src/notes/dto`、`demo/src/app.setup.ts` |
| Guard | `demo/src/common/guards/api-key.guard.ts` |
| Interceptor | `demo/src/common/interceptors/request-logging.interceptor.ts` |
| Exception Filter | `demo/src/common/filters/http-exception.filter.ts` |
| Swagger | `demo/src/app.setup.ts` 和各 Controller/DTO |
| 单元测试 / E2E | `demo/src/**/*.spec.ts`、`demo/test` |

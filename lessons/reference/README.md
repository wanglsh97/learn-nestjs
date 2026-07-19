# NestJS 核心能力参考

这里集中记录 NestJS 中最常用的核心能力，便于在实现功能时快速判断职责和注册位置。每篇 Reference 只展开与当前能力直接相关的 Decorator，包括作用目标、参数含义、默认行为和注册 scope；代码中的通用 Decorator 由对应主题说明。课程仍以各课 `index.md` 为事实来源；本目录不重复完整业务流程。

| 能力 | 主要问题 | 典型输入 | 典型结果 |
| --- | --- | --- | --- |
| [Controller](Controller.md) | HTTP 请求由谁接收 | 路径、查询、请求体 | 调用 Service 并返回协议结果 |
| [Module](Module.md) | 组件如何组织并形成边界 | Controller、Provider、imported Module | 封装后的 application graph |
| [Provider](Provider.md) | dependency 由谁创建和组合 | injection token、其他 Provider | 可注入的 instance 或 value |
| [Decorator](Decorator.md) | metadata 如何声明和复用 | class、method、parameter、property | Nest runtime 可读取的 metadata |
| [Middleware](Middleware.md) | 路由处理前的底层 HTTP 工作 | 原始请求与响应 | 继续管线或提前结束 |
| [Guard](Guard.md) | 当前请求是否允许进入路由 | ExecutionContext、路由元数据 | 放行、拒绝或抛出异常 |
| [Interceptor](Interceptor.md) | 如何观察或改写调用前后 | ExecutionContext、调用链 | Observable 结果或错误 |
| [Pipe](Pipe.md) | 参数如何转换与校验 | 单个路由参数及其元数据 | 转换后的值或异常 |
| [Exception Filter](ExceptionFilter.md) | 已抛出的异常如何映射为响应 | 异常、协议上下文 | 结构化错误响应 |

常见 HTTP 请求顺序可以简化为：

```text
Middleware → Guard → Interceptor 前置逻辑 → Pipe → Controller/Service
                                             ↓
响应   ← Interceptor 后置逻辑 ← 路由处理结果或错误

Exception Filter 负责处理进入异常层的未捕获异常，不应被理解成成功链路的最后一步。
```

更完整的顺序和 scope 规则见 [NestJS Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)。本仓库的可运行组合示例位于[第 3 课](../03-request-lifecycle/index.md)和[第 4 课](../04-rest-dto-validation-swagger/index.md)。

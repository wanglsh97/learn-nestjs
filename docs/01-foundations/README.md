# 01. 基础与心智模型

## 核心结论

- NestJS 是运行在 Node.js 上的服务端框架，核心价值是提供清晰的应用结构、依赖管理和统一扩展点。
- Nest 默认基于 Express，也可以切换 Fastify；多数业务代码不应该依赖具体 HTTP 适配器。
- 装饰器用于声明元数据，Nest 在启动阶段读取元数据，建立模块图、依赖关系和路由表。
- IoC 的重点不是“少写 `new`”，而是把对象的创建、组合和生命周期交给容器管理。

## 启动过程

1. `NestFactory.create(AppModule)` 创建应用和依赖注入容器。
2. Nest 从根模块递归扫描 `imports`，构建模块图。
3. 实例化 Provider，再把它们注入 Controller 或其他 Provider。
4. 注册路由与全局扩展点。
5. `app.listen()` 开始接收请求。

## 应形成的心智模型

- **Module 是边界**：描述一个功能由哪些组件组成，以及向外暴露什么。
- **Provider 是能力**：承载业务逻辑、数据访问或基础设施适配。
- **Controller 是协议入口**：负责 HTTP 输入输出，不承载复杂业务规则。
- **依赖方向应稳定**：协议层依赖业务能力，业务能力不应反向依赖 Controller。

## 对照代码

- 启动入口：`demo/src/main.ts`
- 应用配置：`demo/src/app.setup.ts`
- 根模块：`demo/src/app.module.ts`

# 02. 核心组件

## Module

`@Module()` 常用元数据：

| 字段 | 含义 |
| --- | --- |
| `imports` | 当前模块依赖的其他模块 |
| `controllers` | 当前模块负责实例化的 Controller |
| `providers` | 当前模块容器中的 Provider |
| `exports` | 允许被其他模块注入的 Provider |

功能应该围绕业务边界拆模块，而不是机械地按技术类型建立一个“所有 Service 模块”。

## Controller

- 用 `@Controller()` 定义路由前缀，用方法装饰器映射 HTTP 动词。
- 用参数装饰器提取 `@Param()`、`@Query()`、`@Body()`、`@Headers()` 等输入。
- Controller 应做协议转换和流程编排，把业务规则交给 Provider。

## Provider 与依赖注入

- `@Injectable()` 使类可以由 Nest 容器管理。
- 优先使用构造函数注入，让依赖显式、易测试。
- Provider 默认是单例作用域；只有明确需要按请求隔离时才使用 request scope。
- 跨模块使用 Provider 时，定义方必须 `exports`，使用方必须 `imports` 对应模块。

## 常见问题

- “Nest can't resolve dependencies”通常来自 Provider 未注册、模块未导入或循环依赖。
- `imports` 放模块，`providers` 放可注入对象；把两者放反是常见错误。
- 不要随意用 `forwardRef()` 掩盖双向依赖，先检查模块边界是否设计错误。

## 对照代码

- 功能模块：`demo/src/notes/notes.module.ts`
- Controller：`demo/src/notes/notes.controller.ts`
- Provider：`demo/src/notes/notes.service.ts`

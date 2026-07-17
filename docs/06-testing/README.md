# 06. 测试

## 分层策略

| 层级 | 重点 | 特点 |
| --- | --- | --- |
| 单元测试 | Provider 内部业务规则 | 快速、依赖少、定位精确 |
| 集成测试 | 多个 Nest Provider/Module 的组合 | 验证依赖注入与组件协作 |
| E2E 测试 | 从 HTTP 请求到响应的关键路径 | 最接近真实使用，但运行成本更高 |

## Nest 测试工具

- `Test.createTestingModule()` 创建可控的 Nest 测试容器。
- 用 `overrideProvider()` 替换数据库、消息队列或外部 API。
- E2E 中应复用正式应用配置，否则可能漏测全局 Pipe、Filter 或前缀。
- 不要只测试状态码，还应验证响应结构、权限边界和副作用。

## Demo 命令

```bash
npm test                 # 单元测试
npm run test:watch       # 监听模式
npm run test:cov         # 覆盖率
npm run test:e2e         # HTTP E2E
```

## 对照代码

- Provider 单元测试：`demo/src/notes/notes.service.spec.ts`
- E2E：`demo/test/app.e2e-spec.ts`
- 共享应用配置：`demo/src/app.setup.ts`

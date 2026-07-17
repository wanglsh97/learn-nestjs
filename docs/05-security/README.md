# 05. 认证与安全

## 先区分两个概念

- **认证（Authentication）**：确认请求者是谁。
- **授权（Authorization）**：确认这个身份能做什么。

Guard 可以读取请求信息和 Handler 元数据，因此很适合承载认证与授权判断。真实项目通常先由 Passport/JWT 策略解析身份，再由角色或权限 Guard 做授权。

## Demo 中的边界

Demo 使用 `x-api-key` 只是为了用最少代码演示 Guard：

- 查询接口公开。
- 创建、修改、删除接口使用 `ApiKeyGuard`。
- Key 来自环境变量 `DEMO_API_KEY`。

这不是完整生产认证方案。生产环境还应考虑：密钥安全存储、TLS、密码哈希、Token 过期与撤销、限流、CORS、Helmet、安全审计以及错误信息泄露。

## 设计建议

- 默认拒绝比默认允许更安全。
- Controller 只声明访问策略，不实现 Token 解析细节。
- 不在日志中打印密码、Token、Cookie 或完整个人数据。
- 授权规则必须有 E2E 测试，至少覆盖无身份、无权限和有权限三种路径。

## 对照代码

- Guard：`demo/src/common/guards/api-key.guard.ts`
- 路由策略：`demo/src/notes/notes.controller.ts`
- 未授权 E2E：`demo/test/app.e2e-spec.ts`

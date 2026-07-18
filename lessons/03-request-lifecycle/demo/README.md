# Lesson 03 Demo

增加 Middleware、Guard、Pipe、Interceptor 和 Exception Filter，用一个写笔记请求观察完整请求链路。

## 启动与演示

```bash
npm install
cd lessons/03-request-lifecycle/demo
npm run start:dev
curl http://localhost:3003/api/notes

# 不带密钥：观察 Filter 生成的 401 和 x-request-id 响应头
curl -i -X POST http://localhost:3003/api/notes \
  -H 'content-type: application/json' \
  -d '{"title":"Denied","content":"Missing API key"}'

# 带密钥：观察 Pipe 修剪空格、201 响应和 x-request-id
curl -i -X POST http://localhost:3003/api/notes \
  -H 'content-type: application/json' \
  -H 'x-api-key: learning-key' \
  -d '{"title":"  Lifecycle  ","content":"  Middleware to filter  "}'
```

省略 `x-api-key` 会得到由 Exception Filter 统一生成的 `401` 响应；带上密钥后，Pipe 会移除字符串两端空格，Interceptor 会在终端记录请求方法、路径和耗时。响应还包含 Middleware 生成或透传的 `x-request-id` Header。

## 验证

```bash
npm run lint
npm run build
```

本课不包含测试用例。依次执行上面的无密钥和带密钥请求，可以直接观察请求 ID、Guard/Filter 错误链路和 Pipe/Controller 成功链路；完整 DTO 校验在第 4 课加入。

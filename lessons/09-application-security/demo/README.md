# Lesson 09 Demo

本课增加 Helmet、CORS 来源白名单、全局与认证端点限流，以及 JWT 密钥启动校验。项目不包含测试用例。

## 启动

```bash
cd lessons/09-application-security/demo
cp .env.example .env
npm run start:dev
```

默认 API 为 `http://localhost:3009/api`，Swagger 为 `http://localhost:3009/docs`。

## 观察安全响应与 CORS

```bash
curl -I http://localhost:3009/api/health
curl -i http://localhost:3009/api/health -H 'Origin: http://localhost:3000'
curl -i http://localhost:3009/api/health -H 'Origin: https://untrusted.example'
```

第一条能看到 Helmet Header；允许来源获得 `Access-Control-Allow-Origin`，未允许来源不会获得该响应头。

## 观察认证限流

```bash
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w '%{http_code}\n' -X POST \
    http://localhost:3009/api/auth/login \
    -H 'content-type: application/json' \
    -d '{"email":"nobody@example.com","password":"wrong-password"}'
done
```

前五次返回 `401`，第六次返回 `429`。等待一分钟后窗口重置。

## 配置与静态验证

```bash
JWT_SECRET=short npm run start
npm run lint
npm run build
```

弱密钥命令应在监听端口前失败。当前限流存储位于单进程内，生产多实例需要共享存储或网关限流。

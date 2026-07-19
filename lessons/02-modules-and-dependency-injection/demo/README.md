# Lesson 02 Demo

在第 01 课基础上增加 Notes 功能模块、提供者（Provider）、跨模块导出和构造函数注入。`ClockService` 由 `ClockModule` 导出，`NotesService` 通过构造函数使用它。

## 启动与演示

```bash
npm install
cd lessons/02-modules-and-dependency-injection/demo
npm run start:dev
```

默认端口为 `3002`：

```bash
curl http://localhost:3002/api/health
curl -X POST http://localhost:3002/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"DI","content":"make dependencies explicit"}'
curl http://localhost:3002/api/notes
```

创建响应包含 UUID 和 ISO 时间；最后一次请求返回包含已创建笔记的数组。数据只存放在内存中，重启后清空。本课 DTO 只表达输入形状，校验在第 4 课加入。

## 验证

```bash
npm run lint
npm run build
```

本课不包含测试用例。通过 POST 后再 GET，可以直接观察模块依赖已正确解析，且两个请求共享默认单例 `NotesService` 的内存状态。

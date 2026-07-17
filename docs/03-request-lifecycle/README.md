# 03. 请求生命周期

一次典型 HTTP 请求可以按下面的顺序理解：

```text
Middleware
  → Guard
    → Interceptor（进入）
      → Pipe
        → Controller
          → Provider
      ← Interceptor（返回）
异常 → Exception Filter
```

## 扩展点如何选择

| 机制 | 适合解决的问题 | 不适合 |
| --- | --- | --- |
| Middleware | 通用请求预处理、第三方中间件 | 依赖具体 Handler 元数据的授权 |
| Guard | 认证、授权、决定是否继续执行 | 修改响应结果 |
| Pipe | 输入转换与校验 | 全局异常格式化 |
| Interceptor | 前后置逻辑、日志、耗时、响应映射 | 决定用户是否有访问权限 |
| Filter | 捕获异常并映射为协议响应 | 正常业务流程 |

## 范围

这些机制通常都支持全局、Controller 和 Handler 三种范围。优先把真正一致的策略放到全局；只与某个功能有关的策略放在模块或路由附近。

## 对照代码

- 全局注册：`demo/src/app.setup.ts`
- Guard：`demo/src/common/guards/api-key.guard.ts`
- Interceptor：`demo/src/common/interceptors/request-logging.interceptor.ts`
- Filter：`demo/src/common/filters/http-exception.filter.ts`

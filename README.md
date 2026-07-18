# Learn NestJS

这是一个面向有 TypeScript 和前端工程经验开发者的 NestJS 学习知识库。课程用 5 天、15 课快速建立完整后端能力，并以知识管理 API 作为贯穿项目。每一课都围绕问题背景、请求链路位置、可运行实现和真实工程取舍展开。

## 仓库结构

```text
learn-nestjs/
├── lessons/
│   ├── README.md          # 5 天课程路线与导航
│   └── <lesson>/
│       ├── index.md       # 中文学习文档
│       ├── index.en.md    # 英文学习文档
│       ├── diagram/       # 可编辑 SVG 图示
│       └── demo/          # 可独立运行的累计 NestJS 项目
├── openspec/              # 课程变更的规格与任务记录
└── package.json           # npm workspaces 入口
```

课程顺序、每日主题和每课入口统一维护在 [五天课程路线](lessons/README.md)。

## 课程 Demo

每个 Demo 都可以独立启动，并采用累计快照：第 N 课保留前 N-1 课的业务源码，在此基础上加入本课能力。默认端口为 `3000 + 课程序号`，即第 1 课使用 3001，第 15 课使用 3015。

先在仓库根目录安装一次依赖：

```bash
npm install
```

然后进入任意课程。以最终 Demo 为例：

```bash
cd lessons/15-deployment-and-cicd/demo
cp .env.example .env
npm run start:dev
```

启动后访问：

- API：`http://localhost:3015/api`
- Swagger UI：`http://localhost:3015/docs`
- 健康检查：`http://localhost:3015/api/health`

具体注册、认证和业务请求见该课程的 `demo/README.md`，不要跨课程套用端口或凭据。

## 验证方式

除第 13 课“自动化测试”外，课程 Demo 只保留业务源码，通过 Lint、构建和 README 中的本地请求验证：

```bash
npm run lint --workspace lesson-15-deployment-and-cicd-demo
npm run build --workspace lesson-15-deployment-and-cicd-demo
```

第 13 课专门包含单元和 E2E 测试：

```bash
npm test --workspace lesson-13-testing-demo
npm run test:e2e --workspace lesson-13-testing-demo
```

第 11、12 课的 Redis 与队列能力提供内存降级路径；没有 Docker 或 Redis 时仍可完成基础学习流程。

## 环境与仓库卫生

- 从每课 `.env.example` 创建本地 `.env`；不要提交真实密钥、Token 或生产地址。
- 不提交 `node_modules/`、`dist/`、`coverage/`、数据库文件或运行日志。
- 中文与英文课程文档保持相同结构和含义；复杂流程统一使用课程目录中的 SVG 图示。

## 参考资料

- [NestJS 官方文档](https://docs.nestjs.com/)
- [TypeORM 文档](https://typeorm.io/)

## License

本项目采用 [MIT License](LICENSE)。

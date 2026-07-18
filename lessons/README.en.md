# Five-Day Course Roadmap

This course is designed for experienced TypeScript/frontend engineers moving toward full-stack development. It contains 15 lessons—three per day—and evolves the knowledge-management API in `demo/` throughout the course.

## Day 1: NestJS Core

1. [NestJS Architecture and Bootstrap](01-nestjs-architecture/index.en.md) — [Demo](01-nestjs-architecture/demo/README.md)
2. [Modules and Dependency Injection](02-modules-and-dependency-injection/index.en.md) — [Demo](02-modules-and-dependency-injection/demo/README.md)
3. [Request Lifecycle](03-request-lifecycle/index.en.md) — [Demo](03-request-lifecycle/demo/README.md)

## Day 2: APIs and Data

4. [REST, DTOs, Validation, and Swagger](04-rest-dto-validation-swagger/index.en.md) — [Demo](04-rest-dto-validation-swagger/demo/README.md)
5. [Databases, ORM, and Migrations](05-database-orm-migrations/index.en.md) — [Demo](05-database-orm-migrations/demo/README.md)
6. [CRUD, Pagination, Errors, and Configuration](06-crud-pagination-errors-config/index.en.md) — [Demo](06-crud-pagination-errors-config/demo/README.md)

## Day 3: Authentication and Security

7. [Users and JWT Authentication](07-jwt-authentication/index.en.md) — [Demo](07-jwt-authentication/demo/README.md)
8. [Authorization and RBAC](08-authorization-rbac/index.en.md) — [Demo](08-authorization-rbac/demo/README.md)
9. [Application Security](09-application-security/index.en.md) — [Demo](09-application-security/demo/README.md)

## Day 4: Production Business Capabilities

10. [Transactions, Concurrency, and Idempotency](10-transactions-concurrency-idempotency/index.en.md) — [Demo](10-transactions-concurrency-idempotency/demo/README.md)
11. [Redis and Caching](11-redis-caching/index.en.md) — [Demo](11-redis-caching/demo/README.md)
12. [Queues and Background Jobs](12-queues-and-background-jobs/index.en.md) — [Demo](12-queues-and-background-jobs/demo/README.md)

## Day 5: Quality and Delivery

13. [Automated Testing](13-testing/index.en.md) — [Demo](13-testing/demo/README.md)
14. [Logging and Observability](14-observability/index.en.md) — [Demo](14-observability/demo/README.md)
15. [Deployment and CI/CD](15-deployment-and-cicd/index.en.md) — [Demo](15-deployment-and-cicd/demo/README.md)

The Chinese version of each lesson is available as `index.md` in the same directory.

## Running a demo

Each demo is a complete NestJS project and a cumulative snapshot of the previous lesson. Install the workspace once from the repository root, then enter any lesson's `demo/` directory:

```bash
npm install
cd lessons/01-nestjs-architecture/demo
npm run start:dev
```

The demos use ports `3001` through `3015`. From lesson 11 onward, Docker Compose can start Redis; the application remains runnable with an in-memory fallback when Redis is absent.

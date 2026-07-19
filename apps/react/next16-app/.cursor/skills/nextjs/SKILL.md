---
name: nextjs
description: >-
  Next.js App Router 全栈：服务端/客户端组件、路由、Route Handlers、Server Actions、
  数据获取与缓存、metadata。在编写或重构 Next 15+ / Next 16 应用、页面、API、部署相关任务时使用。
metadata:
  author: project
  version: "2026.3"
  stack: "Next.js 16, React 19, App Router, Turbopack（默认 dev）"
---

# Next.js（App Router）技能

本仓库目标栈为 **Next.js 16 + React 19 + TypeScript**，使用 **App Router**（`app/` 目录）。与 **Vercel React 最佳实践**（`.cursor/skills/react-best-practices`）配合使用：架构与路由以本技能为准，性能与重渲染以该技能为准。

## 何时应用

- 新增/修改页面、`layout`、`loading`、`error`、`not-found`
- 实现 `app/api/**/route.ts` 或 Server Actions
- 区分 Server / Client Component、流式与 Suspense
- SEO：`metadata` / `generateMetadata`
- 与 Edge / Node runtime、`next.config` 相关的问题

## 核心速查

| 主题 | 说明 | 详见 |
|------|------|------|
| 目录与路由 | `app/`、`page.tsx`、`layout.tsx`、动态段、`route.ts` | [references/app-router.md](references/app-router.md) |
| 数据与缓存 | `fetch` 缓存、`revalidate`、`unstable_cache`、Server Component 数据流 | [references/data-and-caching.md](references/data-and-caching.md) |
| Route Handlers | `GET/POST/...`、`Request`/`Response`、表单与 JSON | [references/route-handlers-and-actions.md](references/route-handlers-and-actions.md) |

## 与本项目其它技能的关系

| 技能 | 用途 |
|------|------|
| `react-best-practices` | React/Next 性能、瀑布请求、包体、重渲染 |
| `web-design-guidelines` | UI 可访问性 / 体验审查（按需拉取上游指南） |
| `deploy-to-vercel` | 部署到 Vercel 的流程与脚本 |

## 官方文档

优先查阅当前版本的 [Next.js 文档](https://nextjs.org/docs)（Routing、Data Fetching、Caching、API Routes）。

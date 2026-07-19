# App Router 结构

## 约定

- **`app/`**：路由即文件夹；`page.tsx` 为页面 UI，`layout.tsx` 包裹子段。
- **特殊文件**：`loading.tsx`、`error.tsx`、`not-found.tsx`、`template.tsx`（按官方说明选用）。
- **动态路由**：`[id]`、`[...slug]`；路由组 `(group)` 不改变 URL 路径。
- **并列路由 / 拦截路由**：按官方文档使用 `@slot`、`(.)` 语法。

## Server vs Client

- 默认 **Server Component**：可直接 `async`、可访问服务端 API/文件/密钥，勿使用浏览器-only API。
- 需要状态、事件、`useEffect`、浏览器 API 时：在文件顶行加 **`"use client"`**，尽量缩小客户端边界。

## 页面 Props（Next 15+）

- **`params`**、**`searchParams`** 在页面中为 **Promise**（类型以项目 `next` 版本为准），需 **`await`** 后再使用。
- 生成静态参数：`generateStaticParams`。

## 导航

- 使用 **`next/link`** 做客户端导航；不要用 `<a>` 整页刷新跳内部路由（除非刻意）。

## Metadata

- 默认导出 `metadata` 或异步 **`generateMetadata`** 用于 SEO/Open Graph。

## 样式

- 全局样式在根 `layout` 引入；组件级可用 CSS Modules、`tailwind` 等与本项目一致的方式。

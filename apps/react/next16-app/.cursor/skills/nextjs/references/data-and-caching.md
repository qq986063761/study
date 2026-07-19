# 数据获取与缓存（概览）

## Server Component 中

- 可在 `async` 组件内直接 **`await fetch(...)`** 或与数据库/SDK 通信；注意默认缓存语义以当前 Next 版本文档为准。
- 需要 **禁用缓存** 时：为 `fetch` 设置 `cache: 'no-store'` 或等价策略（见官方 *Fetching Data* / *Caching* 章节）。
- **`fetch` 的 `next: { revalidate: N }`** 用于按秒级 ISR 风格重新验证（行为以文档为准）。

## 客户端

- 在 Client Component 中用 **`useEffect` + `fetch`**、或 SWR/React Query 等；避免在客户端重复拉取本可在服务端一次完成的数据。

## Server Actions

- 表单 **`action={...}`** 或 `formAction` 绑定 async 函数；注意校验与鉴权（与 API Route 同等对待）。
- 变更数据后可用 **`revalidatePath` / `revalidateTag`** 使缓存失效（按官方推荐用法）。

## 不要混淆

- **Secret**：仅服务端（Server Component、Route Handler、Server Action），勿传入 Client Component props。

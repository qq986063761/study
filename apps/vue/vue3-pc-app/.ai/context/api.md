# API 上下文

这个文件说明当应用接入后端服务时，API 代码应该如何组织。

## 当前状态

当前仓库还没有成型的 `src/api` 目录，也没有统一的 HTTP 客户端。现有页面主要是本地演示。

## 推荐结构

需要接入 API 时，先建立小而清晰的 API 层，不要在组件里直接散落 `fetch` 或请求客户端调用。

```text
src/api/
  client.ts          统一请求客户端和拦截器
  modules/
    user.ts          按业务域拆分的 API 函数
    dashboard.ts
```

如果后续选择 Axios 或其他请求库，需要把该决策记录到 `.ai/memory/decisions/`。

## API 函数规则

- 从业务域模块导出有类型的函数。
- 请求和响应类型尽量靠近 API 模块；多个模块复用时再抽到共享类型文件。
- 组件和 store 调用 API 函数，不直接拼 URL。
- 后端字段差异或兼容逻辑尽量在 API 层归一化。
- 不要静默吞掉错误；要么返回类型化结果，要么抛出可由调用方处理的错误。

## 命名规则

- API 函数使用动词开头：`fetchUsers`、`createUser`、`updateUser`、`deleteUser`。
- 请求和响应类型使用清晰名称：`FetchUsersParams`、`UserListResponse`。
- 除临时演示外，避免使用 `getData` 这类含糊命名。

## 环境变量

- Vite 环境变量必须以 `VITE_` 开头。
- 不要在源码里硬编码生产域名。
- 如果在 `vite.config.ts` 中新增代理，需要同步记录到本文件。

## 文件作用

用这个文件回答：“如何引入网络请求，同时不让后端细节散落到 UI 中？”

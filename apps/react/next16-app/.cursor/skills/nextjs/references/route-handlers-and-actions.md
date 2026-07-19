# Route Handlers 与 Server Actions

## `app/**/route.ts`

- 导出 HTTP 方法函数：`GET`、`POST`、`PUT`、`PATCH`、`DELETE` 等。
- 签名：`(request: Request, context: { params: Promise<...> })`（**`params` 多为 Promise**，需 `await`）。
- 返回 **`Response` / `NextResponse.json(...)`**；设置状态码与头部。
- 读 body：`await request.json()`、`await request.formData()` 等。

## 与 Server Actions 的选择

- **面向 REST/外部系统/Webhook**：优先 Route Handler。
- **面向同一应用内表单提交、强类型服务端变更**：可用 Server Action。

## 上传与二进制

- `multipart/form-data` 使用 `request.formData()`，文件为 Web **`File`**；大文件注意运行时限制与流式处理（按部署环境调整）。

## CORS / 鉴权

- 若被浏览器跨域调用，需显式处理 CORS；敏感操作必须校验 session/token。

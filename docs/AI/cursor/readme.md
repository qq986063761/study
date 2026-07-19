# Cursor 使用 Claude 等模型

若访问模型不稳定或需走代理，可按下面设置。

## 1. 代理（与 VS Code 一致）

**路径：** `File` → `Preferences` → `Settings`（或 `Cursor` → `Settings`）→ 搜索 `proxy`

在 **HTTP/HTTPS 代理** 等项中填写你的代理地址（如 `http://127.0.0.1:17890`），按需启用。

## 2. 网络协议改为 HTTP/1.1

**路径：** `Cursor` → `Settings` → **Network**（网络）

将相关选项改为使用 **HTTP/1.1**（部分环境在 HTTP/2 下与代理或 TLS 不兼容时，可缓解连接问题）。

---

*说明：具体菜单名称以当前 Cursor 版本为准；若找不到某项，可在 Settings 搜索框输入 `proxy`、`http` 定位。*

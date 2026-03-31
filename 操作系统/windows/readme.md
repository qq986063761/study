# Windows 使用笔记

## winget 常用资料

`winget` 是 Windows 官方包管理器，可用于安装、升级、卸载软件。

### 常用命令

```powershell
# 查看 winget 版本
winget --version

# 搜索软件
winget search python

# 安装软件
winget install Python.Python.3.11

# 查看已安装软件
winget list

# 升级所有可升级软件
winget upgrade --all

# 卸载软件
winget uninstall Python.Python.3.11

# 查看当前源
winget source list

# 手动更新源（刷新索引）
winget source update

# 重置源（源异常时使用）
winget source reset --force
```

### 参考资料

- 官方文档：https://learn.microsoft.com/windows/package-manager/winget/
- 软件清单仓库：https://github.com/microsoft/winget-pkgs

---

## PowerShell 无法加载脚本文件

### 典型报错

```text
live-server : 无法加载文件 d:\Program Files\nodejs\live-server.ps1，因为在此系统上禁止运行脚本。
CategoryInfo          : SecurityError: (:) []，PSSecurityException
FullyQualifiedErrorId : UnauthorizedAccess
```

### 原因

PowerShell 执行策略限制了本地脚本运行。

### 解决步骤

1. 以管理员身份打开 PowerShell
2. 执行：

```powershell
Set-ExecutionPolicy RemoteSigned
```

3. 输入 `Y`（或 `A`）确认

### 可选：只改当前用户（更安全）

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 可选：恢复默认限制

```powershell
Set-ExecutionPolicy Restricted
```
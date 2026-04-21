# Windows 使用笔记

## Intel 13/14 代 CPU 游戏稳定性问题（着色器编译崩溃）

### 现象

在 Intel 13 或 14 代 CPU 设备上运行部分游戏时，可能在编译着色器阶段出现以下问题：

- 稳定性问题
- 显存不足提示
- 游戏崩溃到桌面
- 蓝屏死机

### 处理思路

可通过适当降低 CPU 的 Performance Core Ratio 来规避问题。

### 操作步骤

1. 下载并安装 Intel XTU：
   - <https://www.intel.com/content/www/us/en/download/17881/intel-extreme-tuning-utility-intel-xtu.html>
2. 安装完成后重启电脑。
3. 打开 Intel XTU，调整 `Performance Core Ratio`，适当降低倍率后点击 `Apply` 生效。
   - 示例：Intel i9-13900K 默认 `55x`，可尝试降低到 `53x` 或 `52x`。

---

## 应用已卸载但仍出现在应用列表

### 场景

应用已经卸载，但在系统应用列表中仍显示，且无法再次卸载。

### 处理方法

删除注册表中对应项：

`HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall`

---

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

- 官方文档：<https://learn.microsoft.com/windows/package-manager/winget/>
- 软件清单仓库：<https://github.com/microsoft/winget-pkgs>

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

1. 以管理员身份打开 PowerShell。
2. 执行以下命令：

```powershell
Set-ExecutionPolicy RemoteSigned
```

3. 输入 `Y`（或 `A`）确认。

### 可选：仅修改当前用户（更安全）

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 可选：恢复默认限制

```powershell
Set-ExecutionPolicy Restricted
```
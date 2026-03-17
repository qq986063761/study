# 资源
- [官网](https://openclaw.ai/)

# 安装
- 要求切换到 node 版本 22 以上
- windows powershell安装：iwr -useb https://openclaw.ai/install.ps1 | iex
- windows cmd安装：curl -fsSL https://openclaw.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
- mac安装：curl -fsSL https://openclaw.ai/install.sh | bash

# 安装完检查版本
- openclaw --version
- openclaw -v

# 卸载 
- openclaw uninstall --all --yes --non-interactive
- npm uninstall -g openclaw
- 移除残留
```bash
Remove-Item -Recurse -Force "$env:USERPROFILE\.openclaw"
Remove-Item -Recurse -Force "$env:USERPROFILE\.clawdbot"
Remove-Item -Recurse -Force "$env:USERPROFILE\.moltbot"
```
- 删除任务计划 schtasks /Delete /F /TN "OpenClaw Gateway"

# 开始配置
- openclaw onboard --install-daemon
- --install-daemon 参数会将 Gateway 安装为后台服务，实现开机自启

# 服务
- 检查状态 openclaw gateway status
- 启动服务 openclaw gateway start
- 重启服务 openclaw gateway restart
- 停止服务 openclaw gateway stop
- 安装服务 openclaw gateway install
- 卸载服务 openclaw gateway uninstall

# 打开 openclaw 聊天
- 终端打开 openclaw tui
- 网页打开 openclaw dashboard
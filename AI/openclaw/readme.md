# 资源
- [官网](https://openclaw.ai/)

# 安装
- 要求切换到 node 版本 22 以上
- windows powershell安装：iwr -useb https://openclaw.ai/install.ps1 | iex
- windows cmd安装：curl -fsSL https://openclaw.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
- mac安装：curl -fsSL https://openclaw.ai/install.sh | bash

# 配置
- openclaw onboard --install-daemon
- --install-daemon 参数会将 Gateway 安装为后台服务，实现开机自启

# 服务
- 检查状态 openclaw gateway status
- 启动服务 openclaw gateway start
- 重启服务 openclaw gateway restart

# 打开网页控制台
- openclaw dashboard
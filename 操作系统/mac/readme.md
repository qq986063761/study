# 设置代理，开了vpn下载国外软件用
- export https_proxy=http://127.0.0.1:17890 http_proxy=http://127.0.0.1:17890 all_proxy=socks5://127.0.0.1:17890
- 临时移除代理 unset https_proxy http_proxy all_proxy

# 安装 homebrew 包管理工具
- 官方源 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
- 国内源 /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
  - 国内源安装最后提醒重启终端执行 source /Users/用户名/.zprofile 要注意
- 更新 brew update

# 卸载 homebrew
- 官方卸载脚本（推荐）：`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"`
- 国内源：/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/uninstall.sh)"


# 安装 axe.store 包管理工具
- axe.store源 curl -fsSL https://axel.vercel.app/install | bash
- axe.store国内源 curl -fsSL https://gitee.com/kuaibiancheng/store/raw/master/install.sh | bash

# 连服务器
- mac直接连服务器 ssh root@114.55.102.39

# windterm 连服务器问题
- kex error : no match for method encryption client->server: server [aes128-ctr,aes192-ctr,aes256-ctr], client [aes256-gcm@openssh.com]
会话已断开连接，按回车重新连接。
- 
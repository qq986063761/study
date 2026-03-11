# 设置代理，开了vpn下载国外软件用
export https_proxy=http://127.0.0.1:17890 http_proxy=http://127.0.0.1:17890 all_proxy=socks5://127.0.0.1:17890

# 安装 homebrew
- 官方源 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
- 国内源 /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
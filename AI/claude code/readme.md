# mac 安装

## 用Homebrew安装 
- 没 homebrew 就先装 homebrew：/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
- brew install --cask claude-code
- curl -fsSL https://claude.ai/install.sh | bash

## 用 node 安装，node 要 18 以上版
- 可以用 fnm 或 nvm 装 node18 以上版本，再切
- npm install -g @anthropic-ai/claude-code 

## 永久设置 apikey（这里是ai中转平台的方案 https://www.helpaio.com/transit）
- 用zsh终端
echo 'export ANTHROPIC_BASE_URL="你的中转url平台地址"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="你的API密钥"' >> ~/.zshrc
source ~/.zshrc
- 用 bash 终端
echo 'export ANTHROPIC_BASE_URL="你的中转url平台地址"' >> ~/.bash_profile
echo 'export ANTHROPIC_AUTH_TOKEN="你的API密钥"' >> ~/.bash_profile
source ~/.bash_profile

## 重新打开终端后验证是否成功
- claude --version

# windows 安装

## 用 node 安装，node 要切换到 16 版本以上再装，但只能在你安装的版本下使用
- npm install -g @anthropic-ai/claude-code

## 在 ide vscode 中装插件
- Claude Code for VS Code

## 直接安装好像报错，暂时记录一下
- 用powershell：irm https://claude.ai/install.ps1 | iex
- 用cmd安装：curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
- winget install Anthropic.ClaudeCode

## 永久设置apikey（这里是ai中转平台的方案 https://www.helpaio.com/transit）
- 设置
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://b.onerouter.com/api", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "你的平台秘钥", [System.EnvironmentVariableTarget]::User)
- 查看
[System.Environment]::GetEnvironmentVariable("ANTHROPIC_BASE_URL", [System.EnvironmentVariableTarget]::User)
[System.Environment]::GetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", [System.EnvironmentVariableTarget]::User)

## 重新打开终端后验证是否成功
- 如果是vscode插件，直接插件或F1搜claude相关命令打开就行
- 其他方式安装 claude --version



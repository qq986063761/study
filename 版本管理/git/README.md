# 资源
- [中文官网](http://git.oschina.net/progit/)
- [阮一峰日志](https://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)
- [git学习](https://learngitbranching.js.org/?locale=zh_CN)
- [github](https://github.com/)
- [gitee](https://gitee.com/)
- [coding](https://coding.net/)
- [sourcetree](https://www.sourcetreeapp.com/)
- [fork]()

# 简介
- 回滚提交：只会将操作分支的提交内容回滚；
- 重置当前分支到此次提交
  - 强行合并：只保留此分支提交内容，之后的提交完全丢弃；
  - 混合合并|软合并：保留此分支提交内容，之后的提交会保留到暂存区，丢弃后会产生新的拉取，重新拉取后所有之后的提交会还原；

# ssh 拉代码

## windows 
- ssh-keygen -t rsa -b 4096 -C "986063761@qq.com" 会给你默认到  C:\Users\wanpeng\.ssh 下
- 打开之前添加目录下的公钥 id_rsa.pub，复制内容到 GitHub 账户设置中的 SSH keys 部分
- 登记私钥 ssh-add $env:USERPROFILE\.ssh\id_rsa 就不用每次输入密码了
  - 如果报错找不到文件
  - 检查 windows 服务中的 OpenSSH Authentication Agent 是否开启
  - 然后终端 PowerShell 执行 Get-Service ssh-agent 检查状态是否 Stopped
  - 如果上一步是 Stopped 执行：Start-Service ssh-agent
  - 然后执行：Set-Service -Name ssh-agent -StartupType Automatic
- 拉代码 git clone git@github.com:qq986063761/study.git

## mac
- ssh-keygen -t rsa -b 4096 -C "986063761@qq.com"
<!-- - eval "$(ssh-agent -s)" -->
- 登记私钥 ssh-add ~/.ssh/id_rsa

# 配置
- 配置用户名：git config --global user.name "WanPeng"
- 配置邮箱：git config --global user.email "986063761@qq.com"
- 配置代理：git config --global http.proxy 127.0.0.1:17890
- 配置代理：git config --global https.proxy 127.0.0.1:17890
- 取消配置代理：git config --global --unset http.proxy
- 取消配置代理：git config --global --unset https.proxy

# 获取代码
- git clone STORE_NAME：初始化获取远端仓库代码到本地
- git pull [origin BRANCH_NAME]：从远端仓库拉取最新代码到本地，可能会出现冲突代码

# 获取两个分支之间的代码行数变化
git log feature/20241230-okr6.13..feature/20250211-okr6.14 --author="wanpeng" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "新增行数: %s\n删除行数: %s\n净增行数: %s\n", add, subs, loc }'

# 分支
- git branch 
  - -a：查看远端所有分支
  - -d BRANCH_NAME：删除分支
- git checkout BRANCH_NAME：切换分支
  - -b BRANCH_NAME：创建新分支，并切换到新分支
  - .：丢弃当前所有更改
- git add FILE_NAME：暂存指定文件的更改
  - *.EXT_NAME：暂存指定扩展名的文件的更改
  - .：暂存所有更改
- git commit
  - -m 'INFO'：提交暂存区的更改到本地仓库
- git reset .：回退当前暂存区更改到工作区
- git push [origin BRANCH_NAME]：推送提交的更改到指定分支
- git merge BRANCH_NAME：将指定分支合并到当前所在分支
- git diff SOURCE_BRANCH_NAME TARGET_BRANCH_NAME：查看分支和分支的不同

# 日志
- git status：查看当前 git 状态（所在分支等等）
- git log [--pretty=oneline FILE_NAME]：查看提交日志
- git show 【提交 hash 码】：查看改动历史

# 分支规范
- 开发分支：develop/child
- 功能开发：feature/child
- bug 修复：bugfix/child
- 版本发布：release/child
- 产品分支：master

# sourcetree 

## 强制回滚代码
- 直接选中要回滚的那次提交，然后选择回滚提交，会强行把这一次提交的改动全部回滚，直接生成新推送

## 安全回滚代码
- 当前在最新节点，选中历史节点右键，选择“将分支重置到这次提交”，选择“强行合并”（这一个历史节点改动不会被还原）；
- 然后现在已经在历史节点了，再右键选中当前最新节点，选择“将分支重置到这次提交”，选择“软合并”（这时候历史节点后所有提交都已经还原了）；
- 如果有代码改动，需要对比一下是否需要保留还是丢弃

## 将推送错分支的某次提交提交到正确分支（仅适合同一个版本的项目，加入有完全的两个不同版本的项目就不适合了）
- 假如：master 分支上推送了代码，但是我本来要提交到 test 分支的，则切换到 test 分支，选中 master 分支上的那次提交，然后选择变基

## 将推送错分支的某次提交提交到正确分支
- 选中某次提交，右键-遴选，然后确定后就会将这次提交的改动变到当前我所在的分支


# bug

## gitignore无效
- 执行 git rm -r --cached . 清除缓存

## 拉代码安全报错 fatal: unable to access 'https://github.com/qq986063761/study.git/': schannel: SEC_E_UNTRUSTED_ROOT (0x80090325)
- git config --system http.sslbackend openssl
- git config --global http.sslVerify "false"

## 拉代码安全报错 fatal: unable to access 'https://github.com/qq986063761/study.git/': Recv failure: Connection was reset
- 是不是开了 vpn，用 git 命令配置代理

## 拉代码安全报错 fatal: unable to access 'https://github.com/qq986063761/study.git/': TLS connect error: error:0A000126:SSL routines::unexpected eof while reading
- 开了代理后报错这个就再取消代理


# tortoiseGit


测试
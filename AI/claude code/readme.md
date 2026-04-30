# mac 安装

## 用Homebrew安装 
- 没 homebrew 就先装 homebrew：/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
- brew install claude-code 或 brew install --cask claude-code
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


---

# 省 Token 方案

## 核心原理

- 计费公式：总费用 = Input Tokens × 输入单价 + Output Tokens × 输出单价
- Input 占 70%–90%，是优化重点
- 最大黑洞：项目文件自动读取（一次交互常占 80% Input）

---

## 方法一：.claudeignore 文件过滤（立省 60%+）

在项目根目录创建 `.claudeignore`，语法同 `.gitignore`：

```
# 依赖与构建（最大黑洞）
node_modules/
dist/
build/
.next/
__pycache__/

# 锁文件/日志
*.lock
package-lock.json
*.log

# 版本控制/IDE
.git/
.idea/
.vscode/

# 资源/缓存
*.png
*.jpg
*.svg
*.ico
.cache/
coverage/
```

效果：单次交互从 15 万 → 6 万 Token，降 60%

---

## 方法二：/compact 上下文压缩（省 88%）

- 手动压缩：对话到阶段性节点（如完成一个功能）后输入 `/compact`
- 带指令压缩：`/compact 保留代码修改与文件路径，丢弃分析过程`
- 自动压缩：`/config` → 开启 `Auto-compact enabled`

效果：25,000 → 3,000 Token，省 88%

---

## 方法三：CLAUDE.md 文档驱动（省 30%+）

项目根目录建 `CLAUDE.md`，一次性告诉 AI 项目结构、技术栈、命令，减少 AI 用 cat/find/grep 探索文件的 Token 消耗。

---

## 方法四：/memory 记忆固化（省 40%+）

```
/memory 项目用 Next.js 14 + TypeScript，接口规范见 docs/api.md
/memory list        # 查看
/memory delete [key] # 删除
```

效果：不用每次重复粘贴配置，省 40%+ 重复输入

---

## 方法五：Plan Mode 先规划再执行（省 20%+）

- 快捷键：`Shift+Tab`
- 作用：先让 AI 出执行计划，确认后再执行，避免无效探索和反复重做

---

## 方法六：/model 按任务切换模型（省 30%–80%）

```
/model haiku    # 简单任务（语法、小函数），单价最低
/model sonnet   # 复杂任务（架构、多文件）
/model opus     # 超复杂，仅必要时用
```

---

## 方法七：精简工具输出（省 90%）

- `/config` 开启「精简工具输出」，去掉 ANSI 颜色、进度条、空行
- 长输出只保留错误堆栈与失败用例

效果：npm test 类输出 25,000 → 2,500 Token，省 90%

---

## 10 步实战清单

1. 项目根目录建 `.claudeignore`，排除依赖/构建/日志/资源文件
2. 建 `CLAUDE.md`，写清技术栈、目录、命令
3. `/config` 开启自动压缩（Auto-compact）
4. 长对话手动 `/compact`，阶段性清理
5. `/memory` 存项目配置、规范，不重复输入
6. 复杂任务用 Plan Mode（`Shift+Tab`），先计划再执行
7. 按任务切换模型：简单用 Haiku，复杂用 Sonnet
8. 关闭不必要自动功能（如实时补全、全项目扫描）
9. 不同功能开新会话，不堆积多任务历史
10. `/usage` 定期查看 Token 使用，定位消耗黑洞

---

## 关键原则

- **Input 是核心**：优先优化文件读取、上下文、指令长度
- **宁可多排除**：被排除文件可手动粘贴，比自动扫描划算
- **及时清理**：长对话、多任务必压缩/清理，避免历史膨胀
- **模型匹配**：不盲目用高端模型，按任务选档位

# 允许ai所有权限
- 项目下 .claude/settings.local.json 写
```json
{
  "permissions": {
    "allow": [
      "Bash(*)",
      "Read(*)",
      "Write(*)"
    ]
  }
}
```
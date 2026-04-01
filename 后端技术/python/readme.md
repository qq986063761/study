# Python 版本管理与安装速查（Windows / macOS）

这份文档给你三套方案：

- Windows：`pyenv-win`
- macOS：`pyenv`
- 跨平台（Windows/macOS/Linux）：`uv`

---

## 一、Windows：`pyenv-win`

### 1) 安装（PowerShell）

> 先确保能使用 `winget`，然后执行：

```powershell
winget install pyenv-win.pyenv-win
```

---

## 二、macOS：`pyenv`

### 1) 安装（Homebrew）

```bash
brew update
brew install pyenv
```

把下面内容加入你的 shell 配置（`~/.zshrc` 或 `~/.bashrc`）：

```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - zsh)"
# 生效配置文件
source ~/.zshrc
```

验证：

```bash
pyenv --version
```

### 2) 常用命令

```bash
# 查看可安装版本
pyenv install --list

# 安装版本
pyenv install 3.14.3

# 查看已安装版本
pyenv versions

# 设置全局默认版本
pyenv global 3.14.3

# 设置当前项目版本
pyenv local 3.14.3

# 查看当前生效版本
python --version

# 设置 pyenv 重新加载
pyenv rehash

# 设置 python 命令为 python3
echo 'alias python=python3' >> ~/.zshrc
source ~/.zshrc
```

---

## 三、跨平台方案：`uv`（推荐）

`uv` 同时支持 Python 安装、虚拟环境、依赖安装，速度很快。

### 1) 安装

#### Windows（PowerShell）
```powershell
winget install astral-sh.uv
```

#### macOS
```bash
brew install uv
```

验证：

```bash
uv --version
```

### 2) Python 版本与虚拟环境

```bash
# 安装 Python（示例）
uv python install 3.11
uv python install 3.10

# 查看已安装 Python
uv python list

# 在当前目录创建虚拟环境（指定版本）
uv venv --python 3.11
```

激活虚拟环境：

- Windows（PowerShell）
```powershell
.venv\Scripts\activate
```

- macOS / Linux
```bash
source .venv/bin/activate
```

安装依赖：

```bash
# 创建并使用 Python 3.11 初始化虚拟环境（默认目录为 .venv）
uv venv --python 3.14
# 在当前虚拟环境中安装 requests、pandas、numpy 依赖
uv pip install requests pandas numpy
```

---

## 四、建议你怎么选

- 只在 Windows 学习：优先 `pyenv-win`
- 只在 macOS 学习：优先 `pyenv`
- 想跨平台统一体验：优先 `uv`

---

## 五、Python 命令

进入你的项目目录后执行：

```bash
python --version
python -m pip install requests pandas numpy
python demo1.py
```

---
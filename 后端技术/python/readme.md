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

安装后重开终端，验证：

```powershell
pyenv --version
```

### 2) 常用命令

```powershell
# 查看可安装版本
pyenv install --list

# 安装指定 Python 版本
pyenv install 3.14.3

# 查看已安装版本
pyenv versions

# 设置全局默认版本（类似 nvm use --default）
pyenv global 3.14.3

# 设置当前目录版本（会写入 .python-version）
pyenv local 3.14.3

# 查看当前生效版本
python --version
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
eval "$(pyenv init -)"
```

生效配置：

```bash
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
uv pip install requests pandas numpy
```

---

## 四、建议你怎么选

- 只在 Windows 学习：优先 `pyenv-win`
- 只在 macOS 学习：优先 `pyenv`
- 想跨平台统一体验：优先 `uv`

---

## 五、Demo1 快速运行

进入你的 demo 目录后执行：

```bash
python --version
python -m pip install requests pandas numpy
python demo1.py
```

若你使用 `uv`，也可以：

```bash
uv venv --python 3.11
# Windows: .venv\Scripts\activate
# macOS: source .venv/bin/activate
uv pip install requests pandas numpy
python demo1.py
```

---

## 六、Python 各版本语法是否一样？

不完全一样，但**大部分基础语法长期保持一致**（变量、函数、类、循环、列表/字典等都通用）。

主要差异通常在“新增语法糖/新特性”，例如：

- `3.10`：`match-case` 模式匹配、类型联合写法 `A | B`
- `3.11`：`except*`（配合异常组）等新语法
- `3.14`：语法层面与 `3.11+` 整体差异较小，更多是标准库与性能演进

---

## 七、按版本放置语法小点 Demo

已按版本目录组织语法示例，你可以分别运行：

```bash
# 3.10 语法示例
python 3.10/syntax_demo.py

# 3.11 语法示例
python 3.11/syntax_demo.py

# 3.14 语法示例
python 3.14/syntax_demo.py
```

说明：

- `3.10/syntax_demo.py`：`match-case`、`A | B` 类型联合、结构化模式匹配
- `3.11/syntax_demo.py`：`except*` 与异常组处理
- `3.14/syntax_demo.py`：演示当前版本常规写法（与 3.11+ 大体一致）

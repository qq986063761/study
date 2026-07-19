# AI Research Assistant

这个 demo 用来本地理解一个 AI 应用的后端流程：

前端页面 `static/index.html` -> FastAPI 后端服务 -> 后台任务 -> Planner -> ReAct Agent -> Tools -> 生成报告。

默认本地模式不需要 Docker、不需要 Redis、不需要 Celery。

## 1. 准备 Python 3

FastAPI 需要 Python 3.8+。

注意：你当前机器上的 `python` 是 Python 2.7，所以不要直接用 `python` 创建环境。请先安装 Python 3，或使用你本机已有的 Python 3 命令，例如：

```powershell
python3 --version
```

或者：

```powershell
py -3 --version
```

如果都不可用，请先安装 Python 3。

## 2. 启动 AI 后端服务

进入项目目录：

```powershell
cd .\apps\ai\ai-research-assistant
```

创建虚拟环境：

```powershell
python3 -m venv .venv
```

如果你的 Windows 使用 `py -3`：

```powershell
py -3 -m venv .venv
```

激活环境：

```powershell
.\.venv\Scripts\Activate.ps1
```

安装本地最小依赖：

```powershell
python -m pip install -r requirements-local.txt
```

启动 FastAPI 服务：

```powershell
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

看到类似下面内容就说明后端启动成功：

```text
Uvicorn running on http://127.0.0.1:8000
```

## 3. 打开前端页面测试

方式一：浏览器访问后端服务提供的页面：

```text
http://localhost:8000
```

方式二：直接双击打开本地文件：

```text
.\static\index.html
```

前端页面会自动请求：

```text
http://localhost:8000
```

所以无论用哪种方式打开页面，都要先启动第 2 步里的 FastAPI 后端服务。

## 4. 怎么测试

1. 打开页面后确认右上角显示 `service online (local)`。
2. 公司默认是 `Apple`。
3. 任务默认是 `分析苹果公司最近财报并给投资建议`。
4. 点击 `开始分析`。
5. 等待后台任务完成。
6. 页面会展示 Planner、任务状态、工具结果、模型提示。
7. 点击 `打开 Markdown 报告` 可以查看生成的报告。

报告会生成到：

```text
output/
```

## 5. 常用地址

前端页面：

```text
http://localhost:8000
```

API 文档：

```text
http://localhost:8000/docs
```

健康检查：

```text
http://localhost:8000/health
```

提交任务 API：

```text
POST http://localhost:8000/api/research
```

查询任务 API：

```text
GET http://localhost:8000/api/tasks/{task_id}
```

## 6. 本地架构说明

本地模式的核心文件：

```text
app.py                     FastAPI 后端入口
local_task_backend.py      本地线程池后台任务
tasks.py                   AI 分析任务主流程
planner/plan_and_execute.py 任务拆解 Planner
agent/react_agent.py       ReAct 执行器
tools/                     工具层
models/pytorch_model.py    模拟金融增强模型
static/index.html          前端测试页面
```

运行流程：

```text
index.html
  -> POST /api/research
  -> app.py
  -> local_task_backend.py
  -> tasks.py
  -> Planner
  -> ReAct Agent
  -> Tools
  -> output/report-xxxx.md
```

## 7. 可选：Docker / Celery 模式

本地学习不需要这一步。

如果以后想模拟生产异步任务架构，可以使用：

```powershell
docker compose up --build
```

这个模式会启动：

- FastAPI API 服务
- Redis
- Celery Worker

本地学习阶段，优先使用前面的 FastAPI 本地模式即可。


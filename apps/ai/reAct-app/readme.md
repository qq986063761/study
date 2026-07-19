# ReAct Demo

最小可运行的 [ReAct](https://arxiv.org/abs/2210.03629)（**Re**asoning + **Act**ing）示例：**Thought → Action → Observation** 多轮交错，直到调用 `finish`。

## 与 Plan-and-Execute 的区别

- ReAct 每步**边想边做**，下一步依赖上一步 Observation，轨迹更细、更交错。
- 本仓库另有 `plan-and-execute-demo/`：**先整体规划再逐步执行**，两阶段边界更清晰。

## 环境（可选）

```bash
cd react-demo
python3 -m venv .venv
source .venv/bin/activate
# 仅脚本 demo 无需 pip 安装
```

若要用真实 LLM（`--live`）：

```bash
pip install openai
export OPENAI_API_KEY=你的密钥
```

## 运行

**脚本轨迹（默认，无需 API）：**

```bash
python demo.py
```

**在线 LLM：**

```bash
python demo.py --live --question "(12+8)*3 等于多少？"
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `demo.py` | ReAct 循环、解析与可选 OpenAI 调用 |
| `tools.py` | `calculator`（安全算术）、`finish` |

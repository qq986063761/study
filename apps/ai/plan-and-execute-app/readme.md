# Plan-and-Execute Demo

**Plan-and-Execute** 将智能体拆成两阶段：

1. **Planner**：根据目标生成步骤计划（本 demo 默认用固定脚本；`--live` 时用 LLM 产出 JSON 计划）。
2. **Executor**：按步骤调用工具（如 `calculator`），并把中间结果写入上下文（如 `{a}`、`{b}` 占位符替换）。

## 与 ReAct 的区别

- Plan-and-Execute **先规划后执行**，适合步骤相对清晰、可分解的任务。
- 本仓库另有 `react-demo/`：**Thought / Action / Observation** 交错循环，更贴近论文中的 ReAct 形式。

## 环境（可选）

```bash
cd plan-and-execute-demo
python3 -m venv .venv
source .venv/bin/activate
```

若要用真实 LLM 做规划（`--live`）：

```bash
pip install openai
export OPENAI_API_KEY=你的密钥
```

## 运行

**脚本计划 + 执行（默认）：**

```bash
python demo.py
```

**由模型生成计划再执行：**

```bash
python demo.py --live --goal "计算 (12+8)*3，并给出最终数值。"
```

> `--live` 依赖模型按提示输出**可解析的 JSON 数组**；若解析失败，可重试或改用脚本模式对照行为。

## 文件说明

| 文件 | 说明 |
|------|------|
| `demo.py` | 规划/执行流程与可选 Planner LLM |
| `tools.py` | `calculator`（安全算术） |

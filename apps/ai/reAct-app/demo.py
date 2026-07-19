#!/usr/bin/env python3
"""
ReAct（Reasoning + Acting）交错循环：Thought → Action → Observation，直到 finish。

默认运行内置脚本轨迹（无需 API）；设置 OPENAI_API_KEY 且安装 openai 后可用 --live。
"""

from __future__ import annotations

import argparse
import os
import re
import textwrap
from tools import TOOL_IMPL

REACT_BLOCK = re.compile(
    r"Thought:\s*(?P<thought>.+?)\s*"
    r"Action:\s*(?P<action>\S+)\s*"
    r"Action Input:\s*(?P<input>.+?)(?:\s*$)",
    re.DOTALL | re.IGNORECASE,
)


def parse_react_turn(text: str) -> tuple[str, str, str] | None:
    text = text.strip()
    m = REACT_BLOCK.search(text)
    if not m:
        return None
    return (
        m.group("thought").strip(),
        m.group("action").strip().lower(),
        m.group("input").strip(),
    )


def run_tool(action: str, action_input: str) -> str:
    if action not in TOOL_IMPL:
        return f"未知工具: {action}。可用: {', '.join(TOOL_IMPL)}"
    try:
        out = TOOL_IMPL[action](action_input)
        return str(out)
    except Exception as e:  # noqa: BLE001
        return f"工具执行异常: {e}"


def scripted_react_demo() -> None:
    """固定问题「(12+8)*3 是多少？」的交错推理轨迹（模拟 LLM 输出）。"""
    question = "(12+8)*3 等于多少？"
    print(f"问题: {question}\n")

    turns = [
        textwrap.dedent(
            """
            Thought: 应先算括号内加法，再用乘法。
            Action: calculator
            Action Input: 12+8
            """
        ).strip(),
        textwrap.dedent(
            """
            Thought: 得到 20，再乘以 3。
            Action: calculator
            Action Input: 20*3
            """
        ).strip(),
        textwrap.dedent(
            """
            Thought: 结果已明确，可以回答用户。
            Action: finish
            Action Input: (12+8)*3 = 60
            """
        ).strip(),
    ]

    scratchpad = f"Question: {question}\n\n"
    for i, assistant_text in enumerate(turns, start=1):
        print(f"--- 第 {i} 轮（模拟模型输出）---")
        print(assistant_text)
        parsed = parse_react_turn(assistant_text)
        if not parsed:
            print("解析失败，跳过。\n")
            continue
        thought, action, action_input = parsed
        scratchpad += f"Thought: {thought}\nAction: {action}\nAction Input: {action_input}\n"
        obs = run_tool(action, action_input)
        print(f"Observation: {obs}\n")
        scratchpad += f"Observation: {obs}\n\n"
        if action == "finish":
            print("最终答复:", obs)
            break


def _live_loop(question: str, model: str) -> None:
    try:
        from openai import OpenAI
    except ImportError as e:
        raise SystemExit("请先: pip install openai") from e

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("请设置环境变量 OPENAI_API_KEY")

    client = OpenAI(api_key=api_key)
    system = textwrap.dedent(
        """
        你是 ReAct 智能体。每一步必须严格使用以下格式（不要输出其它 Markdown 标题）：

        Thought: <推理>
        Action: calculator 或 finish
        Action Input: <传给工具的字符串>

        工具说明：
        - calculator: 仅支持数字与 + - * / % ** 的算术表达式。
        - finish: 向用户给出的最终自然语言答案。

        在得到足够 Observation 之前不要调用 finish。
        """
    ).strip()

    messages: list[dict[str, str]] = [
        {"role": "system", "content": system},
        {"role": "user", "content": question},
    ]
    print(f"问题: {question}\n")

    for round_i in range(1, 9):
        resp = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.2,
        )
        text = (resp.choices[0].message.content or "").strip()
        print(f"--- 第 {round_i} 轮 ---\n{text}\n")
        messages.append({"role": "assistant", "content": text})

        parsed = parse_react_turn(text)
        if not parsed:
            messages.append(
                {
                    "role": "user",
                    "content": "请按 Thought / Action / Action Input 三段格式重新输出。",
                }
            )
            continue

        _thought, action, action_input = parsed
        obs = run_tool(action, action_input)
        print(f"Observation: {obs}\n")
        messages.append({"role": "user", "content": f"Observation: {obs}"})
        if action == "finish":
            print("结束。")
            return

    print("达到最大轮数，停止。")


def main() -> None:
    p = argparse.ArgumentParser(description="ReAct 交错推理 demo")
    p.add_argument(
        "--live",
        action="store_true",
        help="调用 OpenAI API（需 OPENAI_API_KEY 与 pip install openai）",
    )
    p.add_argument(
        "--question",
        default="(12+8)*3 等于多少？",
        help="--live 模式下用户问题",
    )
    p.add_argument("--model", default="gpt-4o-mini", help="--live 时模型名")
    args = p.parse_args()

    if args.live:
        _live_loop(args.question, args.model)
    else:
        scripted_react_demo()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Plan-and-Execute：先由 Planner 产出步骤列表，再由 Executor 逐步调用工具并更新上下文。

默认脚本演示；设置 OPENAI_API_KEY 且安装 openai 后可用 --live。
"""

from __future__ import annotations

import argparse
import json
import os
import re
import textwrap
from dataclasses import dataclass, field
from typing import Any

from tools import TOOL_IMPL


@dataclass
class ExecContext:
    """执行阶段可写入的变量池（demo 用简单键值）。"""

    vars: dict[str, str] = field(default_factory=dict)

    def substitute(self, template: str) -> str:
        out = template
        for k, v in self.vars.items():
            out = out.replace("{" + k + "}", v)
        return out


def run_calculator(expr: str) -> str:
    fn = TOOL_IMPL["calculator"]
    return str(fn(expr))


def scripted_plan_execute() -> None:
    goal = "计算 (12+8)*3，并给出最终数值。"
    print(f"目标: {goal}\n")

    # 阶段一：规划（此处为固定计划；真实系统中由 Planner LLM 生成）
    plan = [
        "步骤1：计算括号内 12+8，结果存入 a",
        "步骤2：计算 a*3，结果存入 b",
        "步骤3：用自然语言汇总答案",
    ]
    print("=== Planner 输出（脚本）===")
    for line in plan:
        print(line)
    print()

    ctx = ExecContext()

    # 阶段二：执行（每步映射到工具或纯逻辑）
    print("=== Executor ===")
    # 步骤 1
    e1 = "12+8"
    r1 = run_calculator(e1)
    ctx.vars["a"] = r1
    print(f"执行: calculator({e1!r}) -> {r1}")

    # 步骤 2
    e2 = f"{ctx.vars['a']}*3"
    r2 = run_calculator(e2)
    ctx.vars["b"] = r2
    print(f"执行: calculator({e2!r}) -> {r2}")

    # 步骤 3
    summary = f"(12+8)*3 = {ctx.vars['b']}"
    print(f"执行: 汇总 -> {summary}")
    print(f"\n最终答复: {summary}")


PLAN_JSON_RE = re.compile(r"\[[\s\S]*\]")


def _parse_plan_from_llm(text: str) -> list[dict[str, Any]]:
    m = PLAN_JSON_RE.search(text)
    if not m:
        raise ValueError("未找到 JSON 数组计划")
    raw = json.loads(m.group(0))
    if not isinstance(raw, list):
        raise ValueError("计划应为 JSON 数组")
    return raw


def _live_plan_execute(goal: str, model: str) -> None:
    try:
        from openai import OpenAI
    except ImportError as e:
        raise SystemExit("请先: pip install openai") from e

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("请设置环境变量 OPENAI_API_KEY")

    client = OpenAI(api_key=api_key)

    planner_sys = textwrap.dedent(
        """
        你是规划器。根据用户目标，输出仅包含一个 JSON 数组，不要其它文字。
        数组元素为对象，字段：
        - "id": 整数序号
        - "description": 简短描述
        - "tool": "calculator" 或 "noop"
        - "expression": 传给 calculator 的算术表达式（可引用占位符 {a} {b} 等，executor 会替换）

        示例目标「算 (12+8)*3」可规划为：
        [{"id":1,"description":"12+8","tool":"calculator","expression":"12+8","store_as":"a"},
         {"id":2,"description":"a*3","tool":"calculator","expression":"{a}*3","store_as":"b"},
         {"id":3,"description":"回答","tool":"noop","expression":"","store_as":""}]
        """
    ).strip()

    p_resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": planner_sys},
            {"role": "user", "content": goal},
        ],
        temperature=0.2,
    )
    plan_text = (p_resp.choices[0].message.content or "").strip()
    print("=== Planner 输出 ===\n", plan_text, "\n", sep="")

    steps = _parse_plan_from_llm(plan_text)
    ctx = ExecContext()

    print("=== Executor ===")
    for step in steps:
        sid = step.get("id")
        desc = step.get("description", "")
        tool = (step.get("tool") or "noop").lower()
        expr_tmpl = step.get("expression") or ""
        store_as = step.get("store_as") or ""

        expr = ctx.substitute(expr_tmpl) if expr_tmpl else ""
        print(f"步骤 {sid}: {desc} | tool={tool}")

        if tool == "calculator":
            if not expr.strip():
                print("  跳过：无表达式")
                continue
            out = run_calculator(expr)
            print(f"  calculator({expr!r}) -> {out}")
            if store_as:
                ctx.vars[store_as] = out
        elif tool == "noop":
            if store_as and expr:
                ctx.vars[store_as] = expr
            print("  noop")
        else:
            print(f"  未知工具 {tool}，跳过")

    final = ctx.vars.get("b") or ctx.vars.get("a") or ""
    print(f"\n上下文: {ctx.vars}")
    print(f"最终数值（若有）: {final}")


def main() -> None:
    p = argparse.ArgumentParser(description="Plan-and-Execute demo")
    p.add_argument("--live", action="store_true", help="Planner 调用 OpenAI API")
    p.add_argument(
        "--goal",
        default="计算 (12+8)*3，并给出最终数值。",
        help="--live 模式下的目标描述",
    )
    p.add_argument("--model", default="gpt-4o-mini", help="模型名")
    args = p.parse_args()

    if args.live:
        _live_plan_execute(args.goal, args.model)
    else:
        scripted_plan_execute()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
LangChain LCEL 最小示例：Prompt | ChatModel | StrOutputParser。

默认使用 FakeListChatModel（无需 API）；设置 OPENAI_API_KEY 后可用 --live 调用真实模型。
"""

from __future__ import annotations

import argparse
import os
import textwrap

from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate


def build_offline_chain():
    """离线链：固定回复，便于本地验证依赖与 LCEL 写法。"""
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "你是简洁的助手，用一两句话回答。"),
            ("user", "{question}"),
        ]
    )
    llm = FakeListChatModel(
        responses=[
            "两数之和为 42（本回复由 FakeListChatModel 预设，用于离线演示）。"
        ]
    )
    return prompt | llm | StrOutputParser()


def build_live_chain(model: str):
    """在线链：需 OPENAI_API_KEY。"""
    try:
        from langchain_openai import ChatOpenAI
    except ImportError as e:
        raise SystemExit("请先: pip install langchain-openai") from e

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("请设置环境变量 OPENAI_API_KEY")

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "你是简洁的助手，用一两句话回答。"),
            ("user", "{question}"),
        ]
    )
    llm = ChatOpenAI(model=model, temperature=0.2, api_key=api_key)
    return prompt | llm | StrOutputParser()


def main() -> None:
    p = argparse.ArgumentParser(description="LangChain LCEL demo")
    p.add_argument(
        "--live",
        action="store_true",
        help="调用 OpenAI（需 OPENAI_API_KEY 与 langchain-openai）",
    )
    p.add_argument(
        "--question",
        default="1+1 等于几？",
        help="用户问题",
    )
    p.add_argument("--model", default="gpt-4o-mini", help="--live 时模型名")
    args = p.parse_args()

    if args.live:
        chain = build_live_chain(args.model)
    else:
        chain = build_offline_chain()
        print(
            textwrap.dedent(
                """
                （离线模式：使用 FakeListChatModel，不调用网络。
                真实模型请: export OPENAI_API_KEY=... && python demo.py --live）
                """
            ).strip()
            + "\n"
        )

    out = chain.invoke({"question": args.question})
    print(f"问题: {args.question}\n\n答复:\n{out}")


if __name__ == "__main__":
    main()

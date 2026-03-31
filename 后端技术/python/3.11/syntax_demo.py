"""
Python 3.11 语法小点示例
运行:
    python syntax_demo.py
"""


def demo_except_star() -> None:
    # 3.11 新增: except*，用于处理异常组中的指定异常类型
    try:
        raise ExceptionGroup(
            "batch errors",
            [
                ValueError("bad value"),
                KeyError("missing key"),
                ValueError("another bad value"),
            ],
        )
    except* ValueError as eg:
        print("captured ValueError group:", [str(e) for e in eg.exceptions])
    except* KeyError as eg:
        print("captured KeyError group:", [str(e) for e in eg.exceptions])


def main() -> None:
    print("== Python 3.11 Syntax Demo ==")
    demo_except_star()


if __name__ == "__main__":
    main()

"""
Python 3.10 语法小点示例
运行:
    python syntax_demo.py
"""


def demo_match_case(status_code: int) -> str:
    # 3.10 新增: match-case
    match status_code:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:
            return "Unknown"


def demo_union_type(value: int | str) -> str:
    # 3.10 新增: A | B 类型联合写法
    if isinstance(value, int):
        return f"int: {value}"
    return f"str: {value}"


def demo_structural_pattern(payload: dict) -> str:
    # 3.10 新增: 结构化模式匹配
    match payload:
        case {"type": "user", "name": name}:
            return f"user={name}"
        case {"type": "order", "id": order_id}:
            return f"order={order_id}"
        case _:
            return "unknown payload"


def main() -> None:
    print("== Python 3.10 Syntax Demo ==")
    print("match-case:", demo_match_case(404))
    print("union type:", demo_union_type("hello"))
    print(
        "structural pattern:",
        demo_structural_pattern({"type": "user", "name": "Alice"}),
    )


if __name__ == "__main__":
    main()

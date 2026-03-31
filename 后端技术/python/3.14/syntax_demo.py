"""
Python 3.14 语法小点示例
说明:
    3.14 在语法层面与 3.11+ 基本延续，本文件演示可读性较好的常规写法。
运行:
    python syntax_demo.py
"""


def format_user(name: str, age: int, city: str | None = None) -> str:
    base = f"name={name}, age={age}"
    if city is not None:
        base += f", city={city}"
    return base


def main() -> None:
    print("== Python 3.14 Syntax Demo ==")
    users = [
        {"name": "Alice", "age": 20, "city": "Beijing"},
        {"name": "Bob", "age": 22, "city": None},
    ]
    for u in users:
        print(format_user(u["name"], u["age"], u["city"]))


if __name__ == "__main__":
    main()

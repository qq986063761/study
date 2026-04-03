"""
Python 3.14 基础语法示例（可直接运行）
运行方式:
    python syntax_demo.py
"""


def demo_variables_and_types() -> None:
    """演示变量、基本类型、f-string。"""
    print("\n[1] 变量与基本类型")
    name = "Alice"          # 字符串 str
    age = 20                # 整数 int
    height = 1.68           # 浮点数 float
    is_student = True       # 布尔 bool
    city = None             # 空值 NoneType
    print(f"name={name}, age={age}, height={height}, is_student={is_student}, city={city}")


def demo_string_ops() -> None:
    """演示字符串常见操作。"""
    print("\n[2] 字符串操作")
    text = "  python 3.14 syntax demo  "
    # strip 去除首尾空格，title 首字母大写
    cleaned = text.strip().title()
    # replace 替换，in 判断子串
    replaced = cleaned.replace("Demo", "Example")
    print("原始字符串:", repr(text))
    print("清理后:", cleaned)
    print("替换后:", replaced)
    print("是否包含 Python:", "Python" in replaced)


def demo_list_tuple_set_dict() -> None:
    """演示四大常用容器：list/tuple/set/dict。"""
    print("\n[3] 容器类型")
    nums = [3, 1, 2, 2]
    nums.append(4)
    nums.sort()
    print("list:", nums)

    point = (10, 20)  # tuple 不可变
    print("tuple:", point)

    tags = {"python", "demo", "python"}  # set 自动去重
    tags.add("basic")
    print("set:", tags)

    user = {"name": "Bob", "age": 22}
    user["city"] = "Beijing"
    print("dict:", user)


def demo_condition_and_loop() -> None:
    """演示 if/elif/else、for、while。"""
    print("\n[4] 条件与循环")
    score = 86
    if score >= 90:
        level = "A"
    elif score >= 80:
        level = "B"
    else:
        level = "C"
    print(f"score={score}, level={level}")

    print("for 循环遍历列表:")
    for idx, lang in enumerate(["Python", "JavaScript", "Go"], start=1):
        print(f"  {idx}. {lang}")

    print("while 循环累计求和:")
    total = 0
    n = 1
    while n <= 5:
        total += n
        n += 1
    print("1~5 的和 =", total)


def format_user(name: str, age: int, city: str | None = None) -> str:
    """带类型注解的函数示例。"""
    base = f"name={name}, age={age}"
    if city is not None:
        base += f", city={city}"
    return base


def demo_function_and_unpack() -> None:
    """演示函数调用、字典解包。"""
    print("\n[5] 函数与解包")
    users = [
        {"name": "Alice", "age": 20, "city": "Shanghai"},
        {"name": "Bob", "age": 22, "city": None},
    ]
    for u in users:
        # **u 将字典按键名解包为函数参数
        print(format_user(**u))


def demo_comprehension() -> None:
    """演示列表推导式和字典推导式。"""
    print("\n[6] 推导式")
    squares = [x * x for x in range(1, 6)]
    even_map = {x: x * x for x in range(1, 11) if x % 2 == 0}
    print("1~5 的平方:", squares)
    print("偶数平方字典:", even_map)


def demo_exception_handling() -> None:
    """演示 try/except/finally 异常处理。"""
    print("\n[7] 异常处理")
    samples = ["42", "hello"]
    for item in samples:
        try:
            num = int(item)
            print(f"{item} -> {num}")
        except ValueError as err:
            print(f"{item} 转 int 失败: {err}")
        finally:
            print("本轮转换结束")


def demo_file_io() -> None:
    """演示文件读写（使用 with 自动关闭文件）。"""
    print("\n[8] 文件读写")
    file_path = "syntax_demo_output.txt"
    lines = ["Python 文件写入示例\n", "第 2 行：hello 3.14\n"]
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"已写入并读取 {file_path}，内容如下:")
    print(content.strip())


def main() -> None:
    """按顺序执行所有示例，保证控制台有输出。"""
    print("== Python 3.14 基础语法 Demo ==")
    demo_variables_and_types()
    demo_string_ops()
    demo_list_tuple_set_dict()
    demo_condition_and_loop()
    demo_function_and_unpack()
    demo_comprehension()
    demo_exception_handling()
    demo_file_io()
    print("\n== 所有示例执行完成 ==")


if __name__ == "__main__":
    main()

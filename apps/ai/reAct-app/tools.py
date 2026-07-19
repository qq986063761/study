"""ReAct demo 可调用的简单工具（计算器 + 结束）。"""

from __future__ import annotations

import ast


_ALLOWED_BINOPS = (ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Mod, ast.Pow)
_ALLOWED_UNARY = (ast.UAdd, ast.USub)


def _eval_node(node: ast.AST) -> float:
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return float(node.value)
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, _ALLOWED_UNARY):
        v = _eval_node(node.operand)
        if isinstance(node.op, ast.UAdd):
            return +v
        return -v
    if isinstance(node, ast.BinOp) and isinstance(node.op, _ALLOWED_BINOPS):
        left = _eval_node(node.left)
        right = _eval_node(node.right)
        if isinstance(node.op, ast.Add):
            return left + right
        if isinstance(node.op, ast.Sub):
            return left - right
        if isinstance(node.op, ast.Mult):
            return left * right
        if isinstance(node.op, ast.Div):
            return left / right
        if isinstance(node.op, ast.Mod):
            return left % right
        if isinstance(node.op, ast.Pow):
            return left**right
    raise ValueError("不支持的表达式")


def calculator(expression: str) -> str:
    """仅允许数字与 + - * / % ** 的算术表达式。"""
    expr = expression.strip().replace(" ", "")
    if not expr:
        return "错误：表达式为空"
    try:
        tree = ast.parse(expr, mode="eval")
        result = _eval_node(tree.body)
        if result == int(result):
            return str(int(result))
        return str(result)
    except Exception as e:  # noqa: BLE001 — demo 边界说明
        return f"计算错误: {e}"


def finish(answer: str) -> str:
    """标记任务完成；answer 为给用户的最终答复。"""
    return answer.strip()


TOOL_IMPL = {
    "calculator": calculator,
    "finish": finish,
}

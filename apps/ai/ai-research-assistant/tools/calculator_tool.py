import ast
import operator


OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.USub: operator.neg,
}


def calculate(expression):
    node = ast.parse(expression, mode="eval")
    result = _eval(node.body)
    if isinstance(result, float):
        return "{0:.2f}".format(result)
    return str(result)


def _eval(node):
    if isinstance(node, ast.Num):
        return node.n
    if hasattr(ast, "Constant") and isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in OPS:
        return OPS[type(node.op)](_eval(node.left), _eval(node.right))
    if isinstance(node, ast.UnaryOp) and type(node.op) in OPS:
        return OPS[type(node.op)](_eval(node.operand))
    raise ValueError("Only simple arithmetic is supported.")

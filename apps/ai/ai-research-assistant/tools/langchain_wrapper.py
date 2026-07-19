from tools.calculator_tool import calculate
from tools.db_tool import query_financials
from tools.file_tool import read_file
from tools.search_tool import search


class Tool:
    def __init__(self, name, description, run):
        self.name = name
        self.description = description
        self.run = run


class LangChainLikeToolKit:
    """A tiny tool registry shaped like LangChain tools, without dependencies."""

    def __init__(self, tools):
        self._tools = {tool.name: tool for tool in tools}

    def run(self, tool_name, tool_input):
        tool = self._tools.get(tool_name)
        if tool is None:
            available = ", ".join(sorted(self._tools))
            return "Unknown tool: {0}. Available tools: {1}".format(tool_name, available)
        return tool.run(tool_input)

    def describe(self):
        return "\n".join(
            "- {0}: {1}".format(tool.name, tool.description)
            for tool in self._tools.values()
        )


def build_default_toolkit():
    return LangChainLikeToolKit(
        tools=[
            Tool("search", "Search offline sample news.", search),
            Tool("database", "Query offline financial records.", query_financials),
            Tool("file_reader", "Read a project-local text file.", read_file),
            Tool("calculator", "Evaluate simple arithmetic.", calculate),
        ]
    )

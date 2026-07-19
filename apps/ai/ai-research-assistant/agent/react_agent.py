# -*- coding: utf-8 -*-
from __future__ import print_function


class ReActAgent:
    """Rule-based ReAct loop for learning the architecture without an API key."""

    def __init__(self, toolkit, model):
        self.toolkit = toolkit
        self.model = model

    def run(self, task, company, plan):
        memory = {}

        self._trace(
            thought="需要先了解公司最近发生了什么。",
            action="search",
            action_input="{0} latest earnings news".format(company),
        )
        memory["news"] = self.toolkit.run(
            "search", "{0} latest earnings news".format(company)
        )
        print("Observation: {0}\n".format(memory["news"]))

        self._trace(
            thought="有了新闻，还需要结构化财务数据。",
            action="database",
            action_input=company,
        )
        memory["financials"] = self.toolkit.run("database", company)
        print("Observation: {0}\n".format(memory["financials"]))

        self._trace(
            thought="财务数据里有增长率，可以用计算工具复核。",
            action="calculator",
            action_input="383.3 - 394.3",
        )
        revenue_delta = self.toolkit.run("calculator", "383.3 - 394.3")
        memory["growth"] = (
            "Revenue changed by {0} billion USD year over year. ".format(revenue_delta) +
            "The offline demo data shows softer revenue but resilient profitability."
        )
        print("Observation: {0}\n".format(memory["growth"]))

        self._trace(
            thought="投资报告需要风险点，可以读取本地研究模板。",
            action="file_reader",
            action_input="prompts/react_prompt.txt",
        )
        risk_template = self.toolkit.run("file_reader", "prompts/react_prompt.txt")
        memory["risks"] = (
            "Main risks: demand slowdown, valuation pressure, supply chain changes, "
            "and regulatory scrutiny."
        )
        print("Observation: read {0} chars of local guidance\n".format(len(risk_template)))

        self._trace(
            thought="最后用可选增强模型给出金融分析风格提示。",
            action="domain_model",
            action_input="financials",
        )
        memory["model_hint"] = self.model.analyze(memory["financials"])
        print("Observation: {0}\n".format(memory["model_hint"]))

        memory["summary"] = self._summarize(task, company, plan, memory)
        return memory

    @staticmethod
    def _trace(thought, action, action_input):
        print("Thought: {0}".format(thought))
        print("Action: {0}".format(action))
        print("Action Input: {0}".format(action_input))

    @staticmethod
    def _summarize(task, company, plan, memory):
        return (
            "For the task '{0}', the assistant followed {1} planned steps. "
            "{2} looks like a quality company in this offline demo, but the "
            "recommendation is cautious: continue researching before buying, because "
            "growth pressure and valuation risk still matter."
        ).format(task, len(plan), company)

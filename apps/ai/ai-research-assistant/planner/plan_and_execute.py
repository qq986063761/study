# -*- coding: utf-8 -*-


class Planner:
    """Plan-and-Execute layer: turn one broad task into executable steps."""

    def create_plan(self, task, company):
        normalized = task.lower()
        if any(word in normalized for word in ["投资", "财报", "finance", "earnings"]):
            return [
                "Step 1: 获取 {0} 最新新闻".format(company),
                "Step 2: 查询 {0} 财务数据".format(company),
                "Step 3: 分析收入、利润和增长趋势",
                "Step 4: 总结风险点",
                "Step 5: 写投资报告",
            ]

        return [
            "Step 1: 收集 {0} 相关公开信息".format(company),
            "Step 2: 提取关键事实",
            "Step 3: 总结结论",
        ]

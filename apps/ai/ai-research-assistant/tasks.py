from pathlib import Path
from uuid import uuid4

from agent.react_agent import ReActAgent
from models.pytorch_model import FinancialToneModel
from planner.plan_and_execute import Planner
from tools.langchain_wrapper import build_default_toolkit


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"


def render_report(task, company, plan_lines, agent_result):
    plan_text = "\n".join(f"- {line}" for line in plan_lines)
    return f"""# AI Research Report

## User Task

{task}

## Company

{company}

## Planner Output

{plan_text}

## Key Findings

- Latest news: {agent_result["news"]}
- Financial data: {agent_result["financials"]}
- Growth analysis: {agent_result["growth"]}
- Risks: {agent_result["risks"]}
- Model hint: {agent_result["model_hint"]}

## Investment View

{agent_result["summary"]}

## Architecture Trace

1. FastAPI received the request.
2. Background task backend accepted the job.
3. Planner created a workflow.
4. ReAct Agent selected tools step by step.
5. Tool Layer returned observations.
6. Model Layer added domain-specific analysis hints.
7. Background task generated this report.
"""


def run_research_flow(task, company):
    planner = Planner()
    plan = planner.create_plan(task, company=company)

    toolkit = build_default_toolkit()
    model = FinancialToneModel()
    agent = ReActAgent(toolkit=toolkit, model=model)
    result = agent.run(task=task, company=company, plan=plan)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"report-{uuid4().hex[:8]}.md"
    report_path = OUTPUT_DIR / filename
    report_path.write_text(
        render_report(task, company, plan, result),
        encoding="utf-8",
    )

    return {
        "task": task,
        "company": company,
        "plan": plan,
        "findings": result,
        "report_file": filename,
        "report_url": f"/api/reports/{filename}",
    }


def run_research_task(task, company):
    return run_research_flow(task, company)


try:
    from celery_app import celery_app
except ImportError:
    celery_app = None

if celery_app is not None:
    run_research_task = celery_app.task(name="research.run")(run_research_task)

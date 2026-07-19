import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from local_task_backend import local_task_backend


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
OUTPUT_DIR = BASE_DIR / "output"
TASK_BACKEND = os.getenv("TASK_BACKEND", "local").lower()

app = FastAPI(
    title="AI Research Assistant",
    description="FastAPI demo for Planner, ReAct Agent, Tools, and Model Layer.",
    version="0.2.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


class ResearchRequest(BaseModel):
    task: str = Field(default="分析苹果公司最近财报并给投资建议")
    company: str = Field(default="Apple")


class ResearchSubmitResponse(BaseModel):
    task_id: str
    status_url: str


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
def health():
    return {"status": "ok", "service": "api", "task_backend": TASK_BACKEND}


@app.post("/api/research", response_model=ResearchSubmitResponse)
def submit_research(payload: ResearchRequest):
    if TASK_BACKEND == "local":
        task_id = local_task_backend.submit(payload.task, payload.company)
        return {
            "task_id": task_id,
            "status_url": f"/api/tasks/{task_id}",
        }

    from tasks import run_research_task

    job = run_research_task.delay(payload.task, payload.company)
    return {
        "task_id": job.id,
        "status_url": f"/api/tasks/{job.id}",
    }


@app.get("/api/tasks/{task_id}")
def get_task_status(task_id: str):
    if TASK_BACKEND == "local":
        return local_task_backend.status(task_id)

    from celery.result import AsyncResult
    from celery_app import celery_app

    result = AsyncResult(task_id, app=celery_app)

    if result.state == "PENDING":
        return {"task_id": task_id, "state": result.state, "ready": False}

    if result.state == "FAILURE":
        return {
            "task_id": task_id,
            "state": result.state,
            "ready": True,
            "error": str(result.result),
        }

    if result.state == "SUCCESS":
        return {
            "task_id": task_id,
            "state": result.state,
            "ready": True,
            "result": result.result,
        }

    return {
        "task_id": task_id,
        "state": result.state,
        "ready": False,
        "meta": result.info if isinstance(result.info, dict) else {},
    }


@app.get("/api/reports/{filename}")
def get_report(filename: str):
    if "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    report_path = OUTPUT_DIR / filename
    if not report_path.exists():
        raise HTTPException(status_code=404, detail="Report not found")

    return FileResponse(report_path, media_type="text/markdown", filename=filename)

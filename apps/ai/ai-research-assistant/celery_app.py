import os

from celery import Celery


REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "ai_research_assistant",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["tasks"],
)

celery_app.conf.update(
    task_track_started=True,
    result_expires=60 * 60,
    timezone="Asia/Shanghai",
)

from concurrent.futures import ThreadPoolExecutor
from threading import Lock
from uuid import uuid4

from tasks import run_research_flow


class LocalTaskBackend:
    """Small in-process task backend for local development without Redis/Celery."""

    def __init__(self, max_workers=2):
        self._executor = ThreadPoolExecutor(max_workers=max_workers)
        self._tasks = {}
        self._lock = Lock()

    def submit(self, task, company):
        task_id = uuid4().hex
        with self._lock:
            self._tasks[task_id] = {
                "task_id": task_id,
                "state": "PENDING",
                "ready": False,
            }

        self._executor.submit(self._run, task_id, task, company)
        return task_id

    def status(self, task_id):
        with self._lock:
            data = self._tasks.get(task_id)
            if data is None:
                return {
                    "task_id": task_id,
                    "state": "PENDING",
                    "ready": False,
                }
            return dict(data)

    def _run(self, task_id, task, company):
        with self._lock:
            self._tasks[task_id] = {
                "task_id": task_id,
                "state": "STARTED",
                "ready": False,
            }

        try:
            result = run_research_flow(task, company)
        except Exception as exc:  # noqa: BLE001
            with self._lock:
                self._tasks[task_id] = {
                    "task_id": task_id,
                    "state": "FAILURE",
                    "ready": True,
                    "error": str(exc),
                }
            return

        with self._lock:
            self._tasks[task_id] = {
                "task_id": task_id,
                "state": "SUCCESS",
                "ready": True,
                "result": result,
            }


local_task_backend = LocalTaskBackend()


from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from dataclasses import dataclass


JobCallable = Callable[[], Awaitable[None]]


@dataclass
class QueueJob:
    job_id: str
    invoice_id: str
    status: str


class InMemoryJobQueue:
    def __init__(self) -> None:
        self.jobs: dict[str, QueueJob] = {}

    async def enqueue(self, job: QueueJob, task_factory: JobCallable) -> QueueJob:
        self.jobs[job.job_id] = job
        asyncio.create_task(task_factory())
        return job

    def get(self, job_id: str) -> QueueJob | None:
        return self.jobs.get(job_id)


job_queue = InMemoryJobQueue()

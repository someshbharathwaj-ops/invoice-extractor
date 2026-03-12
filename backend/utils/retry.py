from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from typing import TypeVar


T = TypeVar("T")


async def retry_async(operation: Callable[[], Awaitable[T]], attempts: int = 3, delay_seconds: float = 0.35) -> T:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            return await operation()
        except Exception as error:  # noqa: BLE001
            last_error = error
            if attempt == attempts - 1:
                raise
            await asyncio.sleep(delay_seconds * (attempt + 1))
    raise RuntimeError("retry_async failed") from last_error

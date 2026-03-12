from __future__ import annotations

import asyncio
from collections import defaultdict
from typing import AsyncIterator


class EventStreamBroker:
    def __init__(self) -> None:
        self._channels: dict[str, list[asyncio.Queue[dict[str, object]]]] = defaultdict(list)

    async def publish(self, channel: str, payload: dict[str, object]) -> None:
        subscribers = self._channels.get(channel, [])
        for queue in subscribers:
            await queue.put(payload)

    async def subscribe(self, channel: str) -> AsyncIterator[dict[str, object]]:
        queue: asyncio.Queue[dict[str, object]] = asyncio.Queue()
        self._channels[channel].append(queue)
        try:
            while True:
                yield await queue.get()
        finally:
            self._channels[channel].remove(queue)


event_stream_broker = EventStreamBroker()

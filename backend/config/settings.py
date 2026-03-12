from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "invoice-extractor-backend"
    api_prefix: str = "/api/v1"
    debug: bool = False
    environment: str = "development"

    storage_root: Path = Field(default=Path("backend/data"))
    uploads_dir: Path = Field(default=Path("backend/data/uploads"))
    results_dir: Path = Field(default=Path("backend/data/results"))

    max_upload_size_mb: int = 20
    default_page_size: int = 20
    max_page_size: int = 100

    rate_limit_requests: int = 120
    rate_limit_window_seconds: int = 60

    queue_backend: str = "memory"
    redis_url: str = "redis://localhost:6379/0"
    job_poll_interval_ms: int = 250

    embedding_batch_size: int = 8
    chunk_size: int = 600
    chunk_overlap: int = 120
    max_context_chunks: int = 4
    max_prompt_characters: int = 5000
    extraction_model_name: str = "google/flan-t5-base"

    enable_telemetry: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_prefix="INVOICE_", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.storage_root.mkdir(parents=True, exist_ok=True)
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    settings.results_dir.mkdir(parents=True, exist_ok=True)
    return settings

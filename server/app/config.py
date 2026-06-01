from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    anthropic_model: str = "claude-haiku-4-5"
    daily_input_token_budget: int = 2_000_000

    flight_deck_base_url: str = "https://flight-deck.crox.io"
    form_csrf_secret: str = ""
    project_host: str = "crox.io"

    fibery_host: str = "wildgriffin.fibery.io"
    fibery_token: str = ""

    posthog_host: str = "https://us.posthog.com"
    posthog_project_api_key: str = ""

    cors_allowed_origins: str = "http://localhost:3099,https://crox.io,https://www.crox.io"
    base_url: str = "http://localhost:8001"

    # Postgres DSN, e.g. postgresql://user:pass@host:5432/dbname
    # Empty string disables the DB layer (chat still works; conversations
    # just aren't persisted). In prod this MUST be set.
    database_url: str = ""

    booking_url: str = "https://calendar.app.google/dmmq9bdFyc11G8Km8"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

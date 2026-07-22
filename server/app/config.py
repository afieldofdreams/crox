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

    posthog_host: str = "https://us.posthog.com"
    posthog_project_api_key: str = ""

    cors_allowed_origins: str = "http://localhost:3099,https://crox.io,https://www.crox.io"
    base_url: str = "http://localhost:8001"

    # Postgres DSN, e.g. postgresql://user:pass@host:5432/dbname
    # Empty string disables the DB layer (chat still works; conversations
    # just aren't persisted). In prod this MUST be set.
    database_url: str = ""

    booking_url: str = "https://calendar.app.google/dmmq9bdFyc11G8Km8"

    # Bearer token for /admin/* endpoints. If empty, admin routes
    # refuse with 503 (rather than silently allowing access).
    admin_token: str = ""

    # Resend — used by /admin/contacts/{email}/send-email for replies
    # Adam sends through the Flight Deck admin UI. Empty disables
    # outbound mail (the endpoint returns 503).
    resend_api_key: str = ""
    # Default sender for admin replies. Override per environment to a
    # verified Resend domain (e.g. "Adam Field <adam@crox.io>"). The
    # default placeholder works for testing but lands in spam.
    assessment_from_email: str = "Crox <onboarding@resend.dev>"

    # --- Cold outbound (the lead machine) -------------------------------
    # Sender for cold outreach. Adam's call (2026-07-22): send from the
    # main address for now, accepting that cold volume shares crox.io's
    # reputation. Move to a dedicated subdomain (e.g. adam@hello.crox.io,
    # verified separately in Resend) if deliverability ever wobbles.
    # Set to empty in the environment to disable /outbound/send (503).
    outbound_from_email: str = "Adam Field <adam@crox.io>"
    # Replies should land in a real inbox Adam reads.
    outbound_reply_to: str = "adam@crox.io"
    # Hard ceiling on cold sends per UTC day, across all callers.
    outbound_daily_cap: int = 25
    # HMAC key for unsubscribe links. Falls back to form_csrf_secret if
    # empty; if both are empty, cold outbound is disabled.
    outbound_unsubscribe_secret: str = ""

    @property
    def unsubscribe_secret(self) -> str:
        return self.outbound_unsubscribe_secret or self.form_csrf_secret

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

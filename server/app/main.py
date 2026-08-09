import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin import router as admin_router
from app.api.assessment import router as assessment_router
from app.api.capture import router as capture_router
from app.api.chat import router as chat_router
from app.api.contact_form import router as contact_form_router
from app.api.linkedin import router as linkedin_router
from app.api.links import router as links_router
from app.api.outbound import router as outbound_router
from app.config import settings
from app.services import db, email, linkedin

# Dead-man's switch for the content loop. In August 2026 posting went
# silent for nine days: nothing errored, the queue had simply run dry
# because the routine that fills it stopped running. Silence is the one
# failure this system can't detect on its own, so the server watches for
# it and emails instead of waiting to be asked.
_QUEUE_ALARM_INTERVAL = 6 * 3600
_QUEUE_ALARM_COOLDOWN = 48 * 3600
# None = never alarmed. Must not be 0.0: loop.time() is monotonic from an
# arbitrary origin (roughly host uptime), so comparing against 0.0 would
# suppress the first alarm until the host had been up 48 hours — silently
# disabling the alarm for two days after every deploy.
_last_queue_alarm: float | None = None


async def _queue_watchdog() -> None:
    """Email if the LinkedIn queue has run dry, at most once every 48h."""
    global _last_queue_alarm
    while True:
        await asyncio.sleep(_QUEUE_ALARM_INTERVAL)
        try:
            pending = await linkedin.pending_upcoming()
            # None means the queue couldn't be read — that's a different
            # problem, and guessing "empty" would cry wolf.
            if pending is not None and pending == 0:
                now = asyncio.get_running_loop().time()
                if (
                    _last_queue_alarm is None
                    or now - _last_queue_alarm >= _QUEUE_ALARM_COOLDOWN
                ):
                    _last_queue_alarm = now
                    status = await linkedin.status_summary()
                    await email.send(
                        to=settings.outbound_reply_to,
                        subject="LinkedIn queue is empty — no posts scheduled",
                        text=(
                            "Nothing is queued to post.\n\n"
                            "This is what the nine-day outage in August looked "
                            "like: no errors, healthy token, empty queue. It "
                            "means the Sunday routine that writes the week's "
                            "posts hasn't run.\n\n"
                            f"{status}\n\n"
                            "Fix: run the weekly routine (content/WEEKLY-ROUTINE.md "
                            "in the crox repo), or check the recurring session "
                            "that's meant to run it still exists."
                        ),
                    )
                    print("[linkedin] queue empty — alarm email sent")
        except Exception as exc:
            print(f"[linkedin] watchdog error: {type(exc).__name__}: {str(exc)[:200]}")


async def _linkedin_poster() -> None:
    """Publish due queued LinkedIn posts every 10 minutes."""
    while True:
        try:
            await linkedin.flush_due()
        except Exception as exc:
            print(f"[linkedin] poster loop error: {type(exc).__name__}: {str(exc)[:200]}")
        await asyncio.sleep(600)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.init_db()
    poster = asyncio.create_task(_linkedin_poster())
    watchdog = asyncio.create_task(_queue_watchdog())
    try:
        yield
    finally:
        poster.cancel()
        watchdog.cancel()
        await db.close_db()


app = FastAPI(
    title="Crox chat",
    description="Floating chat widget backend for crox.io",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    from app import budget
    return {"status": "ok", "budget": budget.snapshot()}


app.include_router(chat_router)
app.include_router(capture_router)
app.include_router(contact_form_router)
app.include_router(assessment_router)
app.include_router(admin_router)
app.include_router(outbound_router)
app.include_router(linkedin_router)
app.include_router(links_router)

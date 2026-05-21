from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.capture import router as capture_router
from app.api.chat import router as chat_router
from app.api.contact_form import router as contact_form_router
from app.config import settings

app = FastAPI(
    title="Crox chat",
    description="Floating chat widget backend for crox.io",
    version="0.1.0",
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

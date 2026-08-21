"""Public media store — exists because Instagram will not take bytes.

Instagram's Content Publishing API fetches images from a public URL and
accepts JPEG only. Cards are generated as PNGs by scripts/social-card.mjs
in a Claude session with no image tooling installed, so the conversion
happens here instead: whatever raster comes in, a JPEG goes into
Postgres and out at a public URL.

Routes:
  POST /media          — upload base64 image, stored as JPEG (admin)
  GET  /media          — list stored files (admin)
  GET  /media/{name}   — serve the image (public — that is the point)
  DELETE /media/{name} — remove a file no queue item references (admin)

Storing bytes in Postgres is deliberate: the Coolify container's disk is
ephemeral across deploys, and a queue item due Thursday must not lose
its image to a Tuesday redeploy. A card-sized JPEG is ~100–400KB;
volume is a handful a week.
"""
from __future__ import annotations

import base64
import hashlib
import io
import re

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from app.api.admin import _require_admin
from app.config import settings
from app.services import db

router = APIRouter()

# Instagram rejects images over 8MB; anything near that is a mistake for
# a social card anyway. Applies to the *decoded* upload.
_MAX_UPLOAD = 8 * 1024 * 1024

# JPEG at quality 90 is visually clean for flat-colour typographic cards
# and keeps files well under Instagram's cap.
_JPEG_QUALITY = 90

_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9._-]{0,120}$")


class MediaUpload(BaseModel):
    # Optional; derived from a content hash when omitted. Lowercase
    # letters, digits, dot, dash, underscore — it becomes a URL path.
    name: str | None = Field(default=None, max_length=120)
    content_base64: str
    # Same-name re-upload is refused unless explicitly asked for, so a
    # queued post's image can't be swapped out by accident.
    overwrite: bool = False


def _to_jpeg(raw: bytes) -> bytes:
    """Convert any raster Pillow can read into an RGB JPEG. Alpha is
    flattened onto near-black to match the Fred card background rather
    than JPEG's default white."""
    from PIL import Image  # imported here so the app boots even if Pillow is missing

    img = Image.open(io.BytesIO(raw))
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        background = Image.new("RGB", img.size, (11, 13, 18))
        background.paste(img, mask=img.split()[-1])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")
    out = io.BytesIO()
    img.save(out, format="JPEG", quality=_JPEG_QUALITY, optimize=True)
    return out.getvalue()


@router.post("/media")
async def upload_media(req: MediaUpload, _: None = Depends(_require_admin)) -> dict:
    try:
        raw = base64.b64decode(req.content_base64, validate=True)
    except Exception:
        raise HTTPException(status_code=422, detail="invalid_base64")
    if not raw:
        raise HTTPException(status_code=422, detail="empty_upload")
    if len(raw) > _MAX_UPLOAD:
        raise HTTPException(status_code=413, detail=f"too_large_{len(raw)}")

    try:
        jpeg = _to_jpeg(raw)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"not_an_image: {type(exc).__name__}")

    if req.name:
        name = req.name.lower().removesuffix(".png").removesuffix(".jpeg").removesuffix(".jpg")
        if not _NAME_RE.match(name):
            raise HTTPException(status_code=422, detail="bad_name")
        name = f"{name}.jpg"
    else:
        name = f"{hashlib.sha256(jpeg).hexdigest()[:16]}.jpg"

    saved = await db.save_media(name, jpeg, overwrite=req.overwrite)
    if saved is None:
        raise HTTPException(status_code=503, detail="db_unavailable")
    if not saved:
        raise HTTPException(status_code=409, detail="name_exists (pass overwrite=true to replace)")
    return {
        "name": name,
        "url": f"{settings.base_url}/media/{name}",
        "bytes": len(jpeg),
    }


@router.get("/media")
async def list_media(_: None = Depends(_require_admin)) -> dict:
    rows = await db.list_media()
    if rows is None:
        raise HTTPException(status_code=503, detail="db_unavailable")
    return {
        "files": [
            {
                "name": r["name"],
                "url": f"{settings.base_url}/media/{r['name']}",
                "bytes": r["size"],
                "created_at": r["created_at"].isoformat(),
            }
            for r in rows
        ]
    }


@router.get("/media/{name}")
async def serve_media(name: str) -> Response:
    """Public by design — Instagram's servers fetch from here. Content
    is only what an admin uploaded, and the names are unguessable when
    hash-derived."""
    row = await db.get_media(name)
    if row is None:
        raise HTTPException(status_code=404, detail="not_found")
    return Response(
        content=row["content"],
        media_type="image/jpeg",
        headers={"Cache-Control": "public, max-age=86400"},
    )


@router.delete("/media/{name}")
async def delete_media(name: str, _: None = Depends(_require_admin)) -> dict:
    deleted = await db.delete_media(name)
    if not deleted:
        raise HTTPException(status_code=404, detail="not_found")
    return {"deleted": name}

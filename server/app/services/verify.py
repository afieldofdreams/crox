"""Pre-send email validation and published-address harvesting.

Two guards for the cold-outbound lead machine:

- check_deliverable(): DNS-level sanity check (does the domain exist
  and accept mail) so obviously dead addresses are refused before they
  burn sender reputation as hard bounces.
- harvest(): fetches a company's own public pages (contact/team/about)
  and extracts any email addresses they publish there. This keeps the
  OUTBOUND.md sourcing rule honest — we only ever use addresses a firm
  has published itself, never pattern-guessed ones — while making the
  named-person address much easier to find than search snippets allow.
"""
from __future__ import annotations

import re

import dns.asyncresolver
import dns.exception
import httpx

_HARVEST_PATHS = [
    "",
    "contact",
    "contact-us",
    "about",
    "about-us",
    "team",
    "our-team",
    "meet-the-team",
    "people",
    "our-people",
]

_EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

# Substrings that mark scraped "addresses" as junk (asset filenames,
# tracking vendors, do-not-reply inboxes) rather than real contacts.
_JUNK_MARKERS = (
    "example.",
    "sentry",
    "wixpress",
    "@2x",
    "noreply",
    "no-reply",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
)


def _normalise_domain(domain: str) -> str:
    d = domain.strip().lower()
    d = re.sub(r"^https?://", "", d)
    d = d.split("/")[0]
    return d.removeprefix("www.")


async def check_deliverable(email: str) -> bool:
    """DNS check that the address's domain can receive mail.

    True if the domain has MX records (or, per RFC 5321 fallback, an
    A/AAAA record). False only on a definitive answer that it does not
    exist — DNS timeouts and server failures return True so a resolver
    hiccup never blocks the daily send.
    """
    domain = email.rsplit("@", 1)[-1].strip().lower()
    if not domain:
        return False
    resolver = dns.asyncresolver.Resolver()
    resolver.lifetime = 5.0
    try:
        await resolver.resolve(domain, "MX")
        return True
    except (dns.resolver.NoAnswer, dns.resolver.NoNameservers):
        pass
    except dns.resolver.NXDOMAIN:
        return False
    except (dns.exception.Timeout, Exception) as exc:
        print(f"[verify] MX lookup soft-failed for {domain}: {type(exc).__name__}")
        return True
    try:
        await resolver.resolve(domain, "A")
        return True
    except dns.resolver.NXDOMAIN:
        return False
    except Exception:
        return True


async def harvest(domain: str) -> dict:
    """Collect email addresses a company publishes on its own site.

    Fetches the homepage plus common contact/team paths and extracts
    mailto: links and inline addresses. Returns each unique address with
    the page it was found on, so the dossier can cite the source. Never
    constructs or guesses addresses — if it isn't on their site, it
    isn't returned.
    """
    host = _normalise_domain(domain)
    found: dict[str, str] = {}
    pages_checked = 0
    headers = {"User-Agent": "CroxBot/1.0 (+https://crox.io)"}
    async with httpx.AsyncClient(
        timeout=10.0, follow_redirects=True, headers=headers
    ) as client:
        for path in _HARVEST_PATHS:
            url = f"https://{host}/{path}" if path else f"https://{host}/"
            try:
                resp = await client.get(url)
            except Exception:
                continue
            if resp.status_code >= 400:
                continue
            pages_checked += 1
            text = resp.text[:500_000]
            for match in _EMAIL_RE.findall(text):
                email = match.lower().strip(".")
                if any(marker in email for marker in _JUNK_MARKERS):
                    continue
                found.setdefault(email, str(resp.url))
    # Same-domain addresses first — those are the firm's own inboxes;
    # third-party ones (agencies, hosts) sort after them.
    ordered = sorted(
        found.items(), key=lambda kv: (0 if kv[0].endswith(host) else 1, kv[0])
    )
    return {
        "domain": host,
        "pages_checked": pages_checked,
        "emails": [{"email": e, "source_url": u} for e, u in ordered],
    }

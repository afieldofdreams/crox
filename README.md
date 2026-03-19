# crox.io

Personal site and consultancy page for Adam Field. Monorepo with `client` (React 18 + Vite + Tailwind) and `server` (Flask 3).

## Quick start

1. Install client deps

```bash
cd client && npm install
```

2. Install server deps

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r server/requirements.txt
```

3. Run both

```bash
npm run dev
```

Client: http://localhost:3099
Server: http://localhost:5000

## Tech

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router (Home + About pages)
- DM Mono + Instrument Serif (Google Fonts)
- Formspree for contact form
- Flask 3 API server

## Pages

- `/` — Home: hero, offerings, testimonials, writing, contact form
- `/about` — About: career arc, education, contact

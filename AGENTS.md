# Ocean-Protection

## Stack
- **Express 5** (`^5.2.1`) + **Multer 2** (`^2.1.1`) — CommonJS
- No build step, no database — file-based JSON storage at `data/articles.json`
- Static frontend served from `public/`

## Start
```sh
node server.js
# Server starts on http://localhost:3000
```

## Structure
- `server.js` — API server (port 3000). Creates `data/` and `public/images/` at startup if missing.
- `public/` — static files: `index.html` (home), `admin.html` (publish), `article.html` (detail), `game.html` (minigame)
- `public/images/` — uploaded via `POST /api/upload` (multipart, field name `image`)
- `data/articles.json` — CRUD via `/api/articles` endpoints. Auto-initialized as `[]`.
- `public/video/ocean.mp4` — background video asset

## API
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/articles` | list all |
| GET | `/api/articles/:id` | single article |
| POST | `/api/articles` | body: `{ title, content, summary?, author?, tags? }` |
| DELETE | `/api/articles/:id` | |
| POST | `/api/upload` | multipart, field `image`; returns `{ url }` |

## Conventions
- Article `id` is generated as `Date.now().toString(36) + random(5)` on creation
- All API responses and UI are in **Chinese**
- No tests, no linter, no formatter configured
- Package scripts have no `start` command — use `node server.js` directly

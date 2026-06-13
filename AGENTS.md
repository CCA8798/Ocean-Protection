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

## article.html — TOC
- After rendering Markdown via `marked.parse()`, `buildTOC()` scans `<h2>` elements
- Builds a sticky right-side navigation (`<nav class="toc">`) with smooth-scroll links
- IntersectionObserver highlights the current section; hidden if fewer than 2 h2s
- On narrow viewports (<900px) the TOC collapses to a static top bar

## game.html — 6 Mini-Games
All games share a common restart system: press **R** at the game-over overlay to restart.

| Game | Key Improvements |
|------|-----------------|
| **OceanCleanup** | 3 trash types (🥤+5 / 🥫+10 / 🛍️+15), combo system (🔥xN), water-wave surface animation, speed slider preserved |
| **TurtleRescue** | Nets from top & sides, 🛡️ shield power-up (absorbs 1 hit), sparkle effect on rescue, heart display |
| **SharkDefender** | 🐟 healing fish restore health, red flash warns of incoming harpoons, health bar with color gradient |
| **CoralReef** | Growth progress bar under each coral, trash streak multiplier, 4 trash types, click-to-clean combo |
| **WhaleSong** | Button flash on press, step indicator (X/Y), sound-wave decoration, ✓/✗ feedback after each input |
| **SustainableFishing** | 50s timer, depth indicator, cm size shown above fish, catch/release counter, fish vertical wobble |

## 交互要求

- Thinking思考过程用中文表述
- Reply回答也要用中文回复
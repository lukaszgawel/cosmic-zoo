# Kosmiczne Zoo

A multiplication (tables up to 10×10) and subtraction (up to 100) game for children, in Polish. The player flies a rocket between planets, solves short daily missions, rescues creatures and builds a space base. Sessions take 5–10 minutes, with a daily limit of 15 minutes by default.

It runs as a static web page with no server, no accounts and no build step. Progress stays in the browser on this computer.

## Run it

Double-click `index.html` and open it in **Chrome or Edge**. That's all.

> Don't move or rename the folder after play has started. Saved progress is tied to the file path. Export a backup from the parent panel first.

## Documentation

| File | For | Contents |
|---|---|---|
| [`USER_MANUAL.md`](USER_MANUAL.md) / [`.pdf`](USER_MANUAL.pdf) | Parents and players | How to play, every screen, the parent panel, backup and troubleshooting |
| [`PLAN.md`](PLAN.md) | Developers | Design goals, game design, technical decisions, data model and roadmap |

`USER_MANUAL.md` is the source. After editing it, rebuild the PDF:

```
pip install markdown
python tools/build-manual.py
```

The script turns the Markdown into an A4 page and prints it with headless Chrome or Edge, which it finds automatically (or pass `--browser <path>`). It stops if a link inside the manual points at a heading that doesn't exist. Add `--html` to also keep `USER_MANUAL.html` for a quick look in the browser; that file is git-ignored.

## Development

**Stack:** plain HTML, CSS and JavaScript loaded with classic `<script>` tags. There are no ES modules, no `fetch()` and no external assets, because browsers block those on `file://`. Graphics are inline SVG (`js/art.js`) and sounds are generated with the Web Audio API (`js/audio.js`).

**Conventions**
- All scripts share one global `App` object. **Load order in `index.html` matters**: a file may only use what earlier files define.
- All Polish UI text lives in `js/pl.js` (`App.T`). Code and comments are in English.
- Each screen renders its whole HTML through `App.ui.render()` into `#app`.
- Styles are in a single file, `css/style.css`, grouped by phase and feature.

**Code map**

| Area | Files |
|---|---|
| Startup, home screen | `main.js`, `ui.js` |
| Saved state, streak, time limit | `state.js`, `timer.js` |
| Operations (answer, display, hints and feed cards for each operation) | `ops.js` |
| Adaptive question picking | `questions.js` |
| Game modes | `mission.js` (classic, missing number, Boss), `meteor.js`, `feed.js`, `modes.js` (rotation and unlocks) |
| Rewards and collection | `rewards.js`, `collection.js`, `base.js`, `prizes.js` |
| Player setup, parent area | `profile.js`, `parent.js` |
| Text, art, sound | `pl.js`, `art.js`, `audio.js` |
| Building the PDF manual (not part of the game) | `tools/build-manual.py` |

**Saved data:** everything is stored as one JSON object in `localStorage` under the key `kosmiczne-zoo-v1`. If you change its shape, keep it backward compatible or migrate it in `state.js`, because existing players' progress and exported backups depend on it.

**Testing:** there are no automated tests. Open `index.html` and play it. To test from a fresh profile, use a private window, or clear the key above in DevTools → Application → Local Storage.

## Status

Phases 1–3 of the roadmap are done. Phase 4 (online hosting, cloud sync, division mode) is optional; see `PLAN.md`. Phase 5, the subtraction galaxy, is done: subtraction up to 100 with 9 planets, all mission types and the parent panel views, described in the user manual.

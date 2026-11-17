# Multiplication Game – Project Plan

**Working title:** *Kosmiczne Zoo* (Space Zoo)
**Player:** 8-year-old girl, learning multiplication
**Goal:** a short, fun daily habit (5–10 minutes) that builds fluency with the tables up to 10×10
**Platform:** web browser on a laptop or PC, controlled by keyboard (mouse also works), opened as a local file (`index.html`)
**Daily play limit:** at most 15 minutes a day
**Game language:** Polish (code and this plan are in English)

---

## 1. Design principles

1. **Simple:** one big button to start. No menus to dig through and no reading-heavy screens.
2. **Short:** one daily session = **one mission of about 10 questions**, roughly 5 minutes. She should finish while she still wants more. Total play time is **capped at 15 minutes a day** (see section 5).
3. **Rewards every day:** coming back each day earns something new, so there's always a reason to open the game.
4. **No punishment:** a wrong answer never costs points or lives. The game shows the correct answer with a visual hint and asks that question again later.
5. **Adapts to her:** the game works out which facts she knows and practises the hard ones more, so no placement test is needed.
6. **Visible progress:** she can always see what she has collected and built.

---

## 2. Theme and story

The theme combines all four interest areas (animals, space, magic, building):

> Your rocket travels across the galaxy. On each planet live **magical creatures**
> (a space cat, a unicorn-dragon, a glowing fox...) that need help. Solving
> multiplication problems fuels the rocket and rescues the creatures. Rescued
> creatures move to your **space base**, which you build and decorate.

- **Planet = multiplication table.** For example, Planet ×2 and Planet ×5. She unlocks them in order of difficulty:
  ×1, ×10 → ×2 → ×5 → ×3 → ×4 → ×9 → ×6 → ×7 → ×8 → finally the "Mixed Galaxy" (mixed questions).
- **Creatures** are collectibles. Each planet has 3–4 to rescue, and some are rare.
- **Space base** is the building part. She spends stars (the in-game currency) on decorations, such as houses for the creatures, plants, lights and a fountain, and places them on a simple grid.

---

## 3. Core gameplay loop

### First launch
1. "Jak masz na imię?" She types her name, and the game greets her by name from then on.
2. She picks an **avatar** (an astronaut girl, a cat-astronaut, a fox pilot, a robot...) and a **rocket colour**.
3. She names her rocket.
4. A short intro (3 screens, mostly pictures) explains the story, then the first mission starts.

She can change the avatar and rocket colour later in a "Mój profil" screen.

### Every day
```
Open the game
  → Greeting + streak flame ("Dzień 5! 🔥")
  → [START MISJI] button
  → 10 questions (one at a time, big font)
       correct → animation + stars, rocket moves forward
       wrong   → friendly hint, correct answer shown, question comes back later in the mission
  → Mission summary: stars earned, new creature or chest
  → Space base: place new decoration / visit creatures
  → "Do zobaczenia jutro!" (She can keep playing, but daily rewards come only once per day)
```

### Question screen (main screen)
- Large problem in the middle: **`6 × 7 = ?`**
- She types the answer and presses **Enter**. The answer field is always focused, so no mouse is needed.
- A progress bar shaped like the rocket's path (10 steps).
- **No timer pressure by default.** Fast answers earn a small bonus ("Błyskawica! ⚡") but slow answers lose nothing.

### Help when wrong
- Show the problem as an **array of dots or objects** (6 rows × 7 stars). This builds understanding instead of rote memory.
- Show a tip where one exists, such as "6 × 7 to 6 × 5 + 6 × 2".
- The same fact comes back 2–3 questions later. If she gets it right, she gets a "Teraz już wiesz!" bonus.

---

## 4. Mini-game variety (keeps it fresh)

The mission format rotates each day. Every format still uses the same core: answering multiplication facts.

| Mode | Description | Introduced |
|---|---|---|
| **Classic mission** | 10 questions, type the answer | Day 1 |
| **Meteor shower** | Problems fall slowly; type the answer to blast the meteor before it lands. Gentle speed. | Day 3 |
| **Feed the creatures** | A creature wants a number (e.g. 24). Pick all the problems that equal it from 6 cards (4×6, 3×8...). | Day 5 |
| **Missing number** | `4 × ? = 28` | After planet ×4 |
| **Boss: Kosmiczny Bałagan** | At the end of each planet, 15 questions from that table. Winning rescues a rare creature. | End of each planet |

Version 1 needs only *Classic mission* and *Boss*. The other modes are added later (see roadmap).

---

## 5. Motivation and daily habit

| Mechanic | Detail |
|---|---|
| **Streak flame 🔥** | Counts consecutive days played. **1 "freeze" per week** protects the streak, because an 8-year-old shouldn't lose everything over a family trip. |
| **Daily chest** | Opened after the first mission of the day. Contains stars plus sometimes a decoration or creature egg. |
| **Creature eggs** | An egg hatches after N days of play, which builds anticipation for tomorrow. |
| **Collection album** | Silhouettes of creatures not yet found. Curiosity drives completion. |
| **Milestone celebrations** | 7, 14, 30, 50, 100 days, plus a certificate the parent can print. |
| **Personal records** | "Najszybsza misja", "Najdłuższa seria poprawnych odpowiedzi". She competes only with herself. |
| **Real-world rewards 🎁** | The parent sets real rewards in the parent panel and links each one to a milestone, e.g. a 7-day streak = an ice cream, planet ×7 beaten = a cinema trip, 30-day streak = a new book. The child sees the next reward as a **wrapped gift on the rocket's route** with a progress bar ("Jeszcze 3 dni do niespodzianki!"). When she reaches it, the game shows a **reward voucher** ("Bon na: lody 🍦"), which stays in a "Moje nagrody" list until the parent marks it as given. |

### Daily time limit (15 minutes)
- The game counts **active play time per day**, i.e. time spent in missions and in the space base, not time the window sits idle in the background.
- At about **12 minutes**, a gentle warning appears: "Jeszcze chwilka – rakieta niedługo ląduje na noc 🌙".
- At **15 minutes**, the current question or mission finishes, so she is never cut off mid-question, and then the rocket "goes to sleep": "Świetna robota! Wróć jutro – stworki będą czekać." She can still look at the collection album, but she can't play more missions or earn stars that day.
- The limit is a setting in the parent panel (default 15 minutes), and the parent can unlock extra time for one day.
- The clock resets at midnight.

**Deliberately avoided:** leaderboards against others, losing lives or points, ads, ticking timers by default, and long sessions. They cause stress and an 8-year-old doesn't need them.

---

## 6. Adaptive learning (under the hood)

- Track every fact (1×1 … 10×10, 100 facts; commutative pairs like 3×7 and 7×3 are linked).
- For each fact, store: attempts, correct answers, average response time, and a **mastery level from 0 to 5** (a simplified Leitner box system).
- **Question selection in a mission:**
  - about 60% facts from the current planet (the table being learned)
  - about 25% weak facts (low mastery or recently wrong)
  - about 15% mastered facts as a review, which keeps it easy and builds confidence
- A fact counts as **mastered** after it is answered correctly and quickly (under about 5 seconds) on 3 different days.
- A planet is **completed** when its Boss is beaten. The next planet then unlocks.
- Starting level: everyone starts at ×1/×10, but if she answers fast and correctly, planets unlock quickly. No test needed.

---

## 7. Parent panel

Opened with a small 🔒 icon plus a simple math gate (e.g. "Ile to 13 × 7?").

- A **heat map 10×10**: each fact coloured green, yellow or red by mastery.
- Days played and minutes per day (last 30 days).
- Most common mistakes.
- **Real-world rewards:** add, edit or remove rewards (name, emoji, milestone type, target), and mark earned vouchers as given.
- **Time limit:** set daily minutes (default 15) and give extra time for today.
- Settings: session length (5/10/15 questions), optional timer on/off, reset progress, export/import progress (JSON backup).

---

## 8. Audio and visuals

- A bright, friendly, cartoon-style space theme with large fonts (minimum 48 px for the problem).
- Simple short sounds: correct answer, star, level up, chest opening. A **mute button** is always visible.
- Optional: the problem is read aloud in Polish using the browser's speech synthesis (Web Speech API, `pl-PL`).
- **Art: simple SVGs**, built from basic shapes with bright colours. This covers creatures, avatars, rockets, planets and base decorations. SVGs are small, look sharp at any size and are easy to recolour (e.g. the rocket colour she picks). They can later be replaced with her own drawings, which would make the game even more personal.
- Animations: CSS only (bounce, confetti, rocket flight). Nothing heavy.

---

## 9. Technical approach

**Fully static web app with no server, no accounts and no data leaving the computer.**

| Item | Choice | Why |
|---|---|---|
| Stack | Plain **HTML + CSS + JavaScript** with classic `<script>` tags (no ES modules, no build step) | Works when opened straight from disk; no framework to learn or maintain |
| Storage | `localStorage` (one JSON object), plus a JSON export/import backup | No backend needed; progress stays on the computer |
| Running | **Local file:** double-click `index.html`, or a desktop shortcut to it | No hosting, no internet needed |
| Graphics | Inline SVG (in JS/HTML), not separate image files | Avoids any file-loading issues locally |
| Sounds | Generated with the **Web Audio API** (short tones and jingles) | No audio files to load, works offline |

**Constraints of running from `file://`** (and how the plan avoids them):
- ES modules (`<script type="module">`) and `fetch()` of local files are blocked by browsers on `file://`. So the plan uses plain scripts that share one global `App` object, and keeps all data (texts, creatures, SVGs) inside `.js` files.
- Service workers / PWA don't work on `file://`. That's not needed for a local file anyway.
- `localStorage` works on `file://` in Chrome and Edge, but it is tied to that browser on that computer, and in some browsers to the exact file path. **Don't move or rename the folder** after she starts playing, or progress will appear lost. Export/import covers backup and moving.
- **Recommended browser: Chrome or Edge.** Firefox treats each `file://` page as its own origin, which can be less reliable for saving.

Moving to online hosting later (e.g. GitHub Pages) would need no code changes, but progress would have to be moved with export/import.

### Proposed file structure
```
multiplication/
├─ index.html
├─ css/
│  └─ style.css
├─ js/                # loaded in this order by plain <script> tags
│  ├─ pl.js            # all Polish text in one place
│  ├─ art.js           # SVG drawings: creatures, avatars, rockets, planets, decorations
│  ├─ state.js         # load/save progress (localStorage), streaks, daily logic
│  ├─ timer.js         # daily play-time tracking and 15-minute limit
│  ├─ questions.js     # adaptive fact selection, mastery tracking
│  ├─ mission.js       # classic mission + boss gameplay
│  ├─ rewards.js       # stars, chest, eggs, creatures, decorations, real-world rewards
│  ├─ profile.js       # first launch: name, avatar, rocket
│  ├─ base.js          # space base grid & decoration placement
│  ├─ parent.js        # parent panel & stats
│  ├─ audio.js         # Web Audio sounds + optional speech
│  └─ main.js          # screen routing, startup
└─ PLAN.md
```

### Data model (localStorage, simplified)
```js
{
  version: 1,
  player: { name: "…", avatar: "astronautka", rocketName: "…", rocketColor: "#ff6fa8" },
  stars: 120,
  playTime: { date: "2026-11-17", seconds: 410, extraMinutes: 0 },
  realRewards: [
    { id: "r1", name: "Lody", emoji: "🍦", milestone: "streak", target: 7, status: "earned" },
    { id: "r2", name: "Kino", emoji: "🎬", milestone: "planet", target: "x7", status: "pending" }
  ],
  streak: { current: 5, best: 12, lastPlayed: "2026-11-17", freezesLeft: 1 },
  facts: { "6x7": { attempts: 8, correct: 6, avgMs: 4200, mastery: 3, lastSeen: "2026-11-16" } },
  planets: { "x2": "completed", "x5": "active", "x3": "locked" },
  creatures: ["kot-kosmita", "lis-swietlik"],
  eggs: [{ id: "egg1", hatchOnDay: 7 }],
  base: [{ item: "domek", x: 2, y: 3 }],
  history: [{ date: "2026-11-17", questions: 10, correct: 9, seconds: 240 }],
  settings: { sound: true, speech: false, sessionLength: 10, timer: false, dailyLimitMinutes: 15 }
}
```

---

## 10. Roadmap

### Phase 1 – MVP (playable in a weekend)
- [x] First launch: name, avatar, rocket name and colour
- [x] Home screen greeting her by name, with START button
- [x] Classic mission: 10 questions, keyboard input, correct/wrong feedback
- [x] Dot-array hint on wrong answer, question repeated later
- [x] Stars and a mission summary screen with confetti
- [x] Streak counter + daily chest
- [x] Planets ×1/×10 → ×2 → ×5 → ×3 with Boss levels (beating a Boss rescues a creature, an early taste of Phase 2)
- [x] Daily 15-minute play limit with gentle warning and "rocket sleeps" screen
- [x] Progress saved in localStorage
- [x] Polish text, simple SVG art, sounds + mute button
- [x] Runs by double-clicking `index.html` (tested in headless Chrome from `file://`)

**Phase 1 tuning values** (in `js/questions.js`): Boss unlocks after 20 correct answers on the planet (about 2–3 missions); Boss = 15 questions, 12 needed to win; "Błyskawica" bonus under 5 s.

**Success check:** she plays it on her own 5 days in a row.

### Phase 2 – Collection and building
- [x] Creatures + collection album with silhouettes (10 species × 3 variants = 30: 🏆 from the Boss, 🥚 colour variant from an egg, ✨ rare gold from an egg)
- [x] Space base with decorations bought with stars (8×5 grid, 12 decorations from 15 to 150 ⭐, creatures can be placed too)
- [x] Eggs that hatch after N days (3 days of play; from the daily chest, always in the first chest, or 60 ⭐ in the shop)
- [x] All planets up to ×8 + Mixed Galaxy (Mixed Galaxy = all facts, with its own Boss and the Phoenix)
- [x] Adaptive question selection (mastery 0–5 per fact, at most +1 per day, −2 on a mistake; missions ≈ 60% current planet, 25% weak facts, 15% review)
- [x] Older saved progress is upgraded automatically (new planets unlock after the old last one)

### Phase 3 – Variety and parent tools
- [x] Meteor shower, Feed the creatures and Missing number modes (rotate every mission; unlocked on day 3, day 5 and after planet ×4; each introduced with a short "how to play" card; Boss fights stay classic)
- [x] Parent panel with heat map and history (behind a math-question gate; stats, 10×10 mastery grid, most common mistakes, minutes per day for the last 14 days)
- [x] Real-world rewards: parent sets them, gift on the route, vouchers, "Moje nagrody" list (goals: streak, days played, planet rescued, creatures collected; name can be hidden as "Niespodzianka")
- [x] Time limit setting + "extra time today" in the parent panel (also: questions per mission, classic-only option, sound)
- [x] Export/import progress (JSON file) + reset with double confirmation
- [x] Milestone certificates (printable: 7/14/30/50/100 days of play, each rescued planet, whole galaxy; A4 landscape print layout)
- [x] Optional Polish voice reading problems aloud (Web Speech API, off by default, with a test button)

### Phase 4 – Nice-to-have
- [ ] Online hosting (GitHub Pages) + PWA install, if she starts playing on other devices
- [ ] Her own drawings as creatures (scan or photo upload)
- [ ] Cloud sync between devices (e.g. Firebase or Supabase), only if needed
- [ ] Division mode as the next step

---

## 11. Decisions made

| Question | Decision | Where in the plan |
|---|---|---|
| Player name / avatar on first launch | **Yes** | Section 3 – First launch |
| Art style | **Simple SVGs** | Section 8 |
| Daily time limit | **Yes, max 15 minutes a day** | Section 5 – Daily time limit |
| Hosting | **Local file for now** | Section 9 |
| Real-world rewards | **Yes, set by the parent** | Sections 5 and 7 |

---

## 12. Tips for parents

- Let her **name the rocket and the first creature**. Ownership boosts motivation a lot.
- Play the first session **together**, then step back.
- Celebrate the streak, not the score: "Grałaś 7 dni z rzędu!" works better than "Zero błędów".
- Pick a fixed daily moment, e.g. right after homework or before a cartoon.
- **Choose the real-world rewards together with her** before entering them in the parent panel. Keep them small and frequent at first (7 days), then bigger and rarer (30, 50 days). Experiences such as a trip or a game together often work better than objects.
- When a voucher appears, honour it quickly. The real reward is what makes the in-game gift believable.

# Opscontrol — Enterprise Operations Dashboard

React implementation of the Claude Design handoff in `../desktop-and-mobile-wireframes/`
(`Ops Dashboard Frames.dc.html`, frames **1a** desktop / **1b** mobile).

**Stack:** React 19 · JSX · Vite 6 · Tailwind CSS v4

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

The layout is responsive: **≥1024px** renders frame 1a, below it frame 1b. A toggle
fixed to the bottom-right (`Auto / 1a / 1b`) pins either frame for review.

---

## Design system

The handoff's `_ds/industry-…/styles.css` is the source of truth for the look. Its
tokens are ported into Tailwind's `@theme` block in [src/index.css](src/index.css),
which turns each one into a real utility — `--color-accent-900` → `bg-accent-900` /
`text-accent-900` / `border-accent-900`, `--font-heading` → `font-heading`.

Retune the system there, not in components. The radius scale is deliberately
neutralised to `0px` because the design is a blueprint language: everything is square.

The corner registration marks are the one thing left as hand-written CSS
(`@layer components`) — the utility version of four `::before`/`::after` pairs is
unreadable. React wraps it in [`<Blueprint>`](src/components/ui/Blueprint.jsx).

---

## Structure

```
src/
├─ main.jsx                  createRoot + StrictMode
├─ App.jsx                   provider, responsive frame switch, frame toggle
├─ index.css                 Tailwind entry + @theme design tokens
├─ data/dashboardData.js     all seed data (departments, activities, notifications, series)
├─ state/
│  ├─ dashboardReducer.js    every state transition, one file
│  └─ DashboardContext.jsx   provider + useDashboard()
├─ hooks/useMediaQuery.js
└─ components/
   ├─ ui/                    Blueprint, StatCard, Tag, ProgressBar, Button, Dialog, Icons
   ├─ charts/                TrendChart (two geometry presets), Sparkline
   ├─ desktop/               frame 1a — TopNav, Sidebar, sections 01–05, dialogs
   └─ mobile/                frame 1b — chrome, Overview, Activities, Insights, Alerts
```

### State model

| Kind | Example | Where it lives |
| --- | --- | --- |
| Local view state | Open notification tab, department filter, dialog open | `useState` in the section |
| Shared between siblings | `activeTab`, `statusFilter` | `useState` in `DesktopApp` |
| Application state | Activities, notifications, selection, open dialog | `dashboardReducer` + context |

Anything computable is **derived, not stored** — filtered rows, page counts, bar
widths, chart coordinates, and the alert total. The alert count in particular is
derived once in `DashboardContext` so the bell badge and the KPI tile cannot disagree.

---

## What was implemented beyond the static mock

The design is a prototype; these are the decisions a working app forces.

- Every `<span>`-styled control is a real `<button>` / `<input>` / `<select>`, with
  hover, active, disabled and `focus-visible` states.
- **Working behaviour:** filter departments; filter activities by department,
  priority and status; paginate; select rows (tri-state header checkbox) and
  bulk-complete; complete or advance an activity; create one via a validated form;
  read/dismiss notifications; navigate mobile tabs; sidebar scroll-to-section.
- Empty states on every list.
- Chart coordinates are computed from data by scale functions, verified against the
  design's own hand-typed coordinates (desktop point 1 = `20,163`, as drawn).
- `isMine` added to the seed data to back the mobile "Mine" chip, which a static
  mock had no way to express.
- Mobile **Insights** and **Alerts** screens built — the design draws only two of the
  four tabs, and a tab that does nothing is a bug.
- Notification tab counts show the real list rather than the mock's `All 14`;
  the *alert* total is genuinely a slice of a larger feed, so it is offset instead.

---

## Companion document

`../React Step by Step - Opscontrol Dashboard.pdf` — 38 pages covering every React
concept used here, in order, with the actual code, plus the twelve-stage build order
from first part to last.

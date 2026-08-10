# OpsControl — Enterprise Operations Dashboard

A React implementation of an Enterprise Operations Dashboard, built for the
**UI/UX Designer & Frontend Developer Assessment** (Elevare Human Solutions Ltd).

Gives managers one screen to answer three questions: what's the overall health of
the organization, which departments or activities need attention right now, and
where is that trending. Ships as two responsive frames — desktop (1440px) and
mobile (390px) — from a single codebase.

**Stack:** React 19 · Vite 6 · Tailwind CSS v4

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # → dist/
```

---

## Deliverables

| | |
|---|---|
| **Figma design file** | [link] |
| **Design rationale document** | [link / see `DESIGN-RATIONALE.md`] |
| **This repository** | Desktop + mobile React implementation |

---

## What's here

The layout is genuinely responsive — **≥1024px** renders the desktop frame, below
it the mobile frame — via `useMediaQuery` subscribing to the viewport, not a
one-time width check. A small toggle (`Auto / 1a / 1b`) pins either frame for
review regardless of window size.

### Sections implemented

1. **Executive Summary** — operational health, active/completed/delayed activities,
   high-priority alerts. Designed to be read in under five seconds.
2. **Department Performance** — status, progress, and activity counts across
   Operations, Finance, HR, Sales, and Customer Service.
3. **Activity Management** — filterable, paginated activity list with owner,
   department, priority, status, and due date. View / Update / Mark complete on
   every row.
4. **Notifications** — delayed activities, pending approvals, escalations, and
   system alerts, filterable by type.
5. **Performance Dashboard** — activity completion trend and workload
   distribution, built as real SVG charts driven by data, not static images.

### Structure

```
src/
├─ main.jsx                  createRoot + StrictMode
├─ App.jsx                   provider, responsive frame switch, frame toggle
├─ index.css                 Tailwind entry + @theme design tokens
├─ data/dashboardData.js     seed data — departments, activities, notifications, series
├─ state/
│  ├─ dashboardReducer.js    every state transition, one file
│  └─ DashboardContext.jsx   provider + useDashboard()
├─ hooks/useMediaQuery.js
└─ components/
   ├─ ui/                    Blueprint, StatCard, Tag, ProgressBar, Button, Dialog, Icons
   ├─ charts/                TrendChart (two geometry presets), Sparkline
   ├─ desktop/               desktop frame — TopNav, Sidebar, sections 1–5, dialogs
   └─ mobile/                mobile frame — chrome, Overview, Activities, Insights, Alerts
```

### Design system

All colors, type, and spacing are design tokens ported into Tailwind's `@theme`
block in [`src/index.css`](src/index.css) — `--color-accent-900` becomes
`bg-accent-900` / `text-accent-900` / `border-accent-900`, and so on. Retune the
system there, not in individual components.

The radius scale is neutralised to `0px` throughout: the visual language is a
"blueprint" — hairline borders, corner registration marks, square corners — kept
deliberately quiet so status colors (delayed, at-risk, critical) stay the only
thing competing for attention.

### State model

| Kind | Example | Where it lives |
|---|---|---|
| Local view state | Open notification tab, department filter, dialog open | `useState` in the section |
| Shared between siblings | `activeTab`, `statusFilter` | `useState` in `DesktopApp` |
| Application state | Activities, notifications, selection, open dialog | `dashboardReducer` + context |

Anything computable is derived, not stored — filtered rows, page counts, bar
widths, chart coordinates, and the alert total. The alert count is derived once in
`DashboardContext` so the notification bell and the KPI tile can't disagree.

### Interactions implemented

- Every visual control is a real `<button>` / `<input>` / `<select>` — with hover,
  active, disabled, and `focus-visible` states, not a styled `<span>`.
- Filter departments; filter activities by department, priority, and status;
  paginate; select rows and bulk-complete; complete or advance an activity's
  status; create a new activity via a validated form; read/dismiss notifications;
  navigate mobile tabs.
- Empty states on every list.
- Both mobile tabs the design implies but doesn't fully draw — **Insights** and
  **Alerts** — are built out, not left as dead links.

---

## Accessibility & scaling

Status is always paired with a text label, never color alone. Text and
interactive elements target WCAG AA contrast. All interactive targets are sized
for both touch and keyboard/focus navigation.

The activity list is built to paginate rather than fully render, so it holds up
at 500+ activities without a virtualization rewrite. The same component set
(Executive Summary, Department Performance, Activity Management) is designed to
be re-composed per role — an executive sees summary + rollups only, a department
lead sees their filtered activity table by default — since the underlying data is
already keyed by department, owner, and status.

---

## Companion document

`React Step by Step - Opscontrol Dashboard.pdf` — a walkthrough of every React
concept used in this codebase, in build order, with the actual code from this repo.

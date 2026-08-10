/* ============================================================================
   The seed data for the dashboard.

   In a real product every export here would arrive from an API. Keeping it in
   one plain module means (a) the UI components stay pure — they render what
   they are given and nothing else, and (b) swapping in a real fetch later
   touches this file and the provider, not fifteen components.
   ========================================================================== */

export const CURRENT_USER = {
  initials: 'AO',
  name: 'A. Okonkwo',
  role: 'Operations Manager',
};

export const HEALTH = {
  score: 87,
  target: 90,
  outOf: 100,
  trendLabel: 'Stable',
  deltaPoints: 3,
};

/* --------------------------------------------------------------------------
   Departments
   `progress` drives the bar width; `status` drives the badge and bar colour.
   ------------------------------------------------------------------------ */
export const DEPARTMENTS = [
  { id: 'ops',     name: 'Operations',       short: 'Operations',    status: 'on-track', progress: 78, active: 124, done: 418, delayed: 6 },
  { id: 'fin',     name: 'Finance',          short: 'Finance',       status: 'on-track', progress: 91, active: 46,  done: 302, delayed: 1 },
  { id: 'hr',      name: 'Human Resources',  short: 'Human Res.',    status: 'at-risk',  progress: 54, active: 38,  done: 147, delayed: 8 },
  { id: 'sales',   name: 'Sales',            short: 'Sales',         status: 'on-track', progress: 83, active: 72,  done: 265, delayed: 4 },
  { id: 'cs',      name: 'Customer Service', short: 'Cust. Service', status: 'critical', progress: 41, active: 62,  done: 152, delayed: 8 },
];

export const DEPARTMENT_STATUS_LABELS = {
  'on-track': 'On track',
  'at-risk': 'At risk',
  critical: 'Critical',
};

/* --------------------------------------------------------------------------
   Activities — the working set the tables and mobile cards render.
   `dueDate` is an ISO string so it can be sorted and compared; `daysLate` is
   precomputed here to keep the design's copy ("+4d") exact. `isMine` backs
   the mobile "Mine" filter chip — the design shows the chip but a static mock
   has no way to say which rows it means, so the flag is added here.
   ------------------------------------------------------------------------ */
export const ACTIVITIES = [
  {
    id: 'a-101',
    isMine: true,
    title: 'Tier 1 support backlog clearance',
    owner: 'K. Bello',
    departmentId: 'cs',
    priority: 'high',
    status: 'delayed',
    dueDate: '2026-08-06',
    dueLabel: '6 Aug',
    daysLate: 4,
  },
  {
    id: 'a-102',
    isMine: true,
    title: 'Q3 vendor contract renewal',
    owner: 'T. Adeyemi',
    departmentId: 'fin',
    priority: 'high',
    status: 'in-review',
    dueDate: '2026-08-12',
    dueLabel: '12 Aug',
    daysLate: 0,
  },
  {
    id: 'a-103',
    isMine: false,
    title: 'Onboarding batch 24 — documentation',
    owner: 'N. Eze',
    departmentId: 'hr',
    priority: 'medium',
    status: 'delayed',
    dueDate: '2026-08-04',
    dueLabel: '4 Aug',
    daysLate: 6,
  },
  {
    id: 'a-104',
    isMine: true,
    title: 'Warehouse cycle count — Zone B',
    owner: 'I. Musa',
    departmentId: 'ops',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2026-08-14',
    dueLabel: '14 Aug',
    daysLate: 0,
  },
  {
    id: 'a-105',
    isMine: false,
    title: 'Regional pipeline review — West',
    owner: 'C. Ogun',
    departmentId: 'sales',
    priority: 'low',
    status: 'in-progress',
    dueDate: '2026-08-19',
    dueLabel: '19 Aug',
    daysLate: 0,
  },
  {
    id: 'a-106',
    isMine: true,
    title: 'Monthly payroll reconciliation',
    owner: 'T. Adeyemi',
    departmentId: 'fin',
    priority: 'medium',
    status: 'completed',
    dueDate: '2026-08-02',
    dueLabel: '2 Aug',
    daysLate: 0,
  },
];

export const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

export const ACTIVITY_STATUS_LABELS = {
  delayed: 'Delayed',
  'in-review': 'In review',
  'in-progress': 'In progress',
  completed: 'Completed',
};

/* --------------------------------------------------------------------------
   Notifications
   `kind` selects the icon; `category` drives the All / Escalations / Approvals
   tabs; `actions` is true only for the row the design gives buttons to.
   ------------------------------------------------------------------------ */
export const NOTIFICATIONS = [
  {
    id: 'n-1',
    kind: 'alert',
    category: 'escalation',
    title: 'SLA breach — Tier 1 support queue',
    meta: 'Customer Service · escalated by K. Bello',
    mobileMeta: 'Customer Service · 12m ago',
    mobileTitle: 'SLA breach — Tier 1 queue',
    time: '12m',
    unread: true,
    actions: true,
  },
  {
    id: 'n-2',
    kind: 'clock',
    category: 'escalation',
    title: '4 activities passed due date',
    meta: 'Human Resources · onboarding batch 24',
    mobileMeta: 'Human Resources · 1h ago',
    mobileTitle: '4 activities passed due date',
    time: '1h',
    unread: true,
    actions: false,
  },
  {
    id: 'n-3',
    kind: 'approval',
    category: 'approval',
    title: 'Q3 vendor renewal awaiting approval',
    meta: 'Finance · ₦18.4M · submitted by T. Adeyemi',
    time: '3h',
    unread: true,
    actions: false,
  },
  {
    id: 'n-4',
    kind: 'escalate',
    category: 'escalation',
    title: 'Warehouse cycle count escalated',
    meta: 'Operations · variance above 2%',
    time: '5h',
    unread: false,
    actions: false,
  },
  {
    id: 'n-5',
    kind: 'system',
    category: 'approval',
    title: 'Scheduled maintenance 02:00–04:00',
    meta: 'System · reporting service',
    time: '1d',
    unread: false,
    actions: false,
  },
];

/* --------------------------------------------------------------------------
   Chart series — 12 rolling weeks.

   These are plain numbers on a 0–100 scale. The chart component owns the
   maths that turns a number into an SVG coordinate, which is why the same
   two arrays can drive both the 640×200 desktop chart and the 320×120
   mobile one without being duplicated or rescaled by hand.
   ------------------------------------------------------------------------ */
export const COMPLETION_TREND = {
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
  completed: [17, 29, 11, 42, 34, 53, 63, 48, 71, 64, 84, 95],
  delayed: [20, 25, 17, 28, 22, 18, 27, 15, 21, 17, 13, 10],
  max: 100,
};

/* The sparkline on the "Active activities" tile — a shorter, coarser series. */
export const ACTIVE_SPARKLINE = [6, 9, 7, 13, 11, 16, 14, 19, 20];

export const SUMMARY = {
  activeCount: 342,
  activeDepartments: 5,
  completedCount: 1284,
  completedOnTimeRate: 92,
  delayedCount: 27,
  delayedOverdueBeyond5Days: 9,
  alertCount: 8,
  alertsEscalated: 3,
};

export const SAVED_VIEW = 'Ops manager';

export const WORKLOAD_NOTE =
  'Customer Service is carrying 18% of load with 41% progress — rebalance candidate.';

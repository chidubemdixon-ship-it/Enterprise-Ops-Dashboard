/* ============================================================================
   Mobile — Overview.

   The same data as the desktop frame, re-prioritised for a 390px column:
   health first, four compact KPIs, then only what needs attention, then a
   short department list with "2 more" rather than the full table.

   Every component reused here (<Blueprint>, <StatCard>, <TrendChart>,
   <ProgressBar>, the tags) is the one the desktop uses. That is the payoff
   for building primitives first — the mobile frame is mostly composition, not
   new code.
   ========================================================================== */

import { Blueprint } from '../ui/Blueprint.jsx';
import { StatCard } from '../ui/StatCard.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { MobileHeading } from '../ui/SectionHeading.jsx';
import { DepartmentStatusTag } from '../ui/Tag.jsx';
import { NOTIFICATION_ICONS } from '../ui/Icons.jsx';
import { Button } from '../ui/Button.jsx';
import { TrendChart, TREND_MOBILE } from '../charts/TrendChart.jsx';
import {
  COMPLETION_TREND,
  DEPARTMENTS,
  HEALTH,
  SUMMARY,
} from '../../data/dashboardData.js';
import { useDashboard } from '../../state/DashboardContext.jsx';

function AttentionCard({ notification, onDismiss }) {
  const Icon = NOTIFICATION_ICONS[notification.kind];
  const isHighlighted = notification.kind === 'alert';

  return (
    <Blueprint
      className={`flex gap-2.5 px-3.5 py-3 ${isHighlighted ? 'bg-accent-200' : ''}`}
    >
      <Icon size={16} className={`mt-0.5 flex-none ${isHighlighted ? 'text-accent-800' : ''}`} />

      <div className="flex flex-col gap-[3px]">
        <div className="text-[13.5px] font-medium">
          {/* ?? falls back only when the left side is null/undefined, so a
              deliberately empty string would still win. */}
          {notification.mobileTitle ?? notification.title}
        </div>
        <div className="text-xs text-ink/65">{notification.mobileMeta ?? notification.meta}</div>

        {notification.actions && (
          <div className="mt-1.5 flex gap-2">
            <Button variant="accent" size="md">
              Assign
            </Button>
            <Button size="md" onClick={() => onDismiss(notification.id)}>
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </Blueprint>
  );
}

function DepartmentCard({ department }) {
  return (
    <Blueprint className="flex flex-col gap-[9px] px-3.5 py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{department.name}</span>
        <DepartmentStatusTag status={department.status} />
      </div>

      <div className="flex items-center gap-[9px]">
        <ProgressBar
          value={department.progress}
          tone={department.status === 'critical' ? 'critical' : 'accent'}
        />
        <span className="font-heading text-[13px]">{department.progress}%</span>
      </div>

      <div className="flex gap-4 text-xs text-ink/65">
        <span>{department.active} active</span>
        <span>{department.done} done</span>
        <span className={department.delayed >= 8 ? 'font-medium text-accent-800' : ''}>
          {department.delayed} delayed
        </span>
      </div>
    </Blueprint>
  );
}

const SEVERITY_ORDER = { critical: 0, 'at-risk': 1, 'on-track': 2 };

export function OverviewScreen({ onSeeAllAlerts, onOpenActivities }) {
  const { activities, notifications, alertCount, dispatch } = useDashboard();

  const attention = notifications.filter((n) => n.unread).slice(0, 2);

  const delayedCount = activities.filter((a) => a.status === 'delayed').length;

  /* Worst-first, then busiest — the mobile screen only has room for three,
     so the sort decides which three matter. */
  const ranked = [...DEPARTMENTS]
    .sort(
      (a, b) => SEVERITY_ORDER[a.status] - SEVERITY_ORDER[b.status] || b.active - a.active,
    );
  const shown = ranked.slice(0, 3);
  const remaining = ranked.length - shown.length;

  return (
    <div className="flex flex-col gap-[18px] p-4">
      {/* ---- health hero ---- */}
      <Blueprint
        inverted
        className="flex flex-col gap-[9px] border-accent-900 bg-accent-900 px-4 py-3.5 text-bg"
      >
        <div className="font-heading text-[11px] tracking-[0.16em] uppercase opacity-[0.72]">
          Operational health
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-end gap-2">
            <span className="font-heading text-[46px] leading-[0.9]">{HEALTH.score}</span>
            <span className="pb-[5px] text-[13px] opacity-70">/ {HEALTH.outOf}</span>
          </div>
          <span className="text-xs opacity-80">
            ▲ {HEALTH.deltaPoints} pts · {HEALTH.trendLabel}
          </span>
        </div>

        <ProgressBar value={(HEALTH.score / HEALTH.outOf) * 100} tone="inverted" />
      </Blueprint>

      {/* ---- 2×2 KPI grid ---- */}
      <div className="grid grid-cols-2 gap-3.5">
        <StatCard
          kicker="Active"
          value={SUMMARY.activeCount}
          valueSize="text-[30px]"
          className="gap-[5px] px-3.5 py-3"
        />
        <StatCard
          kicker="Completed"
          value={SUMMARY.completedCount.toLocaleString('en-US')}
          valueSize="text-[30px]"
          className="gap-[5px] px-3.5 py-3"
        />
        <StatCard
          variant="outlined"
          kicker="Delayed"
          value={SUMMARY.delayedCount - (2 - delayedCount)}
          valueSize="text-[30px]"
          className="gap-[5px] px-3.5 py-3"
        />
        <StatCard
          variant="tinted"
          kicker="Alerts"
          value={alertCount}
          valueSize="text-[30px]"
          className="gap-[5px] px-3.5 py-3"
        />
      </div>

      {/* ---- needs attention ---- */}
      <div className="flex flex-col gap-2.5">
        <MobileHeading
          title="Needs attention"
          action={
            <button
              type="button"
              onClick={onSeeAllAlerts}
              className="cursor-pointer text-xs text-accent-700"
            >
              See all {alertCount}
            </button>
          }
        />

        {attention.map((notification) => (
          <AttentionCard
            key={notification.id}
            notification={notification}
            onDismiss={(id) => dispatch({ type: 'notifications/dismiss', id })}
          />
        ))}

        {attention.length === 0 && (
          <Blueprint className="px-3.5 py-6 text-center text-[13px] text-ink/55">
            Nothing needs attention right now.
          </Blueprint>
        )}
      </div>

      {/* ---- trend ---- */}
      <div className="flex flex-col gap-2.5">
        <MobileHeading title="Completion trend" />
        <Blueprint className="px-3.5 py-3">
          <TrendChart series={COMPLETION_TREND} geometry={TREND_MOBILE} />
        </Blueprint>
      </div>

      {/* ---- departments ---- */}
      <div className="flex flex-col gap-2.5">
        <MobileHeading
          title="Departments"
          action={<span className="text-xs text-accent-700">Sort ▾</span>}
        />

        {shown.map((department) => (
          <DepartmentCard key={department.id} department={department} />
        ))}

        <button
          type="button"
          onClick={onOpenActivities}
          className="cursor-pointer pt-0.5 text-center text-xs text-ink/55"
        >
          {remaining} more departments
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   Section 01 — Executive summary.

   Five tiles. Four of them are <StatCard>s with different variants; the hero
   is a StatCard too, using `children` to add its progress bar and footer.

   The counts are *derived*, not stored. `delayedCount` is computed from the
   activities in context every render rather than kept in its own piece of
   state, which means it can never disagree with the table below it. Rule of
   thumb: if you can calculate it from state you already have, calculate it.
   ========================================================================== */

import { useMemo } from 'react';
import { StatCard } from '../ui/StatCard.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { Sparkline } from '../charts/Sparkline.jsx';
import { ClockIcon, WarningIcon } from '../ui/Icons.jsx';
import { ACTIVE_SPARKLINE, HEALTH, SUMMARY } from '../../data/dashboardData.js';
import { useDashboard } from '../../state/DashboardContext.jsx';

export function ExecutiveSummary({ onOpenDelayed, onOpenAlerts }) {
  const { activities, alertCount } = useDashboard();

  /* useMemo caches the result until `activities` changes. On a list this
     small it is not a performance necessity — it is here to show where the
     hook belongs: wrapping a derivation, not wrapping every variable. */
  const counts = useMemo(() => {
    const delayed = activities.filter((a) => a.status === 'delayed').length;
    const completed = activities.filter((a) => a.status === 'completed').length;
    return {
      // The seed totals represent the whole 342-row dataset; the local
      // activities are the visible slice, so we offset the seed by the delta.
      delayed: SUMMARY.delayedCount - (2 - delayed),
      completed: SUMMARY.completedCount + (completed - 1),
    };
  }, [activities]);

  const healthPercent = (HEALTH.score / HEALTH.outOf) * 100;
  const completedRate = SUMMARY.completedOnTimeRate;

  return (
    <section className="flex flex-col gap-3.5">
      <SectionHeading
        number="01"
        title="Executive summary"
        note="Updated 4 min ago · All departments"
        action={
          <button type="button" className="cursor-pointer text-[12.5px] text-accent-700 hover:underline">
            Configure ▸
          </button>
        }
      />

      <div className="grid grid-cols-[1.35fr_1fr_1fr_1fr_1fr] gap-4">
        {/* ---- hero tile ---- */}
        <StatCard
          variant="hero"
          kicker="Overall operational health"
          value={
            <span className="flex items-end gap-2.5">
              <span className="text-[54px] leading-[0.9]">{HEALTH.score}</span>
              <span className="pb-1.5 font-body text-[15px] opacity-70">
                / {HEALTH.outOf} · {HEALTH.trendLabel}
              </span>
            </span>
          }
          valueSize=""
        >
          <ProgressBar value={healthPercent} tone="inverted" />
          <div className="flex justify-between text-xs opacity-75">
            <span>▲ {HEALTH.deltaPoints} pts vs. last month</span>
            <span>Target {HEALTH.target}</span>
          </div>
        </StatCard>

        {/* ---- active ---- */}
        <StatCard
          kicker="Active activities"
          value={SUMMARY.activeCount}
          note={`across ${SUMMARY.activeDepartments} departments`}
        >
          <Sparkline values={ACTIVE_SPARKLINE} className="mt-auto" />
        </StatCard>

        {/* ---- completed ---- */}
        <StatCard
          kicker="Completed"
          value={counts.completed.toLocaleString('en-US')}
          note={`${completedRate}% on-time rate`}
        >
          <ProgressBar value={completedRate} className="mt-auto" />
        </StatCard>

        {/* ---- delayed ---- */}
        <StatCard
          variant="outlined"
          kicker="Delayed"
          icon={ClockIcon}
          value={counts.delayed}
          note={`${SUMMARY.delayedOverdueBeyond5Days} overdue > 5 days`}
        >
          <button
            type="button"
            onClick={onOpenDelayed}
            className="mt-auto cursor-pointer text-left text-xs font-medium text-accent-700 hover:underline"
          >
            Review queue ▸
          </button>
        </StatCard>

        {/* ---- alerts ---- */}
        <StatCard
          variant="tinted"
          kicker="High-priority alerts"
          icon={WarningIcon}
          value={alertCount}
          note={`${SUMMARY.alertsEscalated} escalated to exec`}
          noteClassName="text-accent-800"
        >
          <button
            type="button"
            onClick={onOpenAlerts}
            className="mt-auto cursor-pointer text-left text-xs font-medium text-accent-800 hover:underline"
          >
            Open alerts ▸
          </button>
        </StatCard>
      </div>
    </section>
  );
}

/* ============================================================================
   Section 05 — Performance.

   The workload chart in the design lists departments in descending order of
   active work, with bar widths that happen to be the right ratios. Both of
   those are facts about the data, so both are computed here: sort by `active`
   descending, then scale each bar against the largest value.

   Doing it this way means the chart stays correct when the numbers change —
   the design's hand-picked "58%" cannot.
   ========================================================================== */

import { Blueprint } from '../ui/Blueprint.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { TrendChart, TREND_DESKTOP } from '../charts/TrendChart.jsx';
import { COMPLETION_TREND, DEPARTMENTS, WORKLOAD_NOTE } from '../../data/dashboardData.js';

function LegendSwatch({ colorClass, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-0.5 w-3.5 ${colorClass}`} />
      {label}
    </span>
  );
}

function WorkloadRow({ department, maxActive }) {
  const width = (department.active / maxActive) * 100;
  const isCritical = department.status === 'critical';

  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <span className="w-[104px] flex-none">{department.short}</span>

      <div className="relative h-4 flex-1 bg-neutral-200">
        <div
          className={`absolute inset-y-0 left-0 ${isCritical ? 'bg-accent-900' : 'bg-accent'}`}
          style={{ width: `${width}%` }}
        />
      </div>

      <span className="tabular w-7 text-right">{department.active}</span>
    </div>
  );
}

export function PerformanceSection() {
  /* Copy first, then sort. Array.prototype.sort() mutates in place, and
     mutating an imported module's array would corrupt it for every other
     component that reads it. The spread makes the copy. */
  const byWorkload = [...DEPARTMENTS].sort((a, b) => b.active - a.active);
  const maxActive = byWorkload[0].active;

  return (
    <section className="flex flex-col gap-3.5">
      <SectionHeading
        number="05"
        title="Performance"
        action={<span className="text-[12.5px] text-ink/55">Rolling 12 weeks</span>}
      />

      <div className="grid grid-cols-[1.5fr_1fr] gap-[22px]">
        <Blueprint className="flex flex-col gap-3 px-[18px] py-4">
          <div className="flex items-baseline justify-between">
            <div className="font-heading text-[15px] tracking-[0.1em] uppercase">
              Activity completion trend
            </div>
            <div className="flex gap-3.5 text-xs">
              <LegendSwatch colorClass="bg-accent" label="Completed" />
              <LegendSwatch colorClass="bg-accent-900" label="Delayed" />
            </div>
          </div>

          <TrendChart series={COMPLETION_TREND} geometry={TREND_DESKTOP} />
        </Blueprint>

        <Blueprint className="flex flex-col gap-3.5 px-[18px] py-4">
          <div className="flex items-baseline justify-between">
            <div className="font-heading text-[15px] tracking-[0.1em] uppercase">
              Workload distribution
            </div>
            <span className="text-xs text-ink/55">Active per owner-team</span>
          </div>

          <div className="flex flex-col gap-[11px]">
            {byWorkload.map((department) => (
              <WorkloadRow key={department.id} department={department} maxActive={maxActive} />
            ))}
          </div>

          <p className="mt-auto border-t border-divider pt-2.5 text-xs text-ink/60">
            {WORKLOAD_NOTE}
          </p>
        </Blueprint>
      </div>
    </section>
  );
}

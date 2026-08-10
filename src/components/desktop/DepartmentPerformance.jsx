/* ============================================================================
   Section 02 — Department performance.

   The segmented All / At risk / On track control is the first genuinely
   stateful thing on the page, and its state is *local*: nothing outside this
   section cares which filter is on. Local state goes in the component that
   owns it — `useState` right here. Only lift it when a second component
   needs to read it.

   The filtering itself is a derived value again: `visible` is recomputed from
   `filter` on each render. There is no `visibleDepartments` state to keep in
   sync, so there is no way for it to fall out of sync.
   ========================================================================== */

import { useState } from 'react';
import { Blueprint } from '../ui/Blueprint.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { DepartmentStatusTag } from '../ui/Tag.jsx';
import { DEPARTMENTS } from '../../data/dashboardData.js';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'at-risk', label: 'At risk' },
  { id: 'on-track', label: 'On track' },
];

function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="flex border border-divider text-xs">
      {options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={[
            'cursor-pointer px-2.5 py-1',
            index > 0 ? 'border-l border-divider' : '',
            value === option.id ? 'bg-accent text-bg' : 'hover:bg-ink/5',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function DepartmentPerformance() {
  const [filter, setFilter] = useState('all');

  const visible = DEPARTMENTS.filter((department) => {
    if (filter === 'all') return true;
    // "At risk" is meant to catch everything that is not healthy.
    if (filter === 'at-risk') return department.status !== 'on-track';
    return department.status === 'on-track';
  });

  return (
    <section className="flex flex-col gap-3.5">
      <SectionHeading
        number="02"
        title="Department performance"
        action={<SegmentedControl value={filter} onChange={setFilter} options={FILTERS} />}
      />

      <Blueprint>
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="font-heading text-[11.5px] tracking-[0.12em] uppercase">
              <th className="border-b border-divider px-4 py-[11px] text-left">Department</th>
              <th className="border-b border-divider px-3 py-[11px] text-left">Status</th>
              <th className="w-[190px] border-b border-divider px-3 py-[11px] text-left">
                Progress
              </th>
              <th className="border-b border-divider px-3 py-[11px] text-right">Active</th>
              <th className="border-b border-divider px-3 py-[11px] text-right">Done</th>
              <th className="border-b border-divider px-4 py-[11px] text-right">Delayed</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((department) => (
              /* `key` is how React tracks which row is which across renders.
                 It must be stable and unique — the array index is neither
                 once rows can be filtered or reordered. */
              <tr key={department.id} className="hover:bg-ink/4">
                <td className="border-b border-ink/8 px-4 py-[13px] font-medium">
                  {department.name}
                </td>
                <td className="border-b border-ink/8 px-3 py-[13px]">
                  <DepartmentStatusTag status={department.status} />
                </td>
                <td className="border-b border-ink/8 px-3 py-[13px]">
                  <div className="flex items-center gap-[9px]">
                    <ProgressBar
                      value={department.progress}
                      tone={department.status === 'critical' ? 'critical' : 'accent'}
                    />
                    <span className="w-8 text-right font-heading text-[13px]">
                      {department.progress}%
                    </span>
                  </div>
                </td>
                <td className="tabular border-b border-ink/8 px-3 py-[13px] text-right">
                  {department.active}
                </td>
                <td className="tabular border-b border-ink/8 px-3 py-[13px] text-right">
                  {department.done}
                </td>
                <td
                  className={[
                    'tabular border-b border-ink/8 px-4 py-[13px] text-right',
                    department.delayed >= 8 ? 'font-semibold' : '',
                  ].join(' ')}
                >
                  {department.delayed}
                </td>
              </tr>
            ))}

            {/* Empty states are part of the job even when the mock has no
                room for one. A filter that matches nothing must say so. */}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-ink/55">
                  No departments match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Blueprint>
    </section>
  );
}

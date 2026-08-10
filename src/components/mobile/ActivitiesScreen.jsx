/* ============================================================================
   Mobile — Activities.

   The desktop shows activities as a table. A 390px screen cannot, so the same
   records become cards, grouped by urgency instead of sorted by column.

   Two things worth pulling out:

   • The grouping is a derivation, like every other list on this app: filter
     by chip, then bucket by urgency. No grouped copy is stored.

   • Touch targets. The design's desktop actions are 4px tall paddings; here
     they are full-width buttons with py-[11px], because a finger is not a
     mouse pointer. Recreating a design faithfully includes respecting the
     platform it was drawn for.
   ========================================================================== */

import { Fragment, useState } from 'react';
import { Blueprint } from '../ui/Blueprint.jsx';
import { Button } from '../ui/Button.jsx';
import { PriorityTag, StatusTag } from '../ui/Tag.jsx';
import { DEPARTMENTS } from '../../data/dashboardData.js';
import { useDashboard } from '../../state/DashboardContext.jsx';

const CHIPS = [
  { id: 'needs-action', label: 'Needs action' },
  { id: 'mine', label: 'Mine' },
  { id: 'all', label: 'All' },
  { id: 'done', label: 'Done' },
];

function matchesChip(activity, chipId) {
  if (chipId === 'all') return true;
  if (chipId === 'mine') return activity.isMine;
  if (chipId === 'done') return activity.status === 'completed';
  // "Needs action" = anything not finished.
  return activity.status !== 'completed';
}

function ActivityCard({ activity, onComplete, onAdvance, onView }) {
  const department = DEPARTMENTS.find((d) => d.id === activity.departmentId);
  const isOverdue = activity.daysLate > 0;
  const isDone = activity.status === 'completed';

  return (
    <Blueprint
      className={`flex flex-col gap-[9px] px-[15px] py-[13px] ${
        isOverdue ? 'border-2 border-accent-700' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <span
          className={`text-[14.5px] leading-[1.25] font-medium ${
            isDone ? 'text-ink/60 line-through' : ''
          }`}
        >
          {activity.title}
        </span>
        <PriorityTag priority={activity.priority} />
      </div>

      <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-ink/65">
        <span>{activity.owner}</span>
        <span>{department?.name}</span>
        <span className={isOverdue ? 'font-medium text-accent-800' : ''}>
          Due {activity.dueLabel}
          {isOverdue && ` · ${activity.daysLate} days late`}
        </span>
      </div>

      {/* Overdue cards get the full three-button action row; everything else
          gets the compact status + menu line. Same data, different urgency. */}
      {isOverdue ? (
        <div className="mt-0.5 flex gap-2">
          <Button size="lg" className="flex-1" onClick={() => onView(activity.id)}>
            View
          </Button>
          <Button size="lg" className="flex-1" onClick={() => onAdvance(activity.id)}>
            Update
          </Button>
          <Button
            variant="solid"
            size="lg"
            className="flex-1"
            onClick={() => onComplete(activity.id)}
          >
            Complete
          </Button>
        </div>
      ) : (
        <div className="mt-0.5 flex items-center justify-between">
          <StatusTag status={activity.status} />
          <button
            type="button"
            onClick={() => onView(activity.id)}
            className="cursor-pointer text-[12.5px] text-accent-700"
          >
            Actions ▾
          </button>
        </div>
      )}
    </Blueprint>
  );
}

function GroupLabel({ children, className = '' }) {
  return (
    <div
      className={`font-heading text-[11.5px] tracking-[0.16em] uppercase text-ink/55 ${className}`}
    >
      {children}
    </div>
  );
}

export function ActivitiesScreen() {
  const { activities, dispatch } = useDashboard();
  const [chip, setChip] = useState('needs-action');
  const [visibleCount, setVisibleCount] = useState(20);

  const filtered = activities.filter((activity) => matchesChip(activity, chip));

  const overdue = filtered.filter((a) => a.daysLate > 0);
  const upcoming = filtered.filter((a) => a.daysLate === 0 && a.status !== 'completed');
  const done = filtered.filter((a) => a.status === 'completed');

  const handlers = {
    onComplete: (id) => dispatch({ type: 'activity/complete', id }),
    onAdvance: (id) => dispatch({ type: 'activity/advance', id }),
    onView: (id) => dispatch({ type: 'dialog/openActivity', id }),
  };

  const groups = [
    { key: 'overdue', label: 'Overdue', items: overdue },
    { key: 'upcoming', label: 'Due this week', items: upcoming },
    { key: 'done', label: 'Completed', items: done },
  ].filter((group) => group.items.length > 0);

  return (
    <>
      {/* ---- filter chips ---- */}
      <div className="flex gap-2 overflow-x-auto border-b border-divider px-4 py-3">
        {CHIPS.map((option) => {
          const count = activities.filter((a) => matchesChip(a, option.id)).length;
          const isActive = option.id === chip;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setChip(option.id)}
              aria-pressed={isActive}
              className={[
                'cursor-pointer px-[11px] py-[5px] text-xs whitespace-nowrap',
                isActive ? 'bg-accent text-bg' : 'border border-divider',
              ].join(' ')}
            >
              {option.label} {option.id === 'done' ? '' : count}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        {groups.map((group, index) => (
          /* A Fragment groups siblings without adding a DOM node. The <>…</>
             shorthand cannot take a key, so when the group is keyed you need
             the long form. */
          <Fragment key={group.key}>
            <GroupLabel className={index > 0 ? 'mt-1' : ''}>
              {group.label} · {group.items.length}
            </GroupLabel>

            {group.items.slice(0, visibleCount).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} {...handlers} />
            ))}
          </Fragment>
        ))}

        {groups.length === 0 && (
          <Blueprint className="px-4 py-10 text-center text-[13px] text-ink/55">
            Nothing in this filter.
          </Blueprint>
        )}

        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + 20)}
          className="flex cursor-pointer items-center justify-center gap-2 border border-divider py-[11px] text-[13px] text-ink/70 hover:bg-ink/5"
        >
          Load 20 more
        </button>
      </div>
    </>
  );
}

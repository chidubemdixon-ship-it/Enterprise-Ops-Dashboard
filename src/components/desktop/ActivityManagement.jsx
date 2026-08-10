/* ============================================================================
   Section 03 — Activity management. The busiest component in the app.

   It is worth reading top to bottom as a worked example of the order these
   things go in:

     1. read shared state from context
     2. read/receive filter state
     3. derive the filtered list      (useMemo)
     4. derive the current page from the filtered list
     5. reset the page when the filters change   (useEffect)
     6. render, and dispatch on interaction

   Steps 3 and 4 are recomputed on every render on purpose. There is no
   `filteredActivities` state to update, so there is nothing to forget to
   update. The only genuine state here is the filters, the page and the
   selection.
   ========================================================================== */

import { useEffect, useMemo, useState } from 'react';
import { Blueprint } from '../ui/Blueprint.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Button } from '../ui/Button.jsx';
import { PriorityTag, StatusTag } from '../ui/Tag.jsx';
import { NewActivityDialog } from './NewActivityDialog.jsx';
import {
  ACTIVITY_STATUS_LABELS,
  DEPARTMENTS,
  PRIORITY_LABELS,
  SUMMARY,
} from '../../data/dashboardData.js';
import { useDashboard } from '../../state/DashboardContext.jsx';

const PAGE_SIZE = 6;

const SELECT =
  'cursor-pointer border border-divider bg-transparent px-2.5 py-[5px] text-[12.5px] outline-none hover:bg-ink/5 focus:border-accent';

/* A checkbox styled as the design's hollow square. `appearance-none` strips
   the browser's own control so the box can be drawn from scratch, while it
   stays a real <input type="checkbox"> for the keyboard and screen readers. */
function CheckBox({ checked, indeterminate = false, onChange, label }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      aria-label={label}
      ref={(node) => {
        // `indeterminate` is a DOM property with no HTML attribute, so it can
        // only be set imperatively — one of the few legitimate uses of a ref
        // callback on a form control.
        if (node) node.indeterminate = indeterminate && !checked;
      }}
      onChange={onChange}
      className="h-[13px] w-[13px] cursor-pointer appearance-none border border-neutral-500 bg-transparent checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent/40"
    />
  );
}

export function ActivityManagement({ statusFilter, onStatusFilterChange }) {
  const { activities, selectedActivityIds, dispatch } = useDashboard();

  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  /* ---- 3. derive the filtered list ---------------------------------- */
  const filtered = useMemo(() => {
    return activities.filter((activity) => {
      if (departmentFilter !== 'all' && activity.departmentId !== departmentFilter) return false;
      if (priorityFilter !== 'all' && activity.priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && activity.status !== statusFilter) return false;
      return true;
    });
  }, [activities, departmentFilter, priorityFilter, statusFilter]);

  /* ---- 4. derive the current page ------------------------------------ */
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  /* ---- 5. keep the page honest when filters change -------------------- */
  useEffect(() => {
    setPage(1);
  }, [departmentFilter, priorityFilter, statusFilter]);

  /* ---- selection ------------------------------------------------------ */
  const visibleIds = visible.map((a) => a.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedActivityIds.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selectedActivityIds.includes(id));

  const toggleAll = () =>
    dispatch({ type: 'selection/set', ids: allVisibleSelected ? [] : visibleIds });

  return (
    <section className="flex flex-col gap-3.5">
      <SectionHeading
        number="03"
        title="Activity management"
        note={`${SUMMARY.activeCount} active · showing ${visible.length}`}
        alignClass="items-center"
        action={
          <div className="flex items-center gap-2 text-[12.5px]">
            <select
              className={SELECT}
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              aria-label="Filter by department"
            >
              <option value="all">Department</option>
              {DEPARTMENTS.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>

            <select
              className={SELECT}
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">Priority</option>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              className={SELECT}
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">Status</option>
              {Object.entries(ACTIVITY_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <Button variant="solid" size="sm" onClick={() => setIsCreating(true)}>
              + New activity
            </Button>
          </div>
        }
      />

      {/* The bulk bar exists only while something is selected. */}
      {selectedActivityIds.length > 0 && (
        <div className="flex items-center gap-3 border border-accent-700 bg-accent-100 px-4 py-2 text-[13px]">
          <span className="font-medium">{selectedActivityIds.length} selected</span>
          <Button
            variant="accent"
            size="xs"
            onClick={() => dispatch({ type: 'selection/completeSelected' })}
          >
            Complete selected
          </Button>
          <Button size="xs" onClick={() => dispatch({ type: 'selection/set', ids: [] })}>
            Clear
          </Button>
        </div>
      )}

      <Blueprint>
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="font-heading text-[11.5px] tracking-[0.12em] uppercase">
              <th className="w-[30px] border-b border-divider px-4 py-[11px] text-left">
                <CheckBox
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected}
                  onChange={toggleAll}
                  label="Select all rows on this page"
                />
              </th>
              <th className="border-b border-divider px-2 py-[11px] text-left">Activity</th>
              <th className="border-b border-divider px-3 py-[11px] text-left">Owner</th>
              <th className="border-b border-divider px-3 py-[11px] text-left">Department</th>
              <th className="border-b border-divider px-3 py-[11px] text-left">Priority</th>
              <th className="border-b border-divider px-3 py-[11px] text-left">Status</th>
              <th className="border-b border-divider px-3 py-[11px] text-left">Due</th>
              <th className="w-[190px] border-b border-divider px-4 py-[11px] text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {visible.map((activity) => {
              const isDone = activity.status === 'completed';
              const department = DEPARTMENTS.find((d) => d.id === activity.departmentId);
              const mutedIfDone = isDone ? 'text-ink/60' : '';

              return (
                <tr key={activity.id} className="hover:bg-ink/4">
                  <td className="border-b border-ink/8 px-4 py-3">
                    <CheckBox
                      checked={selectedActivityIds.includes(activity.id)}
                      onChange={() => dispatch({ type: 'selection/toggle', id: activity.id })}
                      label={`Select ${activity.title}`}
                    />
                  </td>

                  <td
                    className={`border-b border-ink/8 px-2 py-3 font-medium ${mutedIfDone} ${
                      isDone ? 'line-through' : ''
                    }`}
                  >
                    {activity.title}
                  </td>

                  <td className={`border-b border-ink/8 px-3 py-3 ${mutedIfDone}`}>
                    {activity.owner}
                  </td>
                  <td className={`border-b border-ink/8 px-3 py-3 ${mutedIfDone}`}>
                    {department?.name}
                  </td>

                  <td className="border-b border-ink/8 px-3 py-3">
                    <PriorityTag priority={activity.priority} />
                  </td>
                  <td className="border-b border-ink/8 px-3 py-3">
                    <StatusTag status={activity.status} />
                  </td>

                  <td
                    className={`border-b border-ink/8 px-3 py-3 ${
                      activity.daysLate > 0 ? 'font-medium text-accent-800' : mutedIfDone
                    }`}
                  >
                    {activity.dueLabel}
                    {activity.daysLate > 0 && ` · +${activity.daysLate}d`}
                  </td>

                  <td className="border-b border-ink/8 px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="xs"
                        onClick={() => dispatch({ type: 'dialog/openActivity', id: activity.id })}
                      >
                        View
                      </Button>
                      <Button
                        size="xs"
                        disabled={isDone}
                        onClick={() => dispatch({ type: 'activity/advance', id: activity.id })}
                      >
                        Update
                      </Button>
                      <Button
                        variant="accent"
                        size="xs"
                        disabled={isDone}
                        onClick={() => dispatch({ type: 'activity/complete', id: activity.id })}
                      >
                        Complete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-ink/55">
                  No activities match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-divider px-4 py-[11px] text-[12.5px] text-ink/62">
          <span>
            {filtered.length === 0
              ? 'No rows'
              : `Rows ${start + 1}–${start + visible.length} of ${filtered.length}`}{' '}
            · virtualised list, filters persist per saved view
          </span>

          <div className="flex gap-1.5">
            <Button size="xs" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
              Prev
            </Button>

            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                size="xs"
                variant={pageNumber === safePage ? 'accent' : 'outline'}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}

            <Button
              size="xs"
              disabled={safePage === pageCount}
              onClick={() => setPage(safePage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Blueprint>

      {isCreating && (
        <NewActivityDialog
          onClose={() => setIsCreating(false)}
          onCreate={(payload) => dispatch({ type: 'activity/add', payload })}
        />
      )}
    </section>
  );
}

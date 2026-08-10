/* ============================================================================
   <ActivityDetailDialog> — the "View" panel.

   The dialog is not handed an activity object. It is handed an *id*, and
   looks the activity up in context itself. That matters: if the row behind
   the dialog is completed while the dialog is open, this re-reads the updated
   record instead of showing a stale copy captured when it opened.

   Storing an id and deriving the object is almost always better than storing
   a duplicate of the object.
   ========================================================================== */

import { Dialog } from '../ui/Dialog.jsx';
import { Button } from '../ui/Button.jsx';
import { PriorityTag, StatusTag } from '../ui/Tag.jsx';
import { DEPARTMENTS } from '../../data/dashboardData.js';
import { useDashboard } from '../../state/DashboardContext.jsx';

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-divider py-2 last:border-b-0">
      <span className="text-xs tracking-[0.06em] uppercase text-ink/55">{label}</span>
      <span className="text-[13.5px]">{children}</span>
    </div>
  );
}

export function ActivityDetailDialog({ activityId, onClose }) {
  const { activities, dispatch } = useDashboard();

  const activity = activities.find((item) => item.id === activityId);

  /* Early return: if the activity was deleted while the dialog was open there
     is nothing to show. Returning null renders nothing at all. */
  if (!activity) return null;

  const department = DEPARTMENTS.find((d) => d.id === activity.departmentId);
  const isDone = activity.status === 'completed';

  return (
    <Dialog title="Activity detail" onClose={onClose}>
      <p className="text-[15px] font-medium">{activity.title}</p>

      <div className="flex flex-col">
        <Row label="Owner">{activity.owner}</Row>
        <Row label="Department">{department?.name ?? '—'}</Row>
        <Row label="Priority">
          <PriorityTag priority={activity.priority} />
        </Row>
        <Row label="Status">
          <StatusTag status={activity.status} />
        </Row>
        <Row label="Due">
          {activity.dueLabel}
          {activity.daysLate > 0 && (
            <span className="ml-2 font-medium text-accent-800">
              +{activity.daysLate}d late
            </span>
          )}
        </Row>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button size="md" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="solid"
          size="md"
          disabled={isDone}
          onClick={() => {
            dispatch({ type: 'activity/complete', id: activity.id });
            onClose();
          }}
        >
          {isDone ? 'Completed' : 'Mark complete'}
        </Button>
      </div>
    </Dialog>
  );
}

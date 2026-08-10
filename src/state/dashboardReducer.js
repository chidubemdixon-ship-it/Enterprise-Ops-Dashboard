/* ============================================================================
   The reducer — the single place where dashboard state is allowed to change.

   A reducer is a pure function: (currentState, action) => nextState. It never
   mutates what it is handed, it returns a new object. That is what lets React
   detect the change by identity and re-render.

   Everything interactive in the app (completing an activity, dismissing an
   alert, adding a new activity) funnels through here, so you can read the
   whole set of possible state transitions in one screen.
   ========================================================================== */

import { ACTIVITIES, NOTIFICATIONS } from '../data/dashboardData.js';

export const initialDashboardState = {
  activities: ACTIVITIES,
  notifications: NOTIFICATIONS,
  selectedActivityIds: [],
  /* Which activity id is open in the detail dialog, or null for "closed". */
  openActivityId: null,
};

let nextId = 200;

export function dashboardReducer(state, action) {
  switch (action.type) {
    /* ---- activities ---- */

    case 'activity/complete': {
      return {
        ...state,
        activities: state.activities.map((activity) =>
          activity.id === action.id
            ? { ...activity, status: 'completed', daysLate: 0 }
            : activity,
        ),
      };
    }

    case 'activity/advance': {
      // "Update" moves an activity one step along its lifecycle.
      const next = { delayed: 'in-progress', 'in-progress': 'in-review', 'in-review': 'completed' };
      return {
        ...state,
        activities: state.activities.map((activity) =>
          activity.id === action.id && next[activity.status]
            ? { ...activity, status: next[activity.status] }
            : activity,
        ),
      };
    }

    case 'activity/add': {
      const activity = {
        id: `a-${nextId++}`,
        title: action.payload.title,
        owner: action.payload.owner,
        departmentId: action.payload.departmentId,
        priority: action.payload.priority,
        status: 'in-progress',
        dueDate: action.payload.dueDate,
        dueLabel: formatDueLabel(action.payload.dueDate),
        daysLate: 0,
      };
      return { ...state, activities: [activity, ...state.activities] };
    }

    /* ---- row selection ---- */

    case 'selection/toggle': {
      const isSelected = state.selectedActivityIds.includes(action.id);
      return {
        ...state,
        selectedActivityIds: isSelected
          ? state.selectedActivityIds.filter((id) => id !== action.id)
          : [...state.selectedActivityIds, action.id],
      };
    }

    case 'selection/set': {
      // Used by the header checkbox: select exactly these ids, or none.
      return { ...state, selectedActivityIds: action.ids };
    }

    case 'selection/completeSelected': {
      const selected = new Set(state.selectedActivityIds);
      return {
        ...state,
        activities: state.activities.map((activity) =>
          selected.has(activity.id)
            ? { ...activity, status: 'completed', daysLate: 0 }
            : activity,
        ),
        selectedActivityIds: [],
      };
    }

    /* ---- notifications ---- */

    case 'notifications/markAllRead': {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, unread: false })),
      };
    }

    case 'notifications/dismiss': {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    }

    case 'notifications/read': {
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, unread: false } : n,
        ),
      };
    }

    /* ---- dialog ---- */

    case 'dialog/openActivity':
      return { ...state, openActivityId: action.id };

    case 'dialog/close':
      return { ...state, openActivityId: null };

    default:
      // Loudly refusing an unknown action beats silently doing nothing.
      throw new Error(`dashboardReducer: unknown action type "${action.type}"`);
  }
}

function formatDueLabel(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const month = date.toLocaleString('en-GB', { month: 'short' });
  return `${date.getDate()} ${month}`;
}

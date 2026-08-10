/* ============================================================================
   Context — how state written by the reducer reaches components that need it.

   The desktop table, the notification panel and the mobile activity list all
   read and write the same activities. Threading `activities` and `dispatch`
   down through five layers of props ("prop drilling") would mean every
   intermediate component carries data it does not use. Context lets any
   descendant read it directly.

   The pattern here is the standard one:
     1. create a context object
     2. export a provider component that owns the state
     3. export a hook that reads it and throws a useful error when misused
   Components only ever touch step 3.
   ========================================================================== */

import { createContext, useContext, useMemo, useReducer } from 'react';
import { dashboardReducer, initialDashboardState } from './dashboardReducer.js';
import { NOTIFICATIONS, SUMMARY } from '../data/dashboardData.js';

const DashboardContext = createContext(null);

/* The notification list is a *slice* of a larger feed: the design shows five
   rows but reports eight open alerts. So the headline number is the dataset
   total adjusted by what has been read or dismissed here, rather than a count
   of the visible rows. Deriving it once, in one place, is what stops the bell
   badge and the alerts tile from disagreeing. */
const SEED_UNREAD = NOTIFICATIONS.filter((n) => n.unread).length;

function selectAlertCount(notifications) {
  const unread = notifications.filter((n) => n.unread).length;
  return Math.max(0, SUMMARY.alertCount - (SEED_UNREAD - unread));
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  /* useMemo keeps the context *value* stable between renders. Without it the
     object literal would be brand new on every render, and every consumer
     would re-render even when nothing it cares about changed. `dispatch` is
     guaranteed stable by React, so the only real dependency is `state`. */
  const value = useMemo(
    () => ({
      ...state,
      alertCount: selectAlertCount(state.notifications),
      dispatch,
    }),
    [state],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === null) {
    throw new Error('useDashboard must be used inside a <DashboardProvider>');
  }
  return context;
}

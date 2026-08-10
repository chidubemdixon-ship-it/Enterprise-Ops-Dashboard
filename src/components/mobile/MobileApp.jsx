/* ============================================================================
   <MobileApp> — frame 1b, assembled.

   The mobile frame has no router. Which screen is showing is one piece of
   state — `activeTab` — and the body is chosen by conditional rendering.
   Only the matching screen is created; the other three do not exist in the
   tree at all, so their state resets when you navigate away. That is usually
   what you want for tabs, and it is worth knowing it is the behaviour you are
   choosing.

   The header shape is picked from a lookup object instead, because it is data
   (a variant plus a title) rather than a subtree.

   When the app grows past four screens, this is the seam where a real router
   (React Router, TanStack Router) slots in without touching the screens.
   ========================================================================== */

import { useState } from 'react';
import { MobileHeader, StatusBar, TabBar } from './MobileChrome.jsx';
import { OverviewScreen } from './OverviewScreen.jsx';
import { ActivitiesScreen } from './ActivitiesScreen.jsx';
import { ActivityDetailDialog } from '../desktop/ActivityDetailDialog.jsx';
import { Blueprint } from '../ui/Blueprint.jsx';
import { NOTIFICATION_ICONS } from '../ui/Icons.jsx';
import { TrendChart, TREND_MOBILE } from '../charts/TrendChart.jsx';
import { COMPLETION_TREND } from '../../data/dashboardData.js';
import { useDashboard } from '../../state/DashboardContext.jsx';

/* The design only draws Overview and Activities. Insights and Alerts get
   honest minimal screens rather than dead tabs — a tab that does nothing is
   a bug, not a design. */
function InsightsScreen() {
  return (
    <div className="flex flex-col gap-2.5 p-4">
      <h3 className="text-[16px] tracking-[0.1em] uppercase">Completion trend</h3>
      <Blueprint className="px-3.5 py-3">
        <TrendChart series={COMPLETION_TREND} geometry={TREND_MOBILE} />
      </Blueprint>
      <p className="text-xs text-ink/55">
        Rolling 12 weeks. Solid line completed, dashed line delayed.
      </p>
    </div>
  );
}

function AlertsScreen() {
  const { notifications, dispatch } = useDashboard();

  return (
    <div className="flex flex-col gap-2.5 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[16px] tracking-[0.1em] uppercase">Alerts</h3>
        <button
          type="button"
          onClick={() => dispatch({ type: 'notifications/markAllRead' })}
          className="cursor-pointer text-xs text-accent-700"
        >
          Mark all read
        </button>
      </div>

      {notifications.map((notification) => {
        const Icon = NOTIFICATION_ICONS[notification.kind];
        return (
          <Blueprint
            key={notification.id}
            className={`flex gap-2.5 px-3.5 py-3 ${notification.unread ? 'bg-accent-200' : ''}`}
          >
            <Icon size={16} className="mt-0.5 flex-none" />
            <div className="flex flex-col gap-[3px]">
              <div className="text-[13.5px] font-medium">{notification.title}</div>
              <div className="text-xs text-ink/65">{notification.meta}</div>
            </div>
            <span className="ml-auto text-[11.5px] text-ink/55">{notification.time}</span>
          </Blueprint>
        );
      })}

      {notifications.length === 0 && (
        <Blueprint className="px-4 py-10 text-center text-[13px] text-ink/55">
          No alerts.
        </Blueprint>
      )}
    </div>
  );
}

const HEADERS = {
  overview: { variant: 'brand' },
  activities: { variant: 'title', title: 'Activities' },
  insights: { variant: 'title', title: 'Insights' },
  alerts: { variant: 'title', title: 'Alerts' },
};

export function MobileApp() {
  const { alertCount, openActivityId, dispatch } = useDashboard();
  const [activeTab, setActiveTab] = useState('overview');

  const header = HEADERS[activeTab];

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg">
      <StatusBar />

      <MobileHeader
        variant={header.variant}
        title={header.title}
        alertCount={alertCount}
        onBack={() => setActiveTab('overview')}
      />

      {/* pb-20 keeps the last card clear of the fixed tab bar. */}
      <main className="flex-1 pb-20">
        {activeTab === 'overview' && (
          <OverviewScreen
            onSeeAllAlerts={() => setActiveTab('alerts')}
            onOpenActivities={() => setActiveTab('activities')}
          />
        )}
        {activeTab === 'activities' && <ActivitiesScreen />}
        {activeTab === 'insights' && <InsightsScreen />}
        {activeTab === 'alerts' && <AlertsScreen />}
      </main>

      <div className="sticky bottom-0">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {openActivityId && (
        <ActivityDetailDialog
          activityId={openActivityId}
          onClose={() => dispatch({ type: 'dialog/close' })}
        />
      )}
    </div>
  );
}

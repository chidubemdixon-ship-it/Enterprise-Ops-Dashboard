/* ============================================================================
   Section 04 — Notifications.

   Two kinds of state meet here, and telling them apart is the point:

   • Which tab is open is *view* state — nobody else needs it, it dies with
     the component, so it is `useState` right here.

   • Whether a notification is unread is *application* state — the bell in the
     top nav counts it, so it lives in the reducer and is reached through
     `useDashboard()`. Dismissing a row dispatches an action rather than
     setting local state.

   Put a piece of state in the wrong one of those two places and you get the
   classic bug where the badge says 8 and the list shows 5.
   ========================================================================== */

import { useState } from 'react';
import { Blueprint } from '../ui/Blueprint.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { NOTIFICATION_ICONS } from '../ui/Icons.jsx';
import { Button } from '../ui/Button.jsx';
import { useDashboard } from '../../state/DashboardContext.jsx';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'escalation', label: 'Escalations' },
  { id: 'approval', label: 'Approvals' },
];

function NotificationRow({ notification, onDismiss, onAssign }) {
  const Icon = NOTIFICATION_ICONS[notification.kind];
  const isHighlighted = notification.kind === 'alert' && notification.unread;

  return (
    <li
      className={[
        'flex gap-[11px] border-b border-divider px-[15px] py-[13px] last:border-b-0',
        isHighlighted ? 'bg-accent-200' : '',
      ].join(' ')}
    >
      <Icon
        size={17}
        className={`mt-0.5 flex-none ${isHighlighted ? 'text-accent-800' : ''}`}
      />

      <div className="flex flex-col gap-[3px]">
        <div className="text-[13.5px] font-medium">{notification.title}</div>
        <div className="text-[12.5px] text-ink/65">{notification.meta}</div>

        {notification.actions && (
          <div className="mt-1 flex gap-2">
            <Button variant="accent" size="xs" onClick={() => onAssign(notification.id)}>
              Assign
            </Button>
            <Button size="xs" onClick={() => onDismiss(notification.id)}>
              Dismiss
            </Button>
          </div>
        )}
      </div>

      <span className="ml-auto text-[11.5px] whitespace-nowrap text-ink/55">
        {notification.time}
      </span>
    </li>
  );
}

export function NotificationsPanel() {
  const { notifications, dispatch } = useDashboard();
  const [activeTab, setActiveTab] = useState('all');

  const countFor = (tabId) =>
    tabId === 'all'
      ? notifications.length
      : notifications.filter((n) => n.category === tabId).length;

  const visible =
    activeTab === 'all'
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  return (
    <section className="flex flex-col gap-3.5">
      <SectionHeading
        number="04"
        title="Notifications"
        action={
          <button
            type="button"
            onClick={() => dispatch({ type: 'notifications/markAllRead' })}
            className="cursor-pointer text-[12.5px] text-accent-700 hover:underline"
          >
            Mark all read
          </button>
        }
      />

      <Blueprint className="flex flex-col">
        <div className="flex border-b border-divider text-xs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? 'cursor-pointer border-b-2 border-accent px-3 py-[9px] font-medium'
                  : 'cursor-pointer border-b-2 border-transparent px-3 py-[9px] text-ink/60 hover:text-ink'
              }
            >
              {tab.label} {countFor(tab.id)}
            </button>
          ))}
        </div>

        <ul className="flex flex-col">
          {visible.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onDismiss={(id) => dispatch({ type: 'notifications/dismiss', id })}
              onAssign={(id) => dispatch({ type: 'notifications/read', id })}
            />
          ))}

          {visible.length === 0 && (
            <li className="px-[15px] py-10 text-center text-[13px] text-ink/55">
              Nothing here. Inbox zero.
            </li>
          )}
        </ul>
      </Blueprint>
    </section>
  );
}

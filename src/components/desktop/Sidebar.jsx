/* ============================================================================
   <Sidebar>.

   The nine nav rows in the design differ only in icon, label and trailing
   badge — so they are data, not markup. `NAV_GROUPS` below describes them,
   and one <NavItem> renders any of them.

   That is the single highest-value habit when converting a design: look for
   the repeat, describe it as an array, and render it with .map(). Adding a
   tenth item then means adding an object, not copying a div.
   ========================================================================== */

import {
  BarsIcon,
  ChevronDownIcon,
  ClockWorkloadIcon,
  GridIcon,
  ListIcon,
  TrendIcon,
  WarningIcon,
} from '../ui/Icons.jsx';
import { Kicker } from '../ui/SectionHeading.jsx';
import { SAVED_VIEW } from '../../data/dashboardData.js';

const NAV_GROUPS = [
  {
    label: 'Monitor',
    items: [
      { id: 'summary', label: 'Executive summary', icon: GridIcon },
      { id: 'departments', label: 'Departments', icon: BarsIcon },
      { id: 'activities', label: 'Activities', icon: ListIcon, badge: 'count' },
      { id: 'alerts', label: 'Alerts', icon: WarningIcon, badge: 'alert' },
    ],
  },
  {
    label: 'Analyse',
    items: [
      { id: 'performance', label: 'Performance', icon: TrendIcon },
      { id: 'workload', label: 'Workload', icon: ClockWorkloadIcon },
    ],
  },
];

function NavItem({ item, isActive, badgeValue, onSelect }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-current={isActive ? 'true' : undefined}
      className={
        isActive
          ? 'flex w-full cursor-pointer items-center gap-[9px] border-l-2 border-accent bg-accent-200 px-[9px] py-[7px] text-left text-[13.5px] font-medium'
          : 'flex w-full cursor-pointer items-center gap-[9px] border-l-2 border-transparent px-[9px] py-[7px] text-left text-[13.5px] text-ink/72 hover:bg-ink/5'
      }
    >
      <Icon size={15} className="shrink-0" />
      {item.label}

      {item.badge === 'count' && (
        <span className="ml-auto border border-divider px-[5px] py-px text-[11px]">
          {badgeValue}
        </span>
      )}
      {item.badge === 'alert' && (
        <span className="ml-auto bg-accent-900 px-[5px] py-px text-[11px] text-bg">
          {badgeValue}
        </span>
      )}
    </button>
  );
}

export function Sidebar({ activeSection, onSelect, activityCount, alertCount }) {
  return (
    <aside className="flex w-[210px] flex-none flex-col gap-[26px] border-r border-divider px-4 py-[22px]">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-[3px]">
          <Kicker className="mb-1.5">{group.label}</Kicker>

          {group.items.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={item.id === activeSection}
              badgeValue={item.badge === 'alert' ? alertCount : activityCount}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}

      <div className="mt-auto border-t border-divider pt-5">
        <Kicker className="mb-2">Saved view</Kicker>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between border border-divider px-[9px] py-[7px] text-[13px] hover:bg-ink/5"
        >
          <span>{SAVED_VIEW}</span>
          <ChevronDownIcon size={14} />
        </button>
      </div>
    </aside>
  );
}

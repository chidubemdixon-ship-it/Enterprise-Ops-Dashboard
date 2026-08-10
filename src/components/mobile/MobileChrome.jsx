/* ============================================================================
   The mobile chrome: status bar, header and bottom tab bar.

   Three small components in one file because they are only ever used
   together, by one screen shell. Splitting every component into its own file
   is a habit, not a rule — group by what changes together.
   ========================================================================== */

import {
  BellIcon,
  ChevronLeftIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  LogoMark,
  SearchIcon,
  TrendIcon,
  WarningIcon,
} from '../ui/Icons.jsx';
import { CURRENT_USER } from '../../data/dashboardData.js';

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-1 text-[11.5px] text-ink/65">
      <span>9:41</span>
      <span>▮▮▮ ⌁ ▮</span>
    </div>
  );
}

/* The header has two forms. Rather than two components with duplicated
   padding and borders, one component branches on `variant` — the shared shell
   is written once. */
export function MobileHeader({ variant, title, alertCount, onBack }) {
  return (
    <div className="flex items-center justify-between border-b border-divider px-4 pt-2 pb-3">
      {variant === 'brand' ? (
        <>
          <div className="flex items-center gap-2">
            <LogoMark size={18} className="text-accent" />
            <span className="font-heading text-[17px] tracking-[0.12em] uppercase">
              Opscontrol
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <BellIcon size={18} />
              {alertCount > 0 && (
                <span className="absolute -top-[5px] -right-1.5 bg-accent-900 px-[3.5px] py-[2.5px] text-[9.5px] leading-none text-bg">
                  {alertCount}
                </span>
              )}
            </div>
            <div className="flex h-[26px] w-[26px] items-center justify-center bg-accent-800 font-heading text-[11px] text-bg">
              {CURRENT_USER.initials}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-[9px]">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to overview"
              className="cursor-pointer"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <span className="font-heading text-[19px] tracking-[0.09em] uppercase">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            <SearchIcon size={17} />
            <FilterIcon size={17} />
          </div>
        </>
      )}
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: GridIcon },
  { id: 'activities', label: 'Activities', icon: ListIcon },
  { id: 'insights', label: 'Insights', icon: TrendIcon },
  { id: 'alerts', label: 'Alerts', icon: WarningIcon },
];

export function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="flex justify-around border-t border-divider bg-bg pt-[9px] pb-3.5">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'flex min-w-14 cursor-pointer flex-col items-center gap-1',
              isActive ? 'text-accent-800' : 'text-ink/60',
            ].join(' ')}
          >
            <Icon size={19} />
            <span className="text-[10.5px] tracking-[0.05em]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ============================================================================
   <TopNav>.

   Notice what this component does NOT own: which tab is active. That lives in
   the parent, and arrives here as `activeTab` plus an `onTabChange` callback.

   This is "lifting state up". The sidebar also needs to know the current
   section, so the state has to live at the lowest common ancestor of everyone
   who cares. A child changes it by calling a function its parent gave it —
   data flows down as props, events flow back up as callbacks.
   ========================================================================== */

import { BellIcon, CalendarIcon, LogoMark, SearchIcon } from '../ui/Icons.jsx';
import { CURRENT_USER } from '../../data/dashboardData.js';

const TABS = ['Overview', 'Departments', 'Activities', 'Reports'];

export function TopNav({ activeTab, onTabChange, alertCount, onBellClick }) {
  return (
    <header className="flex h-[58px] items-center justify-between border-b border-divider px-7">
      <div className="flex items-center gap-7">
        <div className="flex items-center gap-[9px]">
          <LogoMark size={20} className="text-accent" />
          <span className="font-heading text-[19px] tracking-[0.12em] uppercase">Opscontrol</span>
        </div>

        <nav className="flex gap-[22px] text-[13.5px] tracking-[0.03em]">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'cursor-pointer border-b-2 border-accent py-1 font-medium'
                    : 'cursor-pointer border-b-2 border-transparent py-1 text-ink/60 hover:text-ink'
                }
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex w-[230px] items-center gap-2 border border-divider px-[10px] py-1.5 text-[13px] focus-within:border-accent">
          <SearchIcon size={15} className="shrink-0 text-ink/50" />
          <input
            type="search"
            placeholder="Search activities, owners…"
            className="w-full bg-transparent outline-none placeholder:text-ink/50"
          />
        </label>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-[7px] border border-divider px-[10px] py-1.5 text-[13px] hover:bg-ink/5"
        >
          <CalendarIcon size={15} />
          <span>Last 30 days</span>
        </button>

        <button
          type="button"
          onClick={onBellClick}
          aria-label={`${alertCount} unread notifications`}
          className="relative flex h-[34px] w-[34px] cursor-pointer items-center justify-center border border-divider hover:bg-ink/5"
        >
          <BellIcon size={16} />
          {alertCount > 0 && (
            <span className="absolute -top-[5px] -right-[5px] bg-accent-900 px-1 py-[3px] text-[10px] leading-none text-bg">
              {alertCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 border-l border-divider pl-3">
          <div className="flex h-[30px] w-[30px] items-center justify-center bg-accent-800 font-heading text-[13px] tracking-[0.06em] text-bg">
            {CURRENT_USER.initials}
          </div>
          <div className="leading-[1.15]">
            <div className="text-[13px] font-medium">{CURRENT_USER.name}</div>
            <div className="text-[11px] text-ink/55">{CURRENT_USER.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

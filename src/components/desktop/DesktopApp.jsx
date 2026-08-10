/* ============================================================================
   <DesktopApp> — frame 1a, assembled.

   This is the composition root for the desktop layout, and it holds exactly
   the state that more than one child needs:

     • activeTab / activeSection — the nav and the sidebar both read it
     • statusFilter — set by the summary tiles, read by the activity table

   Everything else stayed local to the section that owns it. A component that
   holds only shared state, and passes the rest down, is the shape you are
   aiming for: the sections stay independently readable.
   ========================================================================== */

import { useRef, useState } from 'react';
import { TopNav } from './TopNav.jsx';
import { Sidebar } from './Sidebar.jsx';
import { ExecutiveSummary } from './ExecutiveSummary.jsx';
import { DepartmentPerformance } from './DepartmentPerformance.jsx';
import { NotificationsPanel } from './NotificationsPanel.jsx';
import { PerformanceSection } from './PerformanceSection.jsx';
import { ActivityManagement } from './ActivityManagement.jsx';
import { ActivityDetailDialog } from './ActivityDetailDialog.jsx';
import { SUMMARY } from '../../data/dashboardData.js';
import { useDashboard } from '../../state/DashboardContext.jsx';

export function DesktopApp() {
  const { alertCount, openActivityId, dispatch } = useDashboard();

  const [activeTab, setActiveTab] = useState('Overview');
  const [activeSection, setActiveSection] = useState('summary');
  const [statusFilter, setStatusFilter] = useState('all');

  /* A ref holding a plain object as a mutable scratchpad — here, a map of
     section id → DOM node, so the sidebar can scroll to a section. Changing
     `.current` never triggers a render, which is exactly what you want for
     something that is not displayed. */
  const sectionRefs = useRef({});

  const registerSection = (id) => (node) => {
    sectionRefs.current[id] = node;
  };

  const goToSection = (id) => {
    setActiveSection(id);
    // Two sidebar entries point at the same section on this screen.
    const target = id === 'workload' ? 'performance' : id;
    sectionRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCount={alertCount}
        onBellClick={() => goToSection('alerts')}
      />

      <div className="flex flex-1 items-stretch">
        <Sidebar
          activeSection={activeSection}
          onSelect={goToSection}
          activityCount={SUMMARY.activeCount}
          alertCount={alertCount}
        />

        <main className="flex min-w-0 flex-1 flex-col gap-[26px] px-7 pt-6 pb-[34px]">
          <div ref={registerSection('summary')} className="scroll-mt-6">
            <ExecutiveSummary
              onOpenDelayed={() => {
                setStatusFilter('delayed');
                goToSection('activities');
              }}
              onOpenAlerts={() => goToSection('alerts')}
            />
          </div>

          {/* Sections 02 and 04 share a row in the design: a 1.55 / 1 split. */}
          <div className="grid grid-cols-[1.55fr_1fr] items-start gap-[22px]">
            <div ref={registerSection('departments')} className="scroll-mt-6">
              <DepartmentPerformance />
            </div>
            <div ref={registerSection('alerts')} className="scroll-mt-6">
              <NotificationsPanel />
            </div>
          </div>

          <div ref={registerSection('performance')} className="scroll-mt-6">
            <PerformanceSection />
          </div>

          <div ref={registerSection('activities')} className="scroll-mt-6">
            <ActivityManagement
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </main>
      </div>

      {/* One dialog for the whole screen, driven by an id in the reducer.
          Rendering it here rather than inside the table row means it is not
          unmounted when the row it describes is filtered away. */}
      {openActivityId && (
        <ActivityDetailDialog
          activityId={openActivityId}
          onClose={() => dispatch({ type: 'dialog/close' })}
        />
      )}
    </div>
  );
}

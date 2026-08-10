/* ============================================================================
   <App> — the top of the tree.

   Its whole job is to decide which frame to render and to put the shared
   state provider above both. Note the ordering: <DashboardProvider> wraps the
   frames, so anything either frame renders can call useDashboard().

   The frame choice is genuinely responsive — resize the window and it swaps —
   because `useMediaQuery` subscribes to the browser rather than reading the
   width once. The small floating toggle lets you force either frame, which is
   how you review both against the design without resizing anything.
   ========================================================================== */

import { useState } from 'react';
import { DashboardProvider } from './state/DashboardContext.jsx';
import { useMediaQuery } from './hooks/useMediaQuery.js';
import { DesktopApp } from './components/desktop/DesktopApp.jsx';
import { MobileApp } from './components/mobile/MobileApp.jsx';

export default function App() {
  const isNarrow = useMediaQuery('(max-width: 1023px)');

  /* 'auto' follows the viewport; 'desktop'/'mobile' pin a frame. */
  const [forcedFrame, setForcedFrame] = useState('auto');

  const frame = forcedFrame === 'auto' ? (isNarrow ? 'mobile' : 'desktop') : forcedFrame;

  return (
    <DashboardProvider>
      {frame === 'mobile' ? (
        // The 390px column the design specifies, centred on a wide screen.
        <div className="mx-auto w-full max-w-[390px] border-x border-divider">
          <MobileApp />
        </div>
      ) : (
        <DesktopApp />
      )}

      <FrameToggle value={forcedFrame} onChange={setForcedFrame} />
    </DashboardProvider>
  );
}

function FrameToggle({ value, onChange }) {
  const options = [
    { id: 'auto', label: 'Auto' },
    { id: 'desktop', label: '1a' },
    { id: 'mobile', label: '1b' },
  ];

  return (
    /* bottom-24 clears the mobile tab bar; from lg up there is no tab bar. */
    <div className="fixed right-4 bottom-24 z-40 flex border border-divider bg-bg text-[11px] shadow-md lg:bottom-4">
      {options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={[
            'cursor-pointer px-2.5 py-1.5 font-heading tracking-[0.1em] uppercase',
            index > 0 ? 'border-l border-divider' : '',
            value === option.id ? 'bg-accent-900 text-bg' : 'hover:bg-ink/5',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================================
   <StatCard> — the KPI tiles across the top of the dashboard.

   Five tiles, four visual treatments, one component. The treatments live in
   a `VARIANTS` lookup so the difference between "this tile is the hero" and
   "this tile is a warning" is one word at the call site.

   `children` is used here as an open slot for whatever sits at the bottom of
   the tile — a sparkline, a progress bar, a link. The component owns the
   frame, the kicker and the big number; the caller owns the tail.
   ========================================================================== */

import { Blueprint } from './Blueprint.jsx';

const VARIANTS = {
  /* The hero tile: inverted, dark, sets the tone for the whole row. */
  hero: {
    frame: 'bg-accent-900 text-bg border-accent-900',
    kicker: 'opacity-[0.72]',
    inverted: true,
  },
  /* The default: transparent with a hairline border. */
  plain: {
    frame: '',
    kicker: 'text-ink/60',
    inverted: false,
  },
  /* Needs attention: a heavier accent border, no fill. */
  outlined: {
    frame: 'border-2 border-accent-700',
    kicker: 'text-accent-800',
    inverted: false,
  },
  /* Urgent: a filled accent tint. */
  tinted: {
    frame: 'bg-accent-200',
    kicker: 'text-accent-800',
    inverted: false,
  },
};

export function StatCard({
  variant = 'plain',
  kicker,
  icon: IconComponent,
  value,
  note,
  noteClassName = 'text-ink/60',
  valueSize = 'text-[40px]',
  className = '',
  children,
}) {
  const style = VARIANTS[variant];

  return (
    <Blueprint
      inverted={style.inverted}
      className={`flex flex-col gap-2 px-[18px] py-4 ${style.frame} ${className}`}
    >
      <div
        className={`flex items-center gap-1.5 font-heading text-[11.5px] tracking-[0.16em] uppercase ${style.kicker}`}
      >
        {/* Render the icon only if one was supplied. Capitalised variable
            because JSX treats lowercase names as HTML tags. */}
        {IconComponent && <IconComponent size={13} />}
        {kicker}
      </div>

      <div className={`font-heading leading-none ${valueSize}`}>{value}</div>

      {note && <div className={`text-xs ${noteClassName}`}>{note}</div>}

      {children}
    </Blueprint>
  );
}

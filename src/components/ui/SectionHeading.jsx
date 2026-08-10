/* ============================================================================
   <SectionHeading> — the numbered "01 — EXECUTIVE SUMMARY" row.

   Three of these appear on the desktop frame with the same typography and a
   different right-hand control each time. That right-hand slot is passed in
   as a prop holding JSX (`action={<button …/>}`).

   Props are not limited to strings and numbers: a prop can hold an element,
   which is how you build a component with named holes in it. `children` is
   just the most common such prop, given a shorthand by JSX.
   ========================================================================== */

/* NOTE on Tailwind: never build a class name by interpolating a variable
   (`items-${align}`). Tailwind scans your source as plain text at build time,
   so a class it never literally sees is a class it never generates. Always
   write complete class names and pick between them. */
export function SectionHeading({ number, title, note, action, alignClass = 'items-baseline' }) {
  return (
    <div className={`flex ${alignClass} justify-between`}>
      <div className="flex items-baseline gap-3">
        <h2 className="text-[22px] tracking-[0.09em] uppercase">
          {number} — {title}
        </h2>
        {note && <span className="text-[12.5px] text-ink/55">{note}</span>}
      </div>
      {action}
    </div>
  );
}

/* The mobile frame's smaller heading — same job, different scale. */
export function MobileHeading({ title, action }) {
  return (
    <div className="flex items-baseline justify-between">
      <h3 className="text-[16px] tracking-[0.1em] uppercase">{title}</h3>
      {action}
    </div>
  );
}

/* The all-caps micro label used above sidebar groups and inside cards. */
export function Kicker({ className = '', children }) {
  return (
    <div
      className={`font-heading text-[11px] tracking-[0.16em] uppercase text-ink/50 ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================================
   <ProgressBar> — a track with a filled portion.

   The design draws this with an absolutely positioned fill inside a
   relatively positioned track, and expresses the fill as a right-inset
   (`inset: 0 22% 0 0` for 78%). Here the component takes the honest number —
   `value={78}` — and does the arithmetic itself. Call sites pass data, never
   geometry.

   Note the inline `style` for width. Tailwind is a static, compile-time tool:
   it cannot generate a class for a percentage only known at runtime. Dynamic
   numeric values are exactly the case where an inline style is correct, and
   everything else here stays a utility class.
   ========================================================================== */

const TONES = {
  accent: 'bg-accent',
  critical: 'bg-accent-900',
  inverted: 'bg-[#f2f2f3]',
};

const TRACKS = {
  accent: 'bg-neutral-300',
  critical: 'bg-neutral-300',
  inverted: 'bg-[rgb(242_242_243_/_0.22)]',
};

export function ProgressBar({ value, tone = 'accent', height = 6, className = '' }) {
  // Never let bad data draw outside the track.
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`relative w-full ${TRACKS[tone]} ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`absolute inset-y-0 left-0 ${TONES[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

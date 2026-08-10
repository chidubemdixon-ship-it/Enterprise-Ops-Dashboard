/* ============================================================================
   <Sparkline> — the tiny wordless line on the "Active activities" tile.

   Same scaling idea as TrendChart, stripped to the minimum: no axes, no
   labels, no legend. Worth keeping separate rather than adding five more
   "hide this" flags to TrendChart — two small clear components beat one
   component with a switchboard of booleans.
   ========================================================================== */

export function Sparkline({ values, width = 120, height = 26, className = '' }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index * width) / (values.length - 1);
      // 2px of breathing room top and bottom so the stroke is never clipped.
      const y = height - 2 - ((value - min) / range) * (height - 4);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      style={{ height }}
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <polyline points={points} />
    </svg>
  );
}

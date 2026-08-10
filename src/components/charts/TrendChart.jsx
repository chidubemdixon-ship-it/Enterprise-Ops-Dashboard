/* ============================================================================
   <TrendChart> — the completion-vs-delayed line chart.

   The design contains this chart twice at different sizes, each with the
   coordinates typed out by hand. Hard-coded coordinates are the thing to get
   rid of first when moving a static design to code: they cannot respond to
   data, and the two copies will drift apart the moment anything changes.

   So the component owns two scale functions — `x(index)` and `y(value)` —
   that map data into the SVG coordinate space. Feed it the same data with a
   different geometry preset and you get the desktop chart or the mobile one.
   ========================================================================== */

/* Geometry presets. `baseline` is the y of the zero line, `plotHeight` is how
   many SVG units the full data range is allowed to occupy above it. */
export const TREND_DESKTOP = {
  width: 640,
  height: 200,
  padLeft: 20,
  padRight: 20,
  baseline: 180,
  plotHeight: 100,
  gridStep: 40,
  gridCount: 4,
  showLabels: true,
  showLastDot: true,
  completedWidth: 2,
  delayedWidth: 1.5,
};

export const TREND_MOBILE = {
  width: 320,
  height: 120,
  padLeft: 8,
  padRight: 8,
  baseline: 104,
  plotHeight: 62,
  gridStep: 30,
  gridCount: 3,
  showLabels: false,
  showLastDot: false,
  completedWidth: 2,
  delayedWidth: 1.25,
};

export function TrendChart({ series, geometry = TREND_DESKTOP, className = '' }) {
  const g = geometry;
  const { completed, delayed, labels, max } = series;
  const lastIndex = completed.length - 1;

  /* --- the two scales ------------------------------------------------- */
  const x = (index) => g.padLeft + (index * (g.width - g.padLeft - g.padRight)) / lastIndex;
  const y = (value) => g.baseline - (value / max) * g.plotHeight;

  /* `points` on a <polyline> wants "x,y x,y x,y". Building it with map+join
     is the same list-transformation you use for JSX lists — it just happens
     to produce a string instead of elements. */
  const toPoints = (values) => values.map((v, i) => `${x(i)},${y(v)}`).join(' ');

  const completedPoints = toPoints(completed);

  /* The filled area is the same line, closed along the baseline. */
  const areaPoints = `${completedPoints} ${x(lastIndex)},${g.baseline} ${x(0)},${g.baseline}`;

  /* Array.from({length}) is the idiomatic way to make a fixed-length list to
     map over — here, one horizontal gridline per step. */
  const gridLines = Array.from({ length: g.gridCount }, (_, i) => g.baseline - i * g.gridStep);

  const labelIndices = [0, 3, 6, 9, lastIndex];

  return (
    <svg
      viewBox={`0 0 ${g.width} ${g.height}`}
      className={`w-full ${className}`}
      style={{ height: g.height }}
      fill="none"
      role="img"
      aria-label="Activity completion trend over the last 12 weeks"
    >
      <g stroke="var(--color-divider)" strokeWidth="1">
        {gridLines.map((lineY) => (
          <path key={lineY} d={`M${g.padLeft} ${lineY}h${g.width - g.padLeft - g.padRight}`} />
        ))}
      </g>

      <polygon points={areaPoints} fill="var(--color-accent)" opacity="0.14" />

      <polyline
        points={completedPoints}
        stroke="var(--color-accent)"
        strokeWidth={g.completedWidth}
      />

      <polyline
        points={toPoints(delayed)}
        stroke="var(--color-accent-900)"
        strokeWidth={g.delayedWidth}
        strokeDasharray="4 3"
      />

      {/* Conditional rendering with && — when the flag is false React renders
          nothing at all for this slot. */}
      {g.showLastDot && (
        <circle
          cx={x(lastIndex)}
          cy={y(completed[lastIndex])}
          r="3.5"
          fill="var(--color-accent)"
        />
      )}

      {g.showLabels && (
        <g
          fontSize="10"
          fill="color-mix(in srgb, #1d1f20 55%, transparent)"
          fontFamily="Barlow, sans-serif"
        >
          {labelIndices.map((i) => (
            <text
              key={labels[i]}
              x={x(i)}
              y={g.height - 5}
              textAnchor={i === lastIndex ? 'end' : 'start'}
            >
              {labels[i]}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}

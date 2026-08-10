/* ============================================================================
   <Blueprint> — the framed box that the whole design is built out of.

   In the design source this appears as five lines of markup repeated ~25
   times: a bordered div plus four empty <i> elements that draw the corner
   registration marks. That repetition is exactly what a component removes.

   Two ideas worth noticing:

   • `children` — the special prop React fills with whatever you nest inside
     the tag. It is what makes this a wrapper rather than a fixed widget.

   • `className` pass-through with `...rest` — callers add their own layout
     and colour utilities, and anything else (id, onClick, style) flows to the
     underlying div untouched. The component owns the frame; the caller owns
     the contents.
   ========================================================================== */

export function Blueprint({ inverted = false, className = '', children, ...rest }) {
  const cornerTone = inverted ? 'corner-inverted' : '';

  return (
    <div className={`relative border border-divider ${className}`} {...rest}>
      <i className={`corner corner-tl ${cornerTone}`} />
      <i className={`corner corner-tr ${cornerTone}`} />
      <i className={`corner corner-bl ${cornerTone}`} />
      <i className={`corner corner-br ${cornerTone}`} />
      {children}
    </div>
  );
}

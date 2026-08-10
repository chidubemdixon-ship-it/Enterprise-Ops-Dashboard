/* ============================================================================
   <Button>.

   The design draws its buttons as bordered <span>s, because a static mock has
   nothing to click. In a real app every one of them must be a real <button>:
   it is focusable, it fires on Enter and Space, and a screen reader announces
   it as a control. This is the main place where "recreate the design" and
   "copy the markup" part ways.

   `type="button"` is the default on purpose — inside a <form>, a button with
   no type submits it.
   ========================================================================== */

const SIZES = {
  xs: 'text-xs px-[9px] py-1',
  sm: 'text-[12.5px] px-[10px] py-[5px]',
  md: 'text-[13px] px-3 py-2',
  lg: 'text-[13px] px-4 py-[11px]',
};

const VARIANTS = {
  outline: 'border border-divider hover:bg-ink/5 active:bg-ink/10',
  accent: 'border border-accent text-accent-800 hover:bg-accent/10 active:bg-accent/20',
  solid: 'bg-accent text-bg border border-accent hover:bg-accent-600 active:bg-accent-700',
  ghost: 'text-accent-700 hover:underline underline-offset-4',
};

export function Button({
  variant = 'outline',
  size = 'sm',
  className = '',
  disabled = false,
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

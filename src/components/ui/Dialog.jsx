/* ============================================================================
   <Dialog> — a modal, and a tour of three hooks at once.

   • createPortal renders these nodes into document.body instead of where the
     component sits in the tree. The React tree is unchanged — state and
     events still flow through the parent — but the DOM node escapes any
     ancestor with overflow:hidden or a stacking context, which is what makes
     a modal reliably sit on top of everything.

   • useRef holds a value that survives re-renders without causing one. Here
     it points at a DOM node so we can move focus into the dialog on open.

   • useEffect is for synchronising with things outside React — the document's
     keydown listener and the body's scroll lock. Both are undone in the
     cleanup function it returns.
   ========================================================================== */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function Dialog({ title, onClose, children, footer }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog so the keyboard follows the eye.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-[color-mix(in_srgb,var(--color-neutral-900)_50%,transparent)]"
      /* Clicking the backdrop closes; clicking the panel must not. The check
         is `target === currentTarget`, i.e. the click landed on the backdrop
         itself rather than bubbling up from a child. */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-[min(460px,100%)] max-h-[90vh] overflow-auto flex flex-col gap-3 border border-divider bg-bg p-5 shadow-lg"
      >
        <div className="font-heading text-[20px] tracking-[0.06em] uppercase">{title}</div>
        {children}
        {footer && <div className="mt-2 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

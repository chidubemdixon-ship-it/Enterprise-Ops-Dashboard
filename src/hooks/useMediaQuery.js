/* ============================================================================
   A custom hook.

   "Custom hook" sounds grander than it is: it is a normal function whose name
   starts with `use` and which calls other hooks. That naming convention is
   what lets React apply the rules of hooks to it.

   This one answers a question React cannot answer on its own — "does the
   viewport currently match this media query?" — by subscribing to the browser
   and keeping a piece of React state in sync with it.
   ========================================================================== */

import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  /* Lazy initialiser: the function form of useState runs only on the first
     render, so we don't re-measure the viewport on every subsequent one.
     The typeof guard keeps this safe if the app is ever server-rendered. */
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    // Re-sync immediately: the query may have changed since the last render.
    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener('change', onChange);

    /* The cleanup function. React runs it before the next effect and when the
       component unmounts. Skipping it here would leak a listener every time
       `query` changed. */
    return () => mediaQueryList.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/* ============================================================================
   The entry point — the only place React touches the real DOM directly.

   createRoot() hands React one DOM node (the empty <div id="root"> in
   index.html) and from then on React owns everything inside it.

   <StrictMode> is a development-only wrapper. It deliberately double-invokes
   render and re-runs effects once, which surfaces missing cleanup functions
   and accidental side effects during render. It disappears in the production
   build, so the doubling you see in the console is a feature, not a bug.
   ========================================================================== */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

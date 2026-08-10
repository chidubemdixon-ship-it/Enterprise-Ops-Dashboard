import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Honour PORT when something else is already on 5173.
    port: Number(process.env.PORT) || 5173,
  },
});

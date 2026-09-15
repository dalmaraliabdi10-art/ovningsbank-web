import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Port 5173 last: den adressen ligger i backendens CORS-lista i appsettings.json.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  }
})

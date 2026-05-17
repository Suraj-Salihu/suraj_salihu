import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows /admin to work on direct load / refresh in dev
    historyApiFallback: true,
  },
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
      host: '192.168.1.14', // allows access from local network
      port: 5173,      // or any port you prefer
    }
})

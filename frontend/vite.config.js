import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 10000,
    allowedHosts: [
      'collabx-gamk.onrender.com',
      '.onrender.com'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173
  }
})

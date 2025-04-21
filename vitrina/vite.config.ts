import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Указываем порт 3000 для dev-сервера
    host: true, // Доступ с других устройств в локальной сети
  },
  preview: {
    port: 3000, // Порт для npm run preview
  }
})

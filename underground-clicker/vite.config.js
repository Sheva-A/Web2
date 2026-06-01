import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Web2/underground-clicker/dist/',
  plugins: [react()],
})

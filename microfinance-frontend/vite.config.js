import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server:{
=======
  server: {
>>>>>>> 596db710f1b441dc2431cfa5cbc6b852a752996c
    port: 5175,
    strictPort: true
  }
})

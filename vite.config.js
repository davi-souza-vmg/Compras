import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' funciona tanto em usuario.github.io quanto em usuario.github.io/repositorio
export default defineConfig({ base: './', plugins: [react()] })

import { defineConfig } from 'vite'
import vue              from '@vitejs/plugin-vue'
import LessRollup       from 'rollup-plugin-less'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: { rollupOptions:{ plugins:LessRollup() } }
})

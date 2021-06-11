import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'
import mix, { vercelAdapter } from 'vite-plugin-mix'

export default {
  plugins: [
    vue(),
    windicss(),
    mix({ handler: './handler.ts', adapter: vercelAdapter() }),
  ],
  optimizeDeps: {},
}

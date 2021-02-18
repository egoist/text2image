import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'

export default {
  plugins: [vue(), windicss()],
  optimizeDeps: {},
}

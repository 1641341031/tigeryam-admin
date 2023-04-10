import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver(),IconsResolver({prefix: 'Icon',}),],
    }),
    Components({
      resolvers: [ElementPlusResolver(),
        IconsResolver({enabledCollections: ['ep'],}),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    createSvgIconsPlugin({
      // 指定要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // 执行icon name的格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
	  host: '0.0.0.0',
	  open: false,  //启动项目后打开浏览器
		proxy: {
      '/api': {
        target: 'http://192.168.1.8:8091',  //API服务地址
        changeOrigin: true,             //开启跨域
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

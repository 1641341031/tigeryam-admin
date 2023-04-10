import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import './style.css'
import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import '@/permission.js'

import SvgIcon from '@/components/SvgIcon/index.vue'// svg组件
import 'virtual:svg-icons-register'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 国际化
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
const pinia = createPinia()
setActivePinia(pinia)

app.use(pinia)
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const modules = import.meta.glob('./icons/svg/*.svg')
app.component('svg-icon', SvgIcon)


app.mount('#app')

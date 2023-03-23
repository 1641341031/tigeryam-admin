import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import './style.css'
import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import '@/permission.js'

import SvgIcon from '@/components/SvgIcon/index.vue'// svg组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

const pinia = createPinia()
setActivePinia(pinia)

app.use(pinia)
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

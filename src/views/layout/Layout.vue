<script setup>
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import { onBeforeMount, onMounted, watch, computed } from 'vue'
import { useAppStore } from '@/store/app.js'
import { useRoute } from 'vue-router'

const { body } = document
const WIDTH = 1024
const RATIO = 3

const appStore = useAppStore()
let sidebar = appStore.sidebar
let device = appStore.device

const route = useRoute()

watch(route, () => {
    if(device === 'mobile' && sidebar.opened){
        appStore.CloseSideBar({ withoutAnimation: false })
    }
})

onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
})

// function isMobile(){
//   const rect = body.getBoundingClientRect()
//   return rect.width - RATIO < WIDTH
// }

onMounted(() => {
  const rect = body.getBoundingClientRect()
  const isMobile = rect.width - RATIO < WIDTH
  // const isMobile = isMobile()
  if(isMobile){
      appStore.ToggleDevice('mobile')
      appStore.CloseSideBar({ withoutAnimation: true })
  }
})

function resizeHandler(){
    if(!document.hidden){
      const rect = body.getBoundingClientRect()
      const isMobile = rect.width - RATIO < WIDTH
        //const isMobile = isMobile()
        appStore.ToggleDevice(isMobile ? 'mobile' : 'desktop')
        if(isMobile){
            appStore.CloseSideBar({ withoutAnimation: true })
        }
    }
}

const classObj = computed(()=>{
   return {
      hideSidebar: !sidebar.opened,
      withoutAnimation: sidebar.withoutAnimation,
      mobile: device === 'mobile'
    }
})
</script>

<template>
    <div class="app-wrapper" :class="classObj">
      <Sidebar class="sidebar-container" />
      <div class="main-container">
        <Navbar />
        <AppMain />
      </div>
    </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
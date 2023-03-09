<script setup>
import { Navbar, Sidebar, AppMain } from './components/index.js'
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

onMounted(()=>{
    const isMobile = isMobile()
    if(isMobile){
        appStore.ToggleDevice('mobile')
        appStore.CloseSideBar({ withoutAnimation: true })
    }
})

function isMobile(){
  const rect = body.getBoundingClientRect()
  return rect.width - RATIO < WIDTH
}

function resizeHandler(){
    if(!document.hidden){
        const isMobile = isMobile()
        appStore.ToggleDevice(isMobile ? 'mobile' : 'desktop')
        if(isMobile){
            appStore.CloseSideBar({ withoutAnimation: true })
        }
    }
}

computed(()=>{
  sidebar = ()=>{
    return appStore.sidebar
  },
  device = ()=>{
    return appStore.device
  },
  classObj = ()=>{
    return {
      hideSidebar: !sidebar.opened,
      withoutAnimation: sidebar.withoutAnimation,
      mobile: device === 'mobile'
    }
  }
})
</script>

<template>
    <div class="app-wrapper" :class="classObj">
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
        <navbar/>
        <app-main></app-main>
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
import { onBeforeMount, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/app'
import { useRoute } from 'vue-router'

const { body } = document
const WIDTH = 1024
const RATIO = 3
const appStore = useAppStore()
const route = useRoute()

watch(route, ()=>{
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

isMobile = ()=>{
    const rect = body.getBoundingClientRect()
    return rect.width - RATIO < WIDTH
}

resizeHandler = ()=>{
    if(!document.hidden){
        const isMobile = isMobile()
        appStore.ToggleDevice(isMobile ? 'mobile' : 'desktop')
        if(isMobile){
            appStore.CloseSideBar({ withoutAnimation: true })
        }
    }
}
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            sidebar: {
                opened: !+Cookies.get('sidebarStatus'),
                withoutAnimation: false
            },
            device: 'desktop'
        }
    },
    getters: {
        
    },
    actions: {
        ToggleSideBar(){
            if (this.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
              this.sidebar.opened = !this.sidebar.opened
        },
        CloseSideBar(withoutAnimation) {
            Cookies.set('sidebarStatus', 1)
            this.sidebar.opened = false
            this.sidebar.withoutAnimation = withoutAnimation
        },
        ToggleDevice(device) {
            this.device = device
        }
    }
})
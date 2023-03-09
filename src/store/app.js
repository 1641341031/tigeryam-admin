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
        ToggleSideBar: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
              state.sidebar.opened = !state.sidebar.opened
        },
        CloseSideBar: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        ToggleDevice: (state, device) => {
            state.device = device
        }
    }
})
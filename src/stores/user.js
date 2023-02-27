import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth.js'
import { login, logout } from '@/api/login.js'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: getToken(),
            name: '',
            avatar: '',
            roles: []
        }
    },
    actions: {
        set_token(token){
            state.token = token
        },
        set_name(name){
            state.name = name
        },
        set_avatar(avatar){
            state.avatar = avatar
        },
        set_roles(roles){
            state.roles = roles
        },
        // 登录
        Login(userInfo){
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then( response => {
                    const data = response.data
                    const tokenStr = data.tokenHead+data.token
                    setToken(tokenStr)
                    this.set_token(tokenStr)
                    resolve()
                }).catch( error => {
                    reject(error)
                })
            })
        },
        LogOut(state){
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    this.set_token('')
                    this.set_roles([])
                    removeToken()
                    resolve()
                }).catch( error => {
                    reject(error)
                })
            })
        },
    }
})
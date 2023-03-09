import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth.js'
import { login, logout, getInfo } from '@/api/login.js'

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
            this.token = token
        },
        set_name(name){
            this.name = name
        },
        set_avatar(avatar){
            this.avatar = avatar
        },
        set_roles(roles){
            this.roles = roles
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
        async getUserInfo(){
            try {
                return await new Promise((resolve, reject) => {
                    getInfo().then(response => {
                        const {data} = response.data
                        if (data.roles && data.roles.length > 0) {
                            this.set_roles(data.roles)
                        } else {
                            reject('getInfo: roles must be a non-null array !')
                        }
                        this.set_name(data.username)
                        this.set_avatar(data.icon)
                        resolve(response)
                    })
                })
            } catch (error) {
                reject(error)
            }
        },
        FedLogOut(){
            return new Promise(resolve => {
                this.set_token('')
                removeToken()
                resolve()
            })
            
        }
    }
})
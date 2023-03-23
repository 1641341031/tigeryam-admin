import router from './router/index.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth.js'
import { useUserStore } from '@/store/user.js'
import { usePermissionStore } from '@/store/permission.js'

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const permissionStore =  usePermissionStore()
    NProgress.start()
    if ( getToken() ){
        if ( to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else {
            if (userStore.roles.length === 0){
                userStore.getUserInfo().then( res => {
                    const {data} = res.data
                    let menus = data.menus;
                    let username = data.username;
                    permissionStore.GenerateRoutes({menus, username}).then(() => {
                        let arr = permissionStore.addRouters
                        for (let i = 0; i < arr.length; i++) {
                            const e = arr[i];
                            router.addRoute(e)
                        }
                        next({...to, replace:true})
                    })
                }).catch((err) => {
                    userStore.FedLogOut().then(() => {
                        ElMessage.error(err || 'Verification failed, please login again')
                        next({path: '/'})
                    })
                })
            } else{
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next({path: '/login'})
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
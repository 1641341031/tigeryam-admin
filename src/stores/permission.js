import { asyncRouterMap, constantRouterMap } from '@/router/index';
import { defineStore } from 'pinia'

//判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (route.name) {
    let currMenu = getMenu(route.name, menus);
    if (currMenu!=null) {
      //设置菜单的标题、图标和可见性
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title;
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta.icon = currMenu.icon;
      }
      if(currMenu.hidden!=null){
        route.hidden = currMenu.hidden !== 0;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    } else {
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        route.sort=-1;
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true
  }
}

//根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (name===menu.name) {
      return menu;
    }
  }
  return null;
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if(router.children && router.children.length > 0){
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p){
  return function(m,n){
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

export const usePermissionStore = defineStore('permission',{
    state: ()=>{
        return {
            routes: constantRouterMap,
            addRouters: []
        }
    },
    actions: {
        SET_ROUTERS: (routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        },
        GenerateRoutes: (data) => {
            return new Promise( resolve => {
                const { menus } = data;
                const { username } = data;
                const accessedRouters = asyncRouterMap.filter( v => {
                    if (hasPermission(menus, v)) {
                        if (v.children && v.children.length > 0){
                            v.children = v.children.filter(child => {
                                if (hasPermission(menus, child)) {
                                    return child
                                }
                                return false
                            })
                            return v
                        }else{
                            return v
                        }
                    }
                    return false
                })
                sortRouters(accessedRouters)
                resolve()
            })
        }
    }
})
<script setup>
import SidebarItem from './SidebarItem.vue'
import ScrollBar from '@/components/ScrollBar/index.vue'
import { useAppStore } from '@/store/app.js'
import { usePermissionStore } from '@/store/permission.js'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const appStore = useAppStore()
let {sidebar} = storeToRefs(appStore)
const permissionStore = usePermissionStore()
let { routes } = storeToRefs(permissionStore)
const route = useRoute()

computed(() => {
    routes = () => {return routes},
    isCollapse = () => {
        return !sidebar.opend
    }
})
</script>

<template>
    <scroll-bar>
        <el-menu mode="vertical" :show-timeout="200" :default-active="route.path" :collapse="isCollapse"
            background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
            <sidebar-item :routes="routes"></sidebar-item>
        </el-menu>
</scroll-bar>
</template>
<script setup>
import SidebarItem from './SidebarItem.vue'
import { useAppStore } from '@/store/app.js'
import { usePermissionStore } from '@/store/permission.js'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ScrollBar from '@/components/ScrollBar/index.vue'

// let {sidebar} = storeToRefs(useAppStore())
// let { routers } = storeToRefs(usePermissionStore())
let {sidebar} = useAppStore()
let { routers } = usePermissionStore()
const route = useRoute()

const isCollapse = computed(() => {
    return !sidebar.opened
})
</script>

<template>
    <ScrollBar>
        <el-menu mode="vertical" :show-timeout="200" :default-active="route.path" :collapse="isCollapse"
        background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
        <SidebarItem :routes="routers"></SidebarItem>
        </el-menu>
    </ScrollBar>
    
</template>
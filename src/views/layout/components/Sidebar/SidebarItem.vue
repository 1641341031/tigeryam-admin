<script setup>

defineProps({
  routes: {
    type: Array,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
})

function hasOneshowingChildren(children) {
  const showingChildren = children.filter((item) => {
    return !item.hidden;
  });
  if (showingChildren.length === 1) {
    return true;
  }
  return false;
}
</script>

<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" :key="item.path">
      <div v-if="!item.hidden && item.children">
        <router-link v-if="hasOneshowingChildren(item.children) && !item.children[0].children && !item.alwaysShow"
          :to="item.path + '/' + item.children[0].path"
          :key="item.children[0].name">
          <el-menu-item
            :index="item.path + '/' + item.children[0].path"
            :class="{ 'submenu-title-noDropdown': !isNest }"
          >
            <svg-icon
              v-if="item.children[0].meta && item.children[0].meta.icon"
              :icon-class="item.children[0].meta.icon"
            ></svg-icon>
            <span v-if="item.children[0].meta && item.children[0].meta.title">
              {{ item.children[0].meta.title }}
            </span>
          </el-menu-item>
        </router-link>

        <el-sub-menu v-else :index="item.name || item.path">
          <template #title>
            <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta && item.meta.title">
                {{item.meta.title}}
            </span>
          </template>
          <template v-for="child in item.children" :key="child.path">
            <div v-if="!child.hidden">
                <sidebar-item
                    :is-nest="true"
                    class="nest-menu"
                    v-if="child.children && child.children.length > 0"
                    :routes="[child]"
                    :key="child.path"
            ></sidebar-item>

            <router-link v-else :to="item.path + '/' + child.path" :key="child.name">
              <el-menu-item :index="item.path + '/' + child.path">
                <svg-icon v-if="child.meta && child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                <span v-if="child.meta && child.meta.title">
                    {{child.meta.title}}
                </span>
              </el-menu-item>
            </router-link>
            </div>
          </template>
        </el-sub-menu>
      </div>
    </template>
  </div>
</template>
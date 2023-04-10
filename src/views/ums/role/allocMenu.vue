<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {fetchTreeList} from '@/api/menu.js'
import {listMenuByRole, allocMenu} from '@/api/role.js';

let defaultProps = {
  children: 'children',
  label: 'title'
}
const route = useRoute()
const router = useRouter()
let roleId = route.query.roleId
let menuTreeList = ref([])

function treeList(){
  fetchTreeList().then(response => {
    menuTreeList.value = response.data.data
  });
}
treeList()

const tree = ref(null)
function getRoleMenu(roleId){
  listMenuByRole(roleId).then(response=>{
    let menuList = response.data.data;
    let checkedMenuIds=[];
    if(menuList!=null&&menuList.length>0){
      for(let i=0;i<menuList.length;i++){
        let menu = menuList[i];
        if(menu.parentId!==0){
          checkedMenuIds.push(menu.id);
        }
      }
    }
    tree.value.setCheckedKeys(checkedMenuIds);
  });
}
getRoleMenu(roleId)

function handleSave() {
  let checkedNodes = tree.value.getCheckedNodes();
  let checkedMenuIds=new Set();
  if(checkedNodes!=null&&checkedNodes.length>0){
    for(let i=0;i<checkedNodes.length;i++){
      let checkedNode = checkedNodes[i];
      checkedMenuIds.add(checkedNode.id);
      if(checkedNode.parentId!==0){
        checkedMenuIds.add(checkedNode.parentId);
      }
    }
  }
  ElMessageBox.confirm('是否分配菜单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(()=>{
    let params = new URLSearchParams();
    params.append("roleId",this.roleId);
    params.append("menuIds",Array.from(checkedMenuIds));
    allocMenu(params).then(response => {
      ElMessage({
        message: '分配成功',
        type: 'success',
        duration: 1000
      });
      router.back();
    })
  })
}

function handleClear() {
  tree.value.setCheckedKeys([]);
}
</script>

<template>
    <el-card class="form-container" shadow="never">
        <el-tree
          :data="menuTreeList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <div style="margin-top: 20px" align="center">
          <el-button type="primary" @click="handleSave()">保存</el-button>
          <el-button @click="handleClear()">清空</el-button>
        </div>
    </el-card>
</template>
<script setup>
import { reactive } from 'vue';
import {useRoute, useRouter} from 'vue-router'
import {listAllCate} from '@/api/resourceCategory.js'
import {fetchAllResourceList} from '@/api/resource.js'
import {listResourceByRole, allocResource} from '@/api/role.js'
import {getCurrentInstance} from 'vue'

const route = useRoute()
const router =useRouter()
let roleId = route.query.roleId
let allResourceCate = []
const {
  proxy: { $forceUpdate },
}= getCurrentInstance()

function getAllResourceCateList() {
    listAllCate().then(response => {
        allResourceCate = response.data.data;
        for (let i = 0; i < allResourceCate.length; i++) {
        allResourceCate[i].checked = false;
        }
        getAllResourceList();
    });
}
getAllResourceCateList()

let allResource = reactive([])
function getAllResourceList() {
    fetchAllResourceList().then(response => {
        allResource = response.data.data;
        for (let i = 0; i < allResource.length; i++) {
        allResource[i].checked = false;
        }
        getResourceByRole(roleId);
    });
}

function getResourceByRole(roleId){
    listResourceByRole(roleId).then(response=>{
        let allocResource = response.data.data
        allResource.forEach(item=>{
        item.checked = getResourceChecked(item.id,allocResource);
        });
        allResourceCate.forEach(item=>{
        item.checked = isAllChecked(item.id);
        });
        $forceUpdate();
    })
}

function getResourceChecked(resourceId,allocResource){
    if(allocResource==null||allocResource.length===0) return false;
    for(let i=0;i<allocResource.length;i++){
        if(allocResource[i].id===resourceId){
        return true;
        }
    }
    return false;
}

 function getResourceByCate(categoryId) {
    let cateResource = [];
    if (allResource == null) return null;
    for (let i = 0; i < allResource.length; i++) {
        let resource = allResource[i];
        if (resource.categoryId === categoryId) {
        cateResource.push(resource);
        }
    }
    return cateResource;
}

function isAllChecked(categoryId) {
    let cateResources = getResourceByCate(categoryId);
    if (cateResources == null) return false;
    let checkedCount = 0;
    for (let i = 0; i < cateResources.length; i++) {
        if (cateResources[i].checked === true) {
        checkedCount++;
        }
    }
    if(checkedCount===0){
        return false;
    }
    return checkedCount === cateResources.length;
}

function isIndeterminate(categoryId) {
  let cateResources = getResourceByCate(categoryId);
  if (cateResources == null) return false;
  let checkedCount = 0;
  for (let i = 0; i < cateResources.length; i++) {
    if (cateResources[i].checked === true) {
      checkedCount++;
    }
  }
  return !(checkedCount === 0 || checkedCount === cateResources.length);
}

function handleCheckChange(resource) {
  this.allResourceCate.forEach(item=>{
    if(item.id===resource.categoryId){
      item.checked = isAllChecked(resource.categoryId);
    }
  });
  $forceUpdate();
}

function handleSave() {
        ElMessageBox.confirm('是否分配资源？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let checkedResourceIds = new Set();
          if (this.allResource != null && this.allResource.length > 0) {
            allResource.forEach(item => {
              if (item.checked) {
                checkedResourceIds.add(item.id);
              }
            });
          }
          let params = new URLSearchParams();
          params.append("roleId", this.roleId);
          params.append("resourceIds", Array.from(checkedResourceIds));
          allocResource(params).then(response => {
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
  allResourceCate.forEach(item => {
    item.checked = false;
  });
  allResource.forEach(item => {
    item.checked = false;
  });
  $forceUpdate();
}

function handleCheckAllChange(cate) {
  let cateResources = getResourceByCate(cate.id);
  for (let i = 0; i < cateResources.length; i++) {
    cateResources[i].checked = cate.checked;
  }
  $forceUpdate();
}
</script>


<template>
  <el-card class="form-container" shadow="never">
    <div v-for="(cate,index) in allResourceCate" :class="index===0?'top-line':null" :key="'cate'+cate.id">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox v-model="cate.checked"
                     :indeterminate="isIndeterminate(cate.id)"
                     @change="handleCheckAllChange(cate)">
          {{cate.name}}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
        <el-col :span="8" v-for="resource in getResourceByCate(cate.id)" :key="resource.id" style="padding: 4px 0">
          <el-checkbox v-model="resource.checked" @change="handleCheckChange(resource)">
            {{resource.name}}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>
  </el-card>
</template>
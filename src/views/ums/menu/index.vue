<script setup>
import { reactive, watch } from 'vue';
import {useRouter, useRoute} from 'vue-router'
import {fetchList, updateHidden, deleteMenu} from '@/api/menu.js'

const router = useRouter()
const route = useRoute()
const handleAddMenu = () => {
    router.push('/ums/addMenu');
}

watch(route,()=>{
    resetParentId()
    getList()
})

const parentId = ref(0)
const resetParentId = () => {
    listQuery.pageNum = 1;
    if (route.query.parentId != null) {
        parentId.value = route.query.parentId;
    } else {
        parentId.value = 0;
    }
}

let listQuery = {
    pageNum: 1,
    pageSize: 5
}
let listLoading = ref(true)
let list = reactive([])
let total = ref(null)
const getList = () => {
    listLoading.value = true;
    fetchList(parentId.value, listQuery).then(response => {
        const {data} = response.data
        listLoading.value = false;
        list = data.list;
        total.value = data.total;
    });
}
getList()

const levelFilter = (value) => {
    if (value === 0) {
        return '一级';
    } else if (value === 1) {
        return '二级';
    }
}

function handleHiddenChange(index, row) {
    updateHidden(row.id,{hidden:row.hidden}).then(response=>{
        ElMessage({
        message: '修改成功',
        type: 'success',
        duration: 1000
        });
    })
}

function disableNextLevel(value) {
    if (value === 0) {
        return false;
    } else {
        return true;
    }
}

function handleShowNextLevel(index, row) {
    router.push({path: '/ums/menu', query: {parentId: row.id}})
}

function handleUpdate(index, row) {
    router.push({path:'/ums/updateMenu',query:{id:row.id}});
}

function handleDelete(index, row) {
    ElMessageBox.confirm('是否要删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteMenu(row.id).then(response => {
        ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1000
        });
        getList();
        });
    });
}

function handleSizeChange(val) {
    listQuery.pageNum = 1;
    listQuery.pageSize = val;
    getList();
}

function handleCurrentChange(val) {
    listQuery.pageNum = val;
    getList();
}
</script>

<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <el-icon ><Tickets /></el-icon>
            <span style="margin-top: 5px">数据列表</span>
            <el-button class="btn-add" @click="handleAddMenu()"
                size="small">添加
            </el-button>
        </el-card>
        <div class="table-container">
      <el-table ref="menuTable" style="width: 100%" :data="list"
            v-loading="listLoading" border>
        <el-table-column label="编号" prop="id" width="100" align="center" />
        <el-table-column label="菜单名称" prop="title" align="center" />
        <el-table-column label="菜单级数" width="100" align="center">
          <template #default="scope">{{levelFilter(scope.row.level)}}</template>
        </el-table-column>
        <el-table-column label="前端名称" prop="name" align="center" />
        <el-table-column label="前端图标" width="100" align="center">
            <template #default="scope">{{scope.row.icon}}</template>
          <!-- <template #default="scope"><svg-icon :icon-class="scope.row.icon"></svg-icon></template> -->
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template #default="scope">
            <el-switch
              @change="handleHiddenChange(scope.$index, scope.row)"
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.hidden">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="100" align="center" />
        <el-table-column label="设置" width="120" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link
              :disabled="disableNextLevel(scope.row.level)"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="primary" link
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        v-model="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        v-model:current-page="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    </div>
</template>
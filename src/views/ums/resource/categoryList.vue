<script setup>
import { deleteResourceCategory, updateResourceCategory, createResourceCategory, listAllCate } from '@/api/resourceCategory.js'
import { reactive, ref } from 'vue'
import {formatDate} from '@/utils/date.js'

const defaultResourceCategory={
    name:null,
    sort:0
}
let list = reactive([])
const listLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
let resourceCategory = reactive({...defaultResourceCategory})

function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
    resourceCategory = {...defaultResourceCategory}
}

function getList() {
    listLoading.value = true;
    listAllCate().then(response => {
        listLoading.value = false;
        list = response.data.data
    });
}
getList()

const formatDateTime = (time)=>{
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}

function handleUpdate(index,row){
    dialogVisible.value = true;
    isEdit.value = true;
    resourceCategory = reactive({...row})
}

function handleDelete(index,row){
    ElMessageBox.confirm('是否要删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteResourceCategory(row.id).then(response => {
        ElMessage({
            type: 'success',
            message: '删除成功!'
        });
        getList();
        });
    });
}

function handleDialogConfirm() {
        ElMessageBox.confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateResourceCategory(this.resourceCategory.id,this.resourceCategory).then(response => {
              ElMessage({
                message: '修改成功！',
                type: 'success'
              });
              dialogVisible.value =false;
              getList();
            })
          } else {
            createResourceCategory(this.resourceCategory).then(response => {
              ElMessage({
                message: '添加成功！',
                type: 'success'
              });
              dialogVisible.value =false;
              getList();
            })
          }
        })
      }
</script>

<template>
    <div class="app-container">
        <el-card shadow="never" class="operate-container">
            <el-icon><Tickets /></el-icon>
            <span> 数据列表</span>
            <el-button size="small" class="btn-add" @click="handleAdd">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="resourceCategoryTable" :data="list" style="width: 100%;"
                        v-loading="listLoading" border>
                <el-table-column label="编号" prop="id" width="100" align="center" />
                <el-table-column label="名称" prop="name" align="center" />
                <el-table-column label="创建时间" align="center">
                    <template #default="scope">{{formatDateTime(scope.row.createTime)}}</template>
                </el-table-column>
                <el-table-column label="排序" prop="sort" align="center" />
                <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button size="small"
                            type="primary" link
                            @click="handleUpdate(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="small"
                            type="primary" link
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            title="添加分类"
            v-model="dialogVisible"
            width="40%">
            <el-form :model="resourceCategory" ref="resourceCategoryForm"
                    label-width="150px" size="small">
                <el-form-item label="名称：">
                <el-input v-model="resourceCategory.name" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                <el-input v-model="resourceCategory.sort" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
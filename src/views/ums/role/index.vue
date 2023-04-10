<script setup>
import { reactive } from "vue";
import { formatDate } from '@/utils/date.js'
import {fetchList, updateStatus, deleteRole, updateRole, createRole} from '@/api/role.js';
import { useRouter } from 'vue-router'

const router = useRouter()
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  keyword: ''
}
const defaultRole = {
id: null,
name: null,
description: '',
adminCount: 0,
status: 1
}

const listQuery = reactive(Object.assign({}, defaultListQuery))
let list = reactive([])
let total = ref(null)
let listLoading = ref(false)
let dialogVisible = ref(false)
let role = reactive(Object.assign({}, defaultRole))
let isEdit = ref(false)

function handleSearchList() {
  listQuery.pageNum = 1;
  getList();
}

function handleResetSearch() {
 listQuery.keyword = ''
 listQuery = reactive({...defaultListQuery})
}

function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
    role = reactive({...defaultRole})
}

const formatDateTime = (time)=>{
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}

function getList() {
 listLoading.value = true;
 fetchList(listQuery).then(response => {
    const {data} = response.data
    listLoading.value = false;
    list = reactive(data.list);
    total.value = data.total;
 });
}
getList()

function handleSelectMenu(index,row){
    router.push({path:'/ums/allocMenu',query:{roleId:row.id}})
}
function handleSelectResource(index,row){
    router.push({path:'/ums/allocResource',query:{roleId:row.id}})
}

function handleUpdate(index, row) {
    dialogVisible.value = true;
    isEdit.value = true;
    role = reactive(Object.assign({},row))
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

function handleStatusChange(index, row) {
    ElMessageBox.confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        updateStatus(row.id, {status: row.status}).then(response => {
        ElMessage({
            type: 'success',
            message: '修改成功!'
        });
        });
    }).catch(() => {
        ElMessage({
        type: 'info',
        message: '取消修改'
        });
        getList();
    });
}

function handleDelete(index, row) {
    ElMessageBox.confirm('是否要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let ids = [];
        ids.push(row.id);
        let params=new URLSearchParams();
        params.append("ids",ids);
        deleteRole(params).then(response => {
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
          if (isEdit.value) {
            updateRole(role.id,role).then(response => {
              ElMessage({
                message: '修改成功！',
                type: 'success'
              });
              dialogVisible.value =false;
              getList();
            })
          } else {
            createRole(role).then(response => {
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
        <el-card class="filter-container" shadow="never">
            <div>
                <el-icon><Search /></el-icon>
                <span> 筛选搜索</span>
                <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
                    查询搜索
                </el-button>
                <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
                <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input v-model="listQuery.keyword" class="input-width" placeholder="角色名称" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-icon><Tickets /></el-icon>
            <span> 数据列表</span>
            <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
        </el-card>
        <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" prop="id" align="center" />
        <el-table-column label="角色名称" prop="name" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="用户数"  width="100" prop="adminCount" align="center" />
        <el-table-column label="添加时间" width="160" align="center">
          <template #default="scope">{{formatDateTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template #default="scope">
            <el-switch @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-row>
              <el-button size="small" type="primary" link
                         @click="handleSelectMenu(scope.$index, scope.row)">分配菜单
              </el-button>
              <el-button size="small" type="primary" link
                         @click="handleSelectResource(scope.$index, scope.row)">分配资源
              </el-button>
            </el-row>
            <el-row>
            <el-button size="small" type="primary" link
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="primary" link
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        v-model:current-page="listQuery.pageNum"
        v-model="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑角色':'添加角色'"
      v-model="dialogVisible"
      width="40%">
      <el-form :model="role" ref="roleForm" label-width="150px" size="small">
        <el-form-item label="角色名称：">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="role.description"
                    type="textarea"
                    :rows="5"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
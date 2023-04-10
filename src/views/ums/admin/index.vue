<script setup>
import { fetchList, updateStatus, getRoleByAdmin, deleteAdmin, updateAdmin, createAdmin, allocRole} from '@/api/login.js'
import {fetchAllRoleList} from '@/api/role.js';
import { formatDate } from '@/utils/date.js'
import { onMounted, reactive, ref } from "vue"

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: ''
}
let listLoading = ref(false)
let list = ref(null)
let total = ref(null)
let allRoleList = reactive([])

let listQuery = reactive({...defaultListQuery})

function handleSearchList(){
    listQuery.pageNum = 1
    getList()
}

function getList() {
    fetchList(listQuery).then(response => {
      const {data} = response.data
        listLoading.value = false;
        list.value = data.list;
        total.value = data.total
    }).catch((e)=>{
      console.log(e)
    })
}
getList()

function handleResetSearch() {
  listQuery.keyword = '' //防止el-input组件输入框没更新bug
  listQuery = reactive(Object.assign({}, defaultListQuery))
}

const defaultAdmin = {
  id: null,
  username: null,
  password: null,
  nickname: '',
  email: null,
  note: null,
  status: true
}
let isEdit = ref(false)
let dialogVisible = ref(false)
let admin = reactive(Object.assign({}, defaultAdmin))
function handleAdd() {
  dialogVisible.value = true
  isEdit.value = false
  admin = reactive(Object.assign({},defaultAdmin))
}

const formatDateTime = (time)=>{
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}

function handleStatusChange(index, row){
  ElMessageBox.confirm(
    '是否要修改该状态?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      updateStatus(row.id, {status: row.status}).then((response)=>{
        ElMessage({
        type: 'success',
        message: '修改成功!',
        })
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消修改',
      })
      getList()
    })
}

let allocAdminId = ref(null)
let allocDialogVisible = ref(false)
function handleSelectRole(index,row){
  allocAdminId.value = row.id;
  allocDialogVisible.value = true;
  getRoleListByAdmin(row.id);
}

const allocRoleIds = ref([])
function getRoleListByAdmin(adminId) {
  getRoleByAdmin(adminId).then(response => {
    let allocRoleList = response.data.data
    allocRoleIds.value = []
    if(allocRoleList!=null&&allocRoleList.length>0){
      for(let i=0;i<allocRoleList.length;i++){
        allocRoleIds.value.push(allocRoleList[i].id);
      }
    }
  });
}

function handleUpdate(index, row) {
  dialogVisible.value = true;
  isEdit.value = true;
  admin = reactive(Object.assign({},row));
}

function handleDelete(index, row) {
  ElMessageBox.confirm('是否要删除该用户?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    deleteAdmin(row.id).then(response => {
      ElMessage({
        type: 'success',
        message: '删除成功!'
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

function handleDialogConfirm() {
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isEdit.value) {
      updateAdmin(admin.id,admin).then(response => {
        ElMessage({
          message: '修改成功！',
          type: 'success'
        });
        dialogVisible.value =false;
        getList();
      })
    } else {
      createAdmin(admin).then(response => {
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

function handleAllocDialogConfirm(){
  ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let params = new URLSearchParams();
    params.append("adminId", allocAdminId.value);
    params.append("roleIds", allocRoleIds.value);
    allocRole(params).then(response => {
      ElMessage({
        message: '分配成功！',
        type: 'success'
      });
      allocDialogVisible.value = false;
    })
  })
}

function getAllRoleList() {
  fetchAllRoleList().then(response => {
    allRoleList = response.data.data;
  });
}
getAllRoleList()
</script>

<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-icon><Search /></el-icon> 
        <span> 筛选搜索</span>
        <el-button style="float: right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float: right; margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/昵称" clearable />
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
      <el-table ref="adminTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="编号" prop="id" width="100" align="center" />
        <el-table-column label="帐号" prop="username" align="center" />
        <el-table-column label="昵称" prop="nickname" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="添加时间" width="160" align="center">
          <template #default="scope">{{formatDateTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="最后登录" prop="formatDateTime(updateTime)" width="160" align="center">
          <template #default="scope">{{formatDateTime(scope.row.updateTime)}}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template #default="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link
              @click="handleSelectRole(scope.$index, scope.row)">分配角色
          </el-button>
          <el-button size="small" type="primary" link
              @click="handleUpdate(scope.$index, scope.row)">
              编辑
          </el-button>
          <el-button size="small" type="primary" link
              @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
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
        v-model:page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total" />
    </div>
    <el-dialog
      :title="isEdit?'编辑用户':'添加用户'"
      v-model="dialogVisible"
      width="40%">
      <el-form :model="admin"
               ref="adminForm"
               label-width="150px" size="small">
        <el-form-item label="帐号：">
          <el-input v-model="admin.username" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="昵称：">
          <el-input v-model="admin.nickname" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="admin.email" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="admin.password"  type="password" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="admin.note"
                    type="textarea"
                    :rows="5"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="admin.status">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
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
    <el-dialog
      title="分配角色"
      v-model="allocDialogVisible"
      width="30%">
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
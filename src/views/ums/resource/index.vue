<script setup>
import { fetchList, deleteResource, updateResource, createResource } from '@/api/resource.js'
import {listAllCate} from '@/api/resourceCategory.js'
import { reactive } from "vue"
import { useRouter } from 'vue-router'
import {formatDate} from '@/utils/date.js'

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    nameKeyword: null,
    urlKeyword: null,
    categoryId:null
}
const defaultResource = {
    id: null,
    name: null,
    url: null,
    categoryId: null,
    description:''
}
let listQuery = reactive({...defaultListQuery})

const handleSearchList = ()=>{
    listQuery.pageNum = 1;
    getList();
}

const listLoading = ref(false)
let list = reactive([]) 
const total = ref(null)

const getList = ()=>{
    listLoading.value = true;
    fetchList(listQuery).then(response => {
        const { data } = response.data
        listLoading.value = false;
        list = data.list;
        total.value = data.total;
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

const categoryOptions = reactive([])
const defaultCategoryId = ref(null)
const getCateList = ()=>{
    listAllCate().then(response=>{
        let cateList = response.data.data;
        for(let i=0;i<cateList.length;i++){
        let cate = cateList[i];
        categoryOptions.push({label:cate.name,value:cate.id});
        }
        defaultCategoryId.value = cateList[0].id;
    })
}
getCateList()

const handleResetSearch = ()=>{
    listQuery.nameKeyword = ''
    listQuery.urlKeyword = ''
    listQuery = reactive({...defaultListQuery})
}

const dialogVisible = ref(false)
const isEdit = ref(false)
let resource = reactive({...defaultResource})
const handleAdd = () => {
    dialogVisible.value = true;
    isEdit.value = false;
    resource = reactive({...defaultResource})
    resource.categoryId = defaultCategoryId.value;
}

const router = useRouter()
const handleShowCategory = () => {
    router.push({path: '/ums/resourceCategory'})
}

const handleUpdate = (index, row)=>{
    dialogVisible.value = true;
    isEdit.value = true;
    resource = reactive({...row});
}

function handleDelete(index, row) {
    ElMessageBox.confirm('是否要删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteResource(row.id).then(response => {
        ElMessage({
            type: 'success',
            message: '删除成功!'
        });
        getList();
        });
    });
}

const handleSizeChange = (val)=>{
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
        updateResource(resource.id,resource).then(response => {
            ElMessage({
            message: '修改成功！',
            type: 'success'
            });
            dialogVisible.value =false;
            getList();
        })
        } else {
        createResource(resource).then(response => {
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
                <el-button style="float:right" type="primary" @click="handleSearchList()"
                    size="small">
                    查询搜索
                </el-button>
                <el-button style="float:right;margin-right: 15px"
                    @click="handleResetSearch()"
                    size="small">
                    重置
                </el-button>
                </div>
                <div style="margin-top: 15px">
            <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="资源名称：">
                <el-input v-model="listQuery.nameKeyword" class="input-width" placeholder="资源名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="资源路径：">
                <el-input v-model="listQuery.urlKeyword" class="input-width" placeholder="资源路径" clearable></el-input>
            </el-form-item>
            <el-form-item label="资源分类：">
                <el-select v-model="listQuery.categoryId" placeholder="全部" clearable class="input-width">
                <el-option v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                </el-option>
                </el-select>
            </el-form-item>
            </el-form>
        </div>
        </el-card>
        <el-card class="operate-container" shadow="never">
            <el-icon><Tickets /></el-icon>
            <span> 数据列表</span>
            <el-button size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
            <el-button size="small" class="btn-add" @click="handleShowCategory()">资源分类</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="resourceTable" :data="list" style="width: 100%;"
                    v-loading="listLoading" border>
                <el-table-column label="编号" prop="id" width="100" align="center" />
                <el-table-column label="资源名称" prop="name" align="center" />
                <el-table-column label="资源路径" prop="url" align="center" />
                <el-table-column label="描述" prop="description" align="center" />
                <el-table-column label="添加时间" width="160" align="center">
                    <template #default="scope">{{formatDateTime(scope.row.createTime)}}</template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center">
                <template #default="scope">
                    <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">
                        删除
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
        v-model:current-page="listQuery.pageNum"
        v-model="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑资源':'添加资源'"
      v-model="dialogVisible"
      width="40%">
      <el-form :model="resource"
               ref="resourceForm"
               label-width="150px" size="small">
        <el-form-item label="资源名称：">
          <el-input v-model="resource.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="资源路径：">
          <el-input v-model="resource.url" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="资源分类：">
          <el-select v-model="resource.categoryId" placeholder="全部" clearable style="width: 250px">
            <el-option v-for="item in categoryOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="resource.description"
                    type="textarea"
                    :rows="5"
                    style="width: 250px"></el-input>
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
<script setup>
import { reactive, watch } from "vue"
import {fetchList,deleteProductCate,updateShowStatus,updateNavStatus} from '@/api/productCate.js'
import { useRoute, useRouter } from "vue-router"

const list  = ref(null)
const total = ref(null)
const listLoading = ref(true)
const listQuery = reactive({
    pageNum: 1,
    pageSize: 5
    }) 
const parentId = ref(0)

const route = useRoute()
const router = useRouter()
watch(route, ()=>{
    resetParentId()
    getList()
})


const resetParentId = ()=>{
    listQuery.pageNum = 1;
    if (route.query.parentId != null) {
        parentId.value = route.query.parentId;
    } else {
        parentId.value = 0;
    }
}
resetParentId()

const handleAddProductCate = ()=>{
    router.push('/pms/addProductCate');
}

const getList = ()=>{
    listLoading.value = true;
    fetchList(parentId.value, listQuery).then(response => {
        listLoading.value = false;
        list.value = response.data.data.list;
        total.value = response.data.data.total;
    });
}
getList()

const handleSizeChange = (val)=>{
        listQuery.pageNum = 1;
        listQuery.pageSize = val;
        getList();
      }

const handleCurrentChange = (val)=>{
        listQuery.pageNum = val;
        getList();
      }

const handleNavStatusChange = (index, row)=>{
        let data = new URLSearchParams();
        let ids=[];
        ids.push(row.id)
        data.append('ids',ids);
        data.append('navStatus',row.navStatus);
        updateNavStatus(data).then(response=>{
          ElMessage({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      }

const handleShowStatusChange = (index, row)=>{
        let data = new URLSearchParams();
        let ids=[];
        ids.push(row.id)
        data.append('ids',ids);
        data.append('showStatus',row.showStatus);
        updateShowStatus(data).then(response=>{
          ElMessage({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      }

const handleShowNextLevel = (index, row)=>{
    router.push({path: '/pms/productCate', query: {parentId: row.id}})
}

const handleTransferProduct = (index, row)=>{
    ElMessage({
            message: '开发中...',
            type: 'message',
            duration: 1000
          })
}

const handleUpdate = (index, row)=>{
        router.push({path:'/pms/updateProductCate',query:{id:row.id}});
      }

const handleDelete = (index, row)=>{
        ElMessageBox.confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductCate(row.id).then(response => {
            ElMessage({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            getList();
          });
        });
      }

const levelFilter = (value)=>{
    if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
}

const disableNextLevel = (value)=>{
    if (value === 0) {
        return false;
    } else {
        return true;
    }
}
</script>

<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <el-card class="operate-container" shadow="never">
            <el-icon><Tickets /></el-icon>
            <span style="margin-top: 5px">数据列表</span>
            <el-button class="btn-add"
                @click="handleAddProductCate()"
                size="small">
                添加
            </el-button>
            </el-card>
        </el-card>
        <div class="table-container">
            <el-table ref="productCateTable"
                        style="width: 100%"
                        :data="list"
                        v-loading="listLoading" border>
                <el-table-column label="编号" width="100" align="center">
                <template #default="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="分类名称" align="center">
                <template #default="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="级别" width="100" align="center">
                <template #default="scope">{{levelFilter(scope.row.level)}}</template>
                </el-table-column>
                <el-table-column label="商品数量" width="100" align="center">
                <template #default="scope">{{scope.row.productCount }}</template>
                </el-table-column>
                <el-table-column label="数量单位" width="100" align="center">
                <template #default="scope">{{scope.row.productUnit }}</template>
                </el-table-column>
                <el-table-column label="导航栏" width="100" align="center">
                <template #default="scope">
                    <el-switch
                    @change="handleNavStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.navStatus">
                    </el-switch>
                </template>
                </el-table-column>
                <el-table-column label="是否显示" width="100" align="center">
                <template #default="scope">
                    <el-switch
                    @change="handleShowStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.showStatus">
                    </el-switch>
                </template>
                </el-table-column>
                <el-table-column label="排序" width="100" align="center">
                <template #default="scope">{{scope.row.sort }}</template>
                </el-table-column>
                <el-table-column label="设置" width="200" align="center">
                <template #default="scope">
                    <el-button
                    size="small"
                    :disabled="disableNextLevel(scope.row.level)"
                    @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
                    </el-button>
                    <el-button
                    size="small"
                    @click="handleTransferProduct(scope.$index, scope.row)">转移商品
                    </el-button>
                </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                    <el-button
                    size="small"
                    @click="handleUpdate(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                    size="small"
                    type="danger"
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
                v-model:page-size="listQuery.pageSize"
                :page-sizes="[5,10,15]"
                v-model:current-page="listQuery.pageNum"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
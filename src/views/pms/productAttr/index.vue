<script setup>
import { reactive } from "vue"
import {fetchList, deleteProductAttrCate, createProductAttrCate, updateProductAttrCate} from '@/api/productAttrCate.js'
import { useRouter } from "vue-router"

const list = ref([])
const total = ref(null)
const listLoading = ref(true)
const listQuery = reactive({
    pageNum: 1,
    pageSize: 5
})
const dialogVisible = ref(false)
const dialogTitle = ref('')
const productAttrCate = reactive({
    name:'',
    id:null
})
const rules = reactive({
        name: [
        { required: true, message: '请输入类型名称', trigger: 'blur' }
        ]
    })


const getList = ()=>{
        listLoading.value = true;
        fetchList(listQuery).then(response => {
          listLoading.value = false;
          list.value = response.data.data.list;
          total.value = response.data.data.total;
        });
      }
getList()

const addProductAttrCate = ()=>{
    dialogVisible.value = true;
    dialogTitle.value = "添加类型";
}

const handleSizeChange = (val)=>{
    listQuery.pageNum = 1;
    listQuery.pageSize = val;
    getList();
}

const handleCurrentChange = (val)=>{
        listQuery.pageNum = val;
        getList();
      }

const handleDelete = (index, row)=>{
        ElMessageBox.confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductAttrCate(row.id).then(response=>{
            Elmessage({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            getList();
          });
        });
      }

const handleUpdate = (index, row)=>{
        dialogVisible.value = true;
        dialogTitle.value = "编辑类型";
        productAttrCate.name = row.name;
        productAttrCate.id = row.id;
      }

const router = useRouter()
const getAttrList = (index, row)=>{
        router.push({path: '/pms/productAttrList',query:{cid:row.id,cname:row.name,type:0}})
      }

const getParamList = (index, row)=>{
        router.push({path: '/pms/productAttrList',query:{cid:row.id,cname:row.name,type:1}})
      }

const productAttrCatForm = ref(null)
const handleConfirm = ()=>{
        productAttrCatForm.value.validate((valid) => {
          if (valid) {
            let data = new URLSearchParams();
            data.append("name",productAttrCate.name);
            if(dialogTitle.value==="添加类型"){
              createProductAttrCate(data).then(response=>{
                Elmessage({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });
                dialogVisible.value = false;
                getList();
              });
            }else{
              updateProductAttrCate(productAttrCate.id,data).then(response=>{
                Elmessage({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                dialogVisible.value = false;
                getList();
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }


const handleClose = ()=>{
        if (!dialogVisible.value && productAttrCatForm.value) {
          productAttrCatForm.value.clearValidate()
        }
      }
</script>

<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-icon><Tickets /></el-icon>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="addProductAttrCate()"
        size="small">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="类型名称" align="center">
          <template #default="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="属性数量" width="200" align="center">
          <template #default="scope">{{scope.row.attributeCount==null?0:scope.row.attributeCount}}</template>
        </el-table-column>
        <el-table-column label="参数数量" width="200" align="center">
          <template #default="scope">{{scope.row.paramCount==null?0:scope.row.paramCount}}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template #default="scope">
            <el-button
              size="small"
              @click="getAttrList(scope.$index, scope.row)">属性列表
            </el-button>
            <el-button
              size="small"
              @click="getParamList(scope.$index, scope.row)">参数列表
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
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :before-close="handleClose()"
      width="30%">
      <el-form ref="productAttrCatForm" :model="productAttrCate" :rules="rules" label-width="120px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="productAttrCate.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
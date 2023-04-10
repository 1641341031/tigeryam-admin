<script setup>
import { Edit} from '@element-plus/icons-vue'
import {fetchList as fetchProductAttrList} from '@/api/productAttr.js'
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { 
    updatePublishStatus, 
    fetchList, updateNewStatus, 
    updateRecommendStatus,
    updateDeleteStatus
    } from '@/api/product.js'
import { fetchList as fetchSkuStockList,
         update as updateSkuStockList
     } from '@/api/skuStock.js'
import {fetchList as fetchBrandList} from '@/api/brand.js'
import {fetchListWithChildren} from '@/api/productCate.js'

const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
}

const listLoading = ref(true)
let list = reactive([])
const total = ref(null)
let selectProductCateValue = reactive([])
let listQuery = reactive({...defaultListQuery})

function handleSearchList() {
    listQuery.pageNum = 1;
    getList();
}

function getList() {
    listLoading.value = true;
    fetchList(listQuery).then(response => {
        const { data } = response.data
        listLoading.value = false;
        list = data.list;
        total.value = data.total;
    });
}
getList()

const router = useRouter()
function handleAddProduct() {
    router.push({path:'/pms/addProduct'});
}

let brandOptions = reactive([])
function getBrandList() {
    fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
        let brandList = response.data.data.list;
        for (let i = 0; i < brandList.length; i++) {
        brandOptions.push({label: brandList[i].name, value: brandList[i].id});
        }
    });
}
getBrandList()

let productCateOptions = reactive([])
function getProductCateList() {
    fetchListWithChildren().then(response => {
        let list = response.data.data;
        for (let i = 0; i < list.length; i++) {
        let children = [];
        if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
            children.push({label: list[i].children[j].name, value: list[i].children[j].id});
            }
        }
        productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
        }
    });
}
getProductCateList()

function handleResetSearch() {
    selectProductCateValue = reactive([]);
    listQuery = reactive({...defaultListQuery})
}
watch(selectProductCateValue, (newValue)=>{
    if (newValue != null && newValue.length == 2) {
        listQuery.productCategoryId = newValue[1];
    } else {
        listQuery.productCategoryId = null;
    }
})

let multipleSelection = reactive([])
const handleSelectionChange = (val)=>{
    console.log("val : ", val)
    multipleSelection = reactive(val)
}

function handlePublishStatusChange(index, row) {
    let ids = [];
    ids.push(row.id);
    updatePublishStatus(row.publishStatus, ids);
}

const handleNewStatusChange = (index, row) => {
    let ids = [];
    ids.push(row.id);
    updateNewStatus(row.newStatus, ids);
}

const handleRecommendStatusChange = (index, row) => {
    let ids = [];
    ids.push(row.id);
    updateRecommendStatus(row.recommandStatus, ids);
}

const operates = reactive([
          {
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "设为新品",
            value: "newOn"
          },
          {
            label: "取消新品",
            value: "newOff"
          },
          {
            label: "转移到分类",
            value: "transferCategory"
          },
          {
            label: "移入回收站",
            value: "recycle"
          }
        ])

let editSkuInfo = reactive({
          dialogVisible:false,
          productId:null,
          productSn:'',
          productAttributeCategoryId:null,
          stockList:[],
          productAttr:[],
          keyword:null
        })
const handleShowSkuEditDialog = (index,row) => {
    editSkuInfo.dialogVisible=true;
    editSkuInfo.productId=row.id;
    editSkuInfo.productSn=row.productSn;
    editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
    editSkuInfo.keyword=null;
    fetchSkuStockList(row.id,{keyword:editSkuInfo.keyword}).then(response=>{
        editSkuInfo.stockList=response.data.data;
    });
    if(row.productAttributeCategoryId!=null){
        fetchProductAttrList(row.productAttributeCategoryId,{type:0}).then(response=>{
        editSkuInfo.productAttr=response.data.list;
        });
    }
}

const verifyStatusFilter = (value) => {
    if (value === 1) {
        return '审核通过';
    } else {
        return '未审核';
    }
}

const handleShowVerifyDetail = (index,row) => {
    console.log("handleShowVerifyDetail",row);
}

function handleShowProduct(index,row){
    console.log("handleShowProduct",row);
}

const handleUpdateProduct = (index,row)=>{
    router.push({path:'/pms/updateProduct',query:{id:row.id}});
}

const handleShowLog = (index,row) => {
    console.log("handleShowLog",row);
}

const handleDelete = (index, row) => {
        ElMessageBox.confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          updateDeleteStatus(1,ids);
        });
      }

const handleSizeChange = (val) => {
        listQuery.pageNum = 1;
        listQuery.pageSize = val;
        getList();
      }

const operateType = null
const handleBatchOperate = () => {
    if(operateType==null){
        ElMessage({
        message: '请选择操作类型',
        type: 'warning',
        duration: 1000
        });
        return;
    }
    if(multipleSelection==null || multipleSelection.length<1){
        ElMessage({
        message: '请选择要操作的商品',
        type: 'warning',
        duration: 1000
        });
        return;
    }
    ElMessage('是否要进行该批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let ids=[];
        for(let i=0;i<multipleSelection.length;i++){
        ids.push(multipleSelection[i].id);
        }
        switch (operateType) {
        case operates[0].value:
            updatePublishStatus(1,ids);
            break;
        case operates[1].value:
            updatePublishStatus(0,ids);
            break;
        case operates[2].value:
            updateRecommendStatus(1,ids);
            break;
        case operates[3].value:
            updateRecommendStatus(0,ids);
            break;
        case operates[4].value:
            updateNewStatus(1,ids);
            break;
        case operates[5].value:
            updateNewStatus(0,ids);
            break;
        case operates[6].value:
            break;
        case operates[7].value:
            updateDeleteStatus(1,ids);
            break;
        default:
            break;
        }
        getList();
    });
}

const handleCurrentChange = (val) => {
    listQuery.pageNum = val;
    getList();
}

const handleSearchEditSku = () => {
    fetchSkuStockList(editSkuInfo.productId,{keyword:editSkuInfo.keyword}).then(response=>{
        editSkuInfo.stockList=response.data.data;
    });
}

const handleEditSkuConfirm = () => {
    if(editSkuInfo.stockList==null||editSkuInfo.stockList.length<=0){
        ElMessage({
        message: '暂无sku信息',
        type: 'warning',
        duration: 1000
        });
        return
    }
    ElMessage('是否要进行修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(()=>{
        updateSkuStockList(editSkuInfo.productId,editSkuInfo.stockList).then(response=>{
        ElMessage({
            message: '修改成功',
            type: 'success',
            duration: 1000
        });
        editSkuInfo.dialogVisible=false;
        });
    });
}

let publishStatusOptions = reactive([{
    value: 1,
    label: '上架'
}, {
    value: 0,
    label: '下架'
}]) 
let verifyStatusOptions = reactive([{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }])
</script>

<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <el-icon><Search /></el-icon>
                <span> 筛选搜索</span>
                <el-button style="float: right" @click="handleSearchList()" type="primary"
                    size="small">
                    查询结果
                </el-button>
                <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()"
                    size="small">
                    重置
                </el-button>
            </div>
            <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
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
            <span>数据列表</span>
            <el-button class="btn-add" @click="handleAddProduct()"
                size="small">
                添加
            </el-button>
        </el-card>
        <div class="table-container">
        <el-table ref="productTable"
                    :data="list" style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border>
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column label="编号" prop="id" width="100" align="center" />
            <el-table-column label="商品图片" width="120" align="center">
                <template #default="scope"><img style="height: 80px" :src="scope.row.pic"></template>
            </el-table-column>
            <el-table-column label="商品名称" align="center">
            <template #default="scope">
                <p>{{scope.row.name}}</p>
                <p>品牌：{{scope.row.brandName}}</p>
            </template>
            </el-table-column>
            <el-table-column label="价格/货号" width="120" align="center">
            <template #default="scope">
                <p>价格：￥{{scope.row.price}}</p>
                <p>货号：{{scope.row.productSn}}</p>
            </template>
            </el-table-column>
            <el-table-column label="标签" width="140" align="center">
            <template #default="scope">
                <p>上架：
                <el-switch
                    @change="handlePublishStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.publishStatus">
                </el-switch>
                </p>
                <p>新品：
                <el-switch
                    @change="handleNewStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.newStatus">
                </el-switch>
                </p>
                <p>推荐：
                <el-switch
                    @change="handleRecommendStatusChange(scope.$index, scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="scope.row.recommandStatus">
                </el-switch>
                </p>
            </template>
            </el-table-column>
            <el-table-column label="排序" prop="sort" width="100" align="center" />
            <el-table-column label="SKU库存" width="100" align="center">
                <template #default="scope">
                    <el-button type="primary" :icon="Edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle />
                </template>
            </el-table-column>
            <el-table-column label="销量" prop="sale" width="100" align="center" />
            <el-table-column label="审核状态" width="100" align="center">
            <template #default="scope">
                <p>{{verifyStatusFilter(scope.row.verifyStatus)}}</p>
                <p>
                <el-button
                    type="text"
                    @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情
                </el-button>
                </p>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
            <template #default="scope">
                <p>
                <el-button
                    size="small"
                    @click="handleShowProduct(scope.$index, scope.row)">查看
                </el-button>
                <el-button
                    size="small"
                    @click="handleUpdateProduct(scope.$index, scope.row)">编辑
                </el-button>
                </p>
                <p>
                <el-button
                    size="small"
                    @click="handleShowLog(scope.$index, scope.row)">日志
                </el-button>
                <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
                </p>
            </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        v-model="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        v-model:current-page="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="编辑货品信息"
      v-model="editSkuInfo.dialogVisible"
      width="40%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button type="primary" :icon="Search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in editSkuInfo.productAttr"
          :label="item.name"
          :key="item.id"
          align="center">
          <template #default="scope">
            {{getProductSkuSp(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column
          label="销售价格"
          width="80"
          align="center">
          <template #default="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="80"
          align="center">
          <template #default="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="库存预警值"
          width="100"
          align="center">
          <template #default="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    </div>
</template>
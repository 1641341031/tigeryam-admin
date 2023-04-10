<script setup>
import { reactive } from "vue"
import { useRouter } from "vue-router"


const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderSn: null,
    receiverKeyword: null,
    status: null,
    orderType: null,
    sourceType: null,
    createTime: null,
}

const listQuery = reactive({...defaultListQuery})
const listLoading = ref(true)
const list = ref([])
const total = ref(0)
const operateType = ref(null)
const multipleSelection = ref([])
const closeOrder = reactive({
          dialogVisible:false,
          content:null,
          orderIds:[]
        })
const statusOptions = reactive([
          {
            label: '待付款',
            value: 0
          },
          {
            label: '待发货',
            value: 1
          },
          {
            label: '已发货',
            value: 2
          },
          {
            label: '已完成',
            value: 3
          },
          {
            label: '已关闭',
            value: 4
          }
        ])
const orderTypeOptions = reactive([
          {
            label: '正常订单',
            value: 0
          },
          {
            label: '秒杀订单',
            value: 1
          }
        ])
const sourceTypeOptions = reactive([
          {
            label: 'PC订单',
            value: 0
          },
          {
            label: 'APP订单',
            value: 1
          }
        ])
const operateOptions = reactive([
          {
            label: "批量发货",
            value: 1
          },
          {
            label: "关闭订单",
            value: 2
          },
          {
            label: "删除订单",
            value: 3
          }
        ])
const logisticsDialogVisible = ref(false)

const formatCreateTime = (time)=>{
    let date = new Date(time);
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}

const getList = ()=>{
        listLoading.value = true;
        fetchList(listQuery).then(response => {
          const {data} = response.data
          listLoading.value = false;
          list.value = data.list;
          total.value = data.total;
        });
      }
getList()

const formatPayType = (value)=>{
    if (value === 1) {
        return '支付宝';
    } else if (value === 2) {
        return '微信';
    } else {
        return '未支付';
    }
}

const formatSourceType = (value)=>{
    if (value === 1) {
        return 'APP订单';
    } else {
        return 'PC订单';
    }
}

const formatStatus = (value)=>{
    if (value === 1) {
        return '待发货';
    } else if (value === 2) {
        return '已发货';
    } else if (value === 3) {
        return '已完成';
    } else if (value === 4) {
        return '已关闭';
    } else if (value === 5) {
        return '无效订单';
    } else {
        return '待付款';
    }
}

const handleResetSearch = ()=>{
    listQuery = reactive({...defaultListQuery})
}

const handleSearchList = ()=>{
        listQuery.pageNum = 1;
        getList();
      }

const handleSelectionChange = (val)=>{
        multipleSelection.value = val;
      }

const router = useRouter()
const handleViewOrder = (index, row)=>{
        router.push({path:'/oms/orderDetail',query:{id:row.id}})
    }

const handleCloseOrder = (index, row)=>{
        closeOrder.dialogVisible=true;
        closeOrder.orderIds=[row.id];
      }

const handleDeliveryOrder = (index, row)=>{
        let listItem = covertOrder(row);
        router.push({path:'/oms/deliverOrderList',query:{list:[listItem]}})
      }

const handleViewLogistics = (index, row)=>{
        logisticsDialogVisible.value = true;
      }

const handleDeleteOrder = (index, row)=>{
        let ids=[];
        ids.push(row.id);
        deleteOrder(ids);
      }

const handleBatchOperate = ()=>{
        if(multipleSelection.value == null || multipleSelection.value.length<1){
          ElMessage({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(operateType.value===1){
          //批量发货
          let list=[];
          for(let i=0;i<multipleSelection.value.length;i++){
            if(multipleSelection.value[i].status===1){
              list.push(covertOrder(multipleSelection.value[i]));
            }
          }
          if(list.length===0){
            ElMessage({
              message: '选中订单中没有可以发货的订单',
              type: 'warning',
              duration: 1000
            });
            return;
          }
          router.push({path:'/oms/deliverOrderList',query:{list:list}})
        }else if(operateType.value===2){
          //关闭订单
          closeOrder.orderIds=[];
          for(let i=0;i<multipleSelection.value.length;i++){
            closeOrder.orderIds.push(multipleSelection.value[i].id);
          }
          closeOrder.dialogVisible=true;
        }else if(operateType.value===3){
          //删除订单
          let ids=[];
          for(let i=0;i<multipleSelection.value.length;i++){
            ids.push(multipleSelection.value[i].id);
          }
          deleteOrder(ids);
        }
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

const handleCloseOrderConfirm = ()=>{
        if (closeOrder.content == null || closeOrder.content === '') {
          ElMessage({
            message: '操作备注不能为空',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let params = new URLSearchParams();
        params.append('ids', this.closeOrder.orderIds);
        params.append('note', this.closeOrder.content);
        closeOrder(params).then(response=>{
          closeOrder.orderIds=[];
          closeOrder.dialogVisible=false;
          getList();
          ElMessage({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      }

const deleteOrder = (ids) => {
        ElMessageBox.confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",ids);
          deleteOrder(params).then(response=>{
            ElMessage({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            getList();
          });
        })
      }

const covertOrder = (order)=>{
        let address=order.receiverProvince+order.receiverCity+order.receiverRegion+order.receiverDetailAddress;
        let listItem={
          orderId:order.id,
          orderSn:order.orderSn,
          receiverName:order.receiverName,
          receiverPhone:order.receiverPhone,
          receiverPostCode:order.receiverPostCode,
          address:address,
          deliveryCompany:null,
          deliverySn:null
        };
        return listItem;
      }
</script>

<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-icon><Search /></el-icon>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="收货人姓名/手机号码"></el-input>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单分类：">
            <el-select v-model="listQuery.orderType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in orderTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源：">
            <el-select v-model="listQuery.sourceType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in sourceTypeOptions"
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
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template #default="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="180" align="center">
          <template #default="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180" align="center">
          <template #default="scope">{{formatCreateTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template #default="scope">{{scope.row.memberUsername}}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template #default="scope">￥{{scope.row.totalAmount}}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template #default="scope">{{formatPayType(scope.row.payType)}}</template>
        </el-table-column>
        <el-table-column label="订单来源" width="120" align="center">
          <template #default="scope">{{formatSourceType(scope.row.sourceType)}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template #default="scope">{{formatStatus(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单</el-button>
            <el-button
              size="small"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status===0">关闭订单</el-button>
            <el-button
              size="small"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status===1">订单发货</el-button>
            <el-button
              size="small"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status===2||scope.row.status===3">订单跟踪</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status===4">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
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
        v-model:current-page="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="关闭订单"
      v-model:visible="closeOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.content">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>

<style scoped>
  .input-width {
    width: 203px;
  }
</style>
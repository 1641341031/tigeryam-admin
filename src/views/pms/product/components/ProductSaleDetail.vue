<script setup>
import { computed } from "vue";
import {fetchList as fetchMemberLevelList} from '@/api/memberLevel.js'


const props = defineProps({
    value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
})
const { value } = props
const { isEdit } = props

console.log(value.promotionType)
console.log(typeof value.promotionType)

const pickerOptions1 = {
        disabledDate(time) {
        return time.getTime() < Date.now();
        }
}
const ini = () => {
    if (isEdit) {
        // handleEditCreated();
    } else {
        fetchMemberLevelList({defaultStatus: 0}).then(response => {
            const { data } = response.data
            let memberPriceList = [];
            for (let i = 0; i < data.length; i++) {
            let item = data[i];
            memberPriceList.push({memberLevelId: item.id, memberLevelName: item.name})
            }
            value.memberPriceList = memberPriceList;
        });
    }
}
ini()

const selectServiceList = computed({
    get() {
          let list = [];
          if (value.serviceIds === undefined || value.serviceIds == null || value.serviceIds === '') return list;
          let ids = value.serviceIds.split(',');
          for (let i = 0; i < ids.length; i++) {
            list.push(Number(ids[i]));
          }
          return list;
        },
        set(newValue) {
          let serviceIds = '';
          if (newValue != null && newValue.length > 0) {
            for (let i = 0; i < newValue.length; i++) {
              serviceIds += newValue[i] + ',';
            }
            if (serviceIds.endsWith(',')) {
              serviceIds = serviceIds.substr(0, serviceIds.length - 1)
            }
            value.serviceIds = serviceIds;
          } else {
            value.serviceIds = null;
          }
        }
})

const handleEditCreated = ()=>{
    let ids = value.serviceIds.split(',');
    // console.log('handleEditCreated', ids);
    for (let i = 0; i < ids.length; i++) {
        selectServiceList.push(Number(ids[i]));
    }
}

const handleRemoveProductLadder = (index, row)=>{
    let productLadderList = value.productLadderList;
    if (productLadderList.length === 1) {
        productLadderList.pop();
        productLadderList.push({
        count: 0,
        discount: 0,
        price: 0
        })
    } else {
        productLadderList.splice(index, 1);
    }
}

const handleAddProductLadder = (index, row)=>{
    let productLadderList = value.productLadderList;
    if (productLadderList.length < 3) {
        productLadderList.push({
        count: 0,
        discount: 0,
        price: 0
        })
    } else {
        ElMessage({
        message: '最多只能添加三条',
        type: 'warning'
        });
    }
}

const handleRemoveFullReduction = (index, row)=>{
    let fullReductionList = value.productFullReductionList;
    if (fullReductionList.length === 1) {
        fullReductionList.pop();
        fullReductionList.push({
        fullPrice: 0,
        reducePrice: 0
        });
    } else {
        fullReductionList.splice(index, 1);
    }
}

const handleAddFullReduction = (index, row) => {
    let fullReductionList = value.productFullReductionList;
    if (fullReductionList.length < 3) {
        fullReductionList.push({
        fullPrice: 0,
        reducePrice: 0
        });
    } else {
        ElMessage({
        message: '最多只能添加三条',
        type: 'warning'
        });
    }
}

const emit = defineEmits(['prevStep', 'nextStep'])
const handlePrev = () => {
    emit('prevStep')
}
const handleNext = ()=>{
    emit('nextStep')
}
const productSaleForm = ref(null)
</script>

<template>
    <div style="margin-top: 50px">
        <el-form :model="value" ref="productSaleForm" label-width="120px" class="form-inner-container" size="small">
            <el-form-item label="赠送积分：">
                <el-input v-model="value.giftPoint"></el-input>
            </el-form-item>
            <el-form-item label="赠送成长值：">
                <el-input v-model="value.giftGrowth"></el-input>
            </el-form-item>
            <el-form-item label="积分购买限制：">
                <el-input v-model="value.usePointLimit"></el-input>
            </el-form-item>
            <el-form-item label="预告商品：">
                <el-switch v-model="value.previewStatus" :active-value="1" :inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item label="商品上架：">
                <el-switch v-model="value.publishStatus" :active-value="1" :inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item label="商品推荐：">
                <span style="margin-right: 10px">新品</span>
                <el-switch v-model="value.newStatus" :active-value="1" :inactive-value="0">
                </el-switch>
                <span style="margin-left: 10px;margin-right: 10px">推荐</span>
                <el-switch v-model="value.recommandStatus" :active-value="1" :inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item label="服务保证：">
                <el-checkbox-group v-model="selectServiceList">
                <el-checkbox :label="1">无忧退货</el-checkbox>
                <el-checkbox :label="2">快速退款</el-checkbox>
                <el-checkbox :label="3">免费包邮</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="详细页标题：">
                <el-input v-model="value.detailTitle"></el-input>
            </el-form-item>
            <el-form-item label="详细页描述：">
                <el-input v-model="value.detailDesc"></el-input>
            </el-form-item>
            <el-form-item label="商品关键字：">
                <el-input v-model="value.keywords"></el-input>
            </el-form-item>
            <el-form-item label="商品备注：">
                <el-input v-model="value.note" type="textarea" :autoSize="true"></el-input>
            </el-form-item>
            <el-form-item label="选择优惠方式：">
                <el-radio-group v-model="value.promotionType" size="small">
                <el-radio-button :label="0">无优惠</el-radio-button>
                <el-radio-button :label="1">特惠促销</el-radio-button>
                <el-radio-button :label="2">会员价格</el-radio-button>
                <el-radio-button :label="3">阶梯价格</el-radio-button>
                <el-radio-button :label="4">满减价格</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="value.promotionType===1">
                <div>
                    开始时间：
                    <el-date-picker
                        v-model="value.promotionStartTime"
                        type="datetime"
                        :picker-options="pickerOptions1"
                        placeholder="选择开始时间">
                    </el-date-picker>
                </div>
                <div class="littleMargin">
                结束时间：
                <el-date-picker
                    v-model="value.promotionEndTime"
                    type="datetime"
                    :picker-options="pickerOptions1"
                    placeholder="选择结束时间">
                </el-date-picker>
                </div>
                <div class="littleMargin">
                促销价格：
                <el-input style="width: 220px" v-model="value.promotionPrice" placeholder="输入促销价格"></el-input>
                </div>

            </el-form-item>
            <el-form-item v-show="value.promotionType===2">
                <div v-for="(item, index) in value.memberPriceList" :key="index" :class="{littleMargin:index!==0}">
                {{item.memberLevelName}}：
                <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
                </div>
            </el-form-item>
            <el-form-item v-show="value.promotionType===3">
                <el-table :data="value.productLadderList"
                        style="width: 80%" border>
                <el-table-column
                    label="数量"
                    align="center"
                    width="120">
                    <template #default="scope">
                    <el-input v-model="scope.row.count"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="折扣"
                    align="center"
                    width="120">
                    <template #default="scope">
                    <el-input v-model="scope.row.discount"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template #default="scope">
                    <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
                    <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item v-show="value.promotionType===4">
                <el-table :data="value.productFullReductionList"
                        style="width: 80%" border>
                <el-table-column
                    label="满"
                    align="center"
                    width="120">
                    <template #default="scope">
                    <el-input v-model="scope.row.fullPrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="立减"
                    align="center"
                    width="120">
                    <template #default="scope">
                    <el-input v-model="scope.row.reducePrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template #default="scope">
                    <el-button type="text" @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
                    <el-button type="text" @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item style="text-align: center">
                <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
                <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
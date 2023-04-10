<script setup>
import { computed, watch, watchEffect } from "vue";
import { fetchList as fetchProductAttrCateList } from "@/api/productAttrCate.js";
import { fetchList as fetchProductAttrList } from "@/api/productAttr.js";

const props = defineProps({
  value: Object,
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const { value } = props;
const { isEdit } = props;

//编辑模式时是否初始化成功
const hasEditCreated = ref(false);
//商品属性分类下拉选项
const productAttributeCategoryOptions = ref([]);
//选中的商品属性
const selectProductAttr = ref([]);
//选中的商品参数
const selectProductParam = ref([]);
//选中的商品属性图片
const selectProductAttrPics = ref([]);
//可手动添加的商品属性
const addProductAttrValue = "";
//商品富文本详情激活类型
const activeHtmlName = "pc";

//是否有商品属性图片
const hasAttrPic = computed(() => {
  if (selectProductAttrPics.value.length < 1) {
    return false;
  }
  return true;
});

const handleEditCreated = () => {
  //根据商品属性分类id获取属性和参数
  if (value.productAttributeCategoryId != null) {
    handleProductAttrChange(value.productAttributeCategoryId);
  }
  hasEditCreated = true;
};

const handleProductAttrChange = (value) => {
  getProductAttrList(0, value);
  getProductAttrList(1, value);
};

//商品的编号
const productId = computed(() => {
  return value.id;
})

watch(productId, (newValue) => {
  if (!isEdit) return;
  if (hasEditCreated) return;
  if (newValue === undefined || newValue == null || newValue === 0) return;
  handleEditCreated();
});

const selectProductPics = computed({
  get: function () {
    let pics = [];
    if (value.pic === undefined || value.pic == null || value.pic === "") {
      return pics;
    }
    pics.push(value.pic);
    if (
      value.albumPics === undefined ||
      value.albumPics == null ||
      value.albumPics === ""
    ) {
      return pics;
    }
    let albumPics = value.albumPics.split(",");
    for (let i = 0; i < albumPics.length; i++) {
      pics.push(albumPics[i]);
    }
    return pics;
  },
  set: function (newValue) {
    if (newValue == null || newValue.length === 0) {
      value.pic = null;
      value.albumPics = null;
    } else {
      value.pic = newValue[0];
      value.albumPics = "";
      if (newValue.length > 1) {
        for (let i = 1; i < newValue.length; i++) {
          value.albumPics += newValue[i];
          if (i !== newValue.length - 1) {
            value.albumPics += ",";
          }
        }
      }
    }
  },
});

const getProductAttrCateList = () => {
  let param = { pageNum: 1, pageSize: 100 };
  fetchProductAttrCateList(param).then((response) => {
    productAttributeCategoryOptions.value = [];
    let list = response.data.data.list;
    for (let i = 0; i < list.length; i++) {
      productAttributeCategoryOptions.value.push({
        label: list[i].name,
        value: list[i].id,
      });
    }
  });
};
getProductAttrCateList();

const getProductAttrList = (type, cid) => {
  let param = { pageNum: 1, pageSize: 100, type: type };
  fetchProductAttrList(cid, param).then((response) => {
    let list = response.data.data.list;
    if (type === 0) {
      selectProductAttr.value = [];
      for (let i = 0; i < list.length; i++) {
        let options = [];
        let values = [];
        if (isEdit) {
          if (list[i].handAddStatus === 1) {
            //编辑状态下获取手动添加编辑属性
            options = getEditAttrOptions(list[i].id);
          }
          //编辑状态下获取选中属性
          values = getEditAttrValues(i);
        }
        selectProductAttr.value.push({
          id: list[i].id,
          name: list[i].name,
          handAddStatus: list[i].handAddStatus,
          inputList: list[i].inputList,
          values: values,
          options: options,
        });
      }
      if (isEdit) {
        //编辑模式下刷新商品属性图片
        refreshProductAttrPics();
      }
    } else {
      selectProductParam.value = [];
      for (let i = 0; i < list.length; i++) {
        let value = null;
        if (isEdit) {
          //编辑模式下获取参数属性
          value = getEditParamValue(list[i].id);
        }
        selectProductParam.value.push({
          id: list[i].id,
          name: list[i].name,
          value: value,
          inputType: list[i].inputType,
          inputList: list[i].inputList,
        });
      }
    }
  });
};

//获取设置的可手动添加属性值
const getEditAttrOptions = (id) => {
  let options = [];
  for (let i = 0; i < value.productAttributeValueList.length; i++) {
    let attrValue = value.productAttributeValueList[i];
    if (attrValue.productAttributeId === id) {
      let strArr = attrValue.value.split(",");
      for (let j = 0; j < strArr.length; j++) {
        options.push(strArr[j]);
      }
      break;
    }
  }
  return options;
};

//获取选中的属性值
const getEditAttrValues = (index) => {
  let values = new Set();
  if (index === 0) {
    for (let i = 0; i < value.skuStockList.length; i++) {
      let sku = value.skuStockList[i];
      let spData = JSON.parse(sku.spData);
      if (spData != null && spData.length >= 1) {
        values.add(spData[0].value);
      }
    }
  } else if (index === 1) {
    for (let i = 0; i < value.skuStockList.length; i++) {
      let sku = value.skuStockList[i];
      let spData = JSON.parse(sku.spData);
      if (spData != null && spData.length >= 2) {
        values.add(spData[1].value);
      }
    }
  } else {
    for (let i = 0; i < value.skuStockList.length; i++) {
      let sku = value.skuStockList[i];
      let spData = JSON.parse(sku.spData);
      if (spData != null && spData.length >= 3) {
        values.add(spData[2].value);
      }
    }
  }
  return Array.from(values);
};

//获取属性的值
const getEditParamValue = (id) => {
  for (let i = 0; i < value.productAttributeValueList.length; i++) {
    if (id === value.productAttributeValueList[i].productAttributeId) {
      return value.productAttributeValueList[i].value;
    }
  }
};

const handleAddProductAttrValue = (idx) => {
  let options = selectProductAttr.value[idx].options;
  if (addProductAttrValue == null || addProductAttrValue == "") {
    ElMessage({
      message: "属性值不能为空",
      type: "warning",
      duration: 1000,
    });
    return;
  }
  if (options.indexOf(addProductAttrValue) !== -1) {
    ElMessage({
      message: "属性值不能重复",
      type: "warning",
      duration: 1000,
    });
    return;
  }
  selectProductAttr.value[idx].options.push(addProductAttrValue);
  addProductAttrValue = null;
};

const handleRemoveProductAttrValue = (idx, index) => {
  selectProductAttr.value[idx].options.splice(index, 1);
};
const getProductSkuSp = (row, index) => {
  let spData = JSON.parse(row.spData);
  if (spData != null && index < spData.length) {
    return spData[index].value;
  } else {
    return null;
  }
};

const handleRefreshProductSkuList = () => {
  ElMessage("刷新列表将导致sku信息重新生成，是否要刷新", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    refreshProductAttrPics();
    refreshProductSkuList();
  });
};

const handleSyncProductSkuPrice = () => {
  ElMessage("将同步第一个sku的价格到所有sku,是否继续", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    if (value.skuStockList !== null && value.skuStockList.length > 0) {
      let tempSkuList = [];
      tempSkuList = tempSkuList.concat(tempSkuList, value.skuStockList);
      let price = value.skuStockList[0].price;
      for (let i = 0; i < tempSkuList.length; i++) {
        tempSkuList[i].price = price;
      }
      value.skuStockList = [];
      value.skuStockList = value.skuStockList.concat(
        value.skuStockList,
        tempSkuList
      );
    }
  });
};

const handleSyncProductSkuStock = () => {
  ElMessage("将同步第一个sku的库存到所有sku,是否继续", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    if (value.skuStockList !== null && value.skuStockList.length > 0) {
      let tempSkuList = [];
      tempSkuList = tempSkuList.concat(tempSkuList, value.skuStockList);
      let stock = value.skuStockList[0].stock;
      let lowStock = value.skuStockList[0].lowStock;
      for (let i = 0; i < tempSkuList.length; i++) {
        tempSkuList[i].stock = stock;
        tempSkuList[i].lowStock = lowStock;
      }
      value.skuStockList = [];
      value.skuStockList = value.skuStockList.concat(
        value.skuStockList,
        tempSkuList
      );
    }
  });
};

const refreshProductSkuList = () => {
  value.skuStockList = [];
  let skuList = value.skuStockList;
  //只有一个属性时
  if (selectProductAttr.value.length === 1) {
    let attr = selectProductAttr.value[0];
    for (let i = 0; i < attr.values.length; i++) {
      skuList.push({
        spData: JSON.stringify([{ key: attr.name, value: attr.values[i] }]),
      });
    }
  } else if (selectProductAttr.value.length === 2) {
    let attr0 = selectProductAttr.value[0];
    let attr1 = selectProductAttr.value[1];
    for (let i = 0; i < attr0.values.length; i++) {
      if (attr1.values.length === 0) {
        skuList.push({
          spData: JSON.stringify([{ key: attr0.name, value: attr0.values[i] }]),
        });
        continue;
      }
      for (let j = 0; j < attr1.values.length; j++) {
        let spData = [];
        spData.push({ key: attr0.name, value: attr0.values[i] });
        spData.push({ key: attr1.name, value: attr1.values[j] });
        skuList.push({
          spData: JSON.stringify(spData),
        });
      }
    }
  } else {
    let attr0 = selectProductAttr.value[0];
    let attr1 = selectProductAttr.value[1];
    let attr2 = selectProductAttr.value[2];
    for (let i = 0; i < attr0.values.length; i++) {
      if (attr1.values.length === 0) {
        skuList.push({
          spData: JSON.stringify([{ key: attr0.name, value: attr0.values[i] }]),
        });
        continue;
      }
      for (let j = 0; j < attr1.values.length; j++) {
        if (attr2.values.length === 0) {
          let spData = [];
          spData.push({ key: attr0.name, value: attr0.values[i] });
          spData.push({ key: attr1.name, value: attr1.values[j] });
          skuList.push({
            spData: JSON.stringify(spData),
          });
          continue;
        }
        for (let k = 0; k < attr2.values.length; k++) {
          let spData = [];
          spData.push({ key: attr0.name, value: attr0.values[i] });
          spData.push({ key: attr1.name, value: attr1.values[j] });
          spData.push({ key: attr2.name, value: attr2.values[k] });
          skuList.push({
            spData: JSON.stringify(spData),
          });
        }
      }
    }
  }
};

const refreshProductAttrPics = () => {
  selectProductAttrPics = [];
  if (selectProductAttr.value.length >= 1) {
    let values = selectProductAttr.value[0].values;
    for (let i = 0; i < values.length; i++) {
      let pic = null;
      if (isEdit) {
        //编辑状态下获取图片
        pic = getProductSkuPic(values[i]);
      }
      selectProductAttrPics.push({ name: values[i], pic: pic });
    }
  }
};

//获取商品相关属性的图片
const getProductSkuPic = (name) => {
  for (let i = 0; i < value.skuStockList.length; i++) {
    let spData = JSON.parse(value.skuStockList[i].spData);
    if (name === spData[0].value) {
      return this.value.skuStockList[i].pic;
    }
  }
  return null;
};

//合并商品属性
const mergeProductAttrValue = () => {
  value.productAttributeValueList = [];
  for (let i = 0; i < selectProductAttr.value.length; i++) {
    let attr = selectProductAttr.value[i];
    if (
      attr.handAddStatus === 1 &&
      attr.options != null &&
      attr.options.length > 0
    ) {
      value.productAttributeValueList.push({
        productAttributeId: attr.id,
        value: getOptionStr(attr.options),
      });
    }
  }
  for (let i = 0; i < selectProductParam.length; i++) {
    let param = selectProductParam[i];
    value.productAttributeValueList.push({
      productAttributeId: param.id,
      value: param.value,
    });
  }
};

//合并商品属性图片
const mergeProductAttrPics = () => {
  for (let i = 0; i < selectProductAttrPics.length; i++) {
    for (let j = 0; j < value.skuStockList.length; j++) {
      let spData = JSON.parse(value.skuStockList[j].spData);
      if (spData[0].value === selectProductAttrPics[i].name) {
        value.skuStockList[j].pic = selectProductAttrPics[i].pic;
      }
    }
  }
};

const getOptionStr = (arr) => {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str += arr[i];
    if (i != arr.length - 1) {
      str += ",";
    }
  }
  return str;
};

const handleRemoveProductSku = (index, row) => {
  let list = value.skuStockList;
  if (list.length === 1) {
    list.pop();
  } else {
    list.splice(index, 1);
  }
};

const getParamInputList = (inputList) => {
  return inputList.split(",");
};

const emit = defineEmits(["prevStep", "nextStep"]);
const handlePrev = () => {
  emit("prevStep");
};

const handleNext = () => {
  mergeProductAttrValue();
  mergeProductAttrPics();
  emit("nextStep");
};
</script>

<template>
  <div style="margin-top: 50px">
    <el-form
      :model="value"
      ref="productAttrForm"
      label-width="120px"
      class="form-inner-container"
      size="small"
    >
      <el-form-item label="属性类型：">
        <el-select
          v-model="value.productAttributeCategoryId"
          placeholder="请选择属性类型"
          @change="handleProductAttrChange"
        >
          <el-option
            v-for="item in productAttributeCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr, idx) in selectProductAttr" :key="idx">
            {{ productAttr.name }}：
            <el-checkbox-group
              v-if="productAttr.handAddStatus === 0"
              v-model="selectProductAttr[idx].values"
            >
              <el-checkbox
                v-for="item in getInputListArr(productAttr.inputList)"
                :label="item"
                :key="item"
                class="littleMarginLeft"
              ></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div
                  v-for="(item, index) in selectProductAttr[idx].options"
                  style="display: inline-block"
                  class="littleMarginLeft"
                  :key="index"
                >
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button
                    type="text"
                    class="littleMarginLeft"
                    @click="handleRemoveProductAttrValue(idx, index)"
                    >删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input
                v-model="addProductAttrValue"
                style="width: 160px; margin-left: 10px"
                clearable
              ></el-input>
              <el-button
                class="littleMarginLeft"
                @click="handleAddProductAttrValue(idx)"
                >增加</el-button
              >
            </div>
          </div>
        </el-card>
        <el-table
          style="width: 100%; margin-top: 20px"
          :data="value.skuStockList"
          border
        >
          <el-table-column
            v-for="(item, index) in selectProductAttr"
            :label="item.name"
            :key="item.id"
            align="center"
          >
            <template #default="scope">
              {{ getProductSkuSp(scope.row, index) }}
            </template>
          </el-table-column>
          <el-table-column label="销售价格" width="100" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="促销价格" width="100" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.promotionPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="80" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存预警值" width="80" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="SKU编号" width="160" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="scope">
              <el-button
                type="text"
                @click="handleRemoveProductSku(scope.$index, scope.row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshProductSkuList"
          >刷新列表
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuPrice"
          >同步价格
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuStock"
          >同步库存
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, index) in selectProductAttrPics" :key="index">
            <span>{{ item.name }}:</span>
            <single-upload
              v-model="item.pic"
              style="width: 300px; display: inline-block; margin-left: 10px"
            ></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div
            v-for="(item, index) in selectProductParam"
            :class="{ littleMarginTop: index !== 0 }"
            :key="index"
          >
            <div class="paramInputLabel">{{ item.name }}:</div>
            <el-select
              v-if="item.inputType === 1"
              class="paramInput"
              v-model="selectProductParam[index].value"
            >
              <el-option
                v-for="item in getParamInputList(item.inputList)"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-input
              v-else
              class="paramInput"
              v-model="selectProductParam[index].value"
            ></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="商品详情：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce
              :width="595"
              :height="300"
              v-model="value.detailHtml"
            ></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce
              :width="595"
              :height="300"
              v-model="value.detailMobileHtml"
            ></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev"
          >上一步，填写商品促销</el-button
        >
        <el-button type="primary" size="medium" @click="handleNext"
          >下一步，选择商品关联</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
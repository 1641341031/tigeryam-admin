<script setup>
import {fetchListAll as fetchSubjectList} from '@/api/subject.js'
import {fetchList as fetchPrefrenceAreaList} from '@/api/prefrenceArea.js'
import { computed } from 'vue'

const props = defineProps({
    value: Object,
    isEdit: {
        type: Boolean,
        default: false
      }
})

const {value} = props
const {isEdit} = props

//所有专题列表
const subjectList = ref([])
//专题左右标题
const subjectTitles = ['待选择', '已选择']
//所有专题列表
const prefrenceAreaList = ref([])
//专题左右标题
const prefrenceAreaTitles = ['待选择', '已选择']

const getSubjectList = ()=>{
    fetchSubjectList().then(response => {
        let list = response.data.data;
        for (let i = 0; i < list.length; i++) {
        subjectList.value.push({
            label: list[i].title,
            key: list[i].id
        });
        }
    });
}
getSubjectList()

const getPrefrenceAreaList = ()=>{
    fetchPrefrenceAreaList().then(response=>{
        let list = response.data.data;
        for (let i = 0; i < list.length; i++) {
        prefrenceAreaList.value.push({
            label: list[i].name,
            key: list[i].id
        });
        }
    });
}

//选中的专题
const selectSubject = computed({
    get:function () {
          let subjects =[];
          if(value.subjectProductRelationList==null||value.subjectProductRelationList.length<=0){
            return subjects;
          }
          for(let i=0;i<value.subjectProductRelationList.length;i++){
            subjects.push(value.subjectProductRelationList[i].subjectId);
          }
          return subjects;
        },
        set:function (newValue) {
          value.subjectProductRelationList=[];
          for(let i=0;i<newValue.length;i++){
            value.subjectProductRelationList.push({subjectId:newValue[i]});
          }
        }
})

const selectPrefrenceArea = computed({
    get:function () {
          let prefrenceAreas =[];
          if( value.prefrenceAreaProductRelationList==null|| value.prefrenceAreaProductRelationList.length<=0){
            return prefrenceAreas;
          }
          for(let i=0;i< value.prefrenceAreaProductRelationList.length;i++){
            prefrenceAreas.push( value.prefrenceAreaProductRelationList[i].prefrenceAreaId);
          }
          return prefrenceAreas;
        },
        set:function (newValue) {
           value.prefrenceAreaProductRelationList=[];
          for(let i=0;i<newValue.length;i++){
             value.prefrenceAreaProductRelationList.push({prefrenceAreaId:newValue[i]});
          }
        }
})

const filterMethod = (query, item) => {
    return item.label.indexOf(query) > -1;
}

const emit = defineEmits(['prevStep'],'finishCommit')
const handlePrev = ()=>{
        emit('prevStep')
      }
const handleFinishCommit = ()=>{
        emit('finishCommit',isEdit);
      }
</script>


<template>
    <div style="margin-top: 50px">
        <el-form :model="value"
             ref="productRelationForm"
             label-width="120px"
             class="form-inner-container"
             size="small">
      <el-form-item label="关联专题：">
        <el-transfer
          style="display: inline-block"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入专题名称"
          v-model="selectSubject"
          :titles="subjectTitles"
          :data="subjectList">
        </el-transfer>
      </el-form-item>
      <el-form-item label="关联优选：">
        <el-transfer
          style="display: inline-block"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入优选名称"
          v-model="selectPrefrenceArea"
          :titles="prefrenceAreaTitles"
          :data="prefrenceAreaList">
        </el-transfer>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品属性</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>
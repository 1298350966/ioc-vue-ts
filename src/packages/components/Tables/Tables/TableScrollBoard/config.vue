<template>
<el-collapse>
  <CollapseItem name="列表" :expanded="true">
    <SettingItemBox name="基础">
      <SettingItem name="表行数">
        <el-input-number
          v-model="optionData.rowNum"
          :min="1"
          size="small"
          placeholder="请输入自动计算"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="轮播时间(s)">
        <el-input-number
          v-model="optionData.waitTime"
          :min="1"
          size="small"
          placeholder="请输入轮播时间"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="表头高度">
        <el-input-number
          v-model="optionData.headerHeight"
          :min="1"
          size="small"
          placeholder="请输入表头高度"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="显示行号">
        <el-switch size="small" v-model="optionData.index" />
      </SettingItem>
      
    </SettingItemBox>

    <SettingItemBox name="配置" :alone="true">
      <SettingItem name="表头数据">
        <el-input
          v-model="header"
          :min="1"
          size="small"
          placeholder="表头数据(英文','分割)"
        ></el-input>
      </SettingItem>
      <SettingItem name="列对齐方式">
        <el-input
          v-model="align"
          :min="1"
          size="small"
          placeholder="对齐方式(英文','分割)"
        ></el-input>
      </SettingItem>
      <SettingItem name="列宽度">
        <el-input
          v-model="columnWidth"
          :min="1"
          size="small"
          placeholder="列宽度(英文','分割)"
        ></el-input>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox name="样式">
      <SettingItem name="表头背景色">
        <el-color-picker
          size="small"
          v-model="optionData.headerBGC"
          show-alpha
        ></el-color-picker>
      </SettingItem>
      <SettingItem name="奇数行背景色">
        <el-color-picker
          size="small"
          v-model="optionData.oddRowBGC"
          show-alpha
        ></el-color-picker>
      </SettingItem>
      <SettingItem name="偶数行背景色">
        <el-color-picker
          size="small"
          v-model="optionData.evenRowBGC"
          show-alpha
        ></el-color-picker>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</el-collapse>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
})

const header = ref(props.optionData.header.toString())
const align = ref(props.optionData.align.toString())
const columnWidth = ref(props.optionData.columnWidth.toString())

watch([header, align, columnWidth],([headerNew,alignNew,columnWidthNew],[headerOld,alignOld,columnWidthOld])=>{
  if(headerNew !== headerOld){
    props.optionData.header = headerNew.split(',')
  }
  if(alignNew !== alignOld){
    props.optionData.align = alignNew.split(',')
  }
  if(columnWidthNew !== columnWidthOld){
    // @ts-ignore
    props.optionData.columnWidth = columnWidthNew.split(',')
  }
})


</script>

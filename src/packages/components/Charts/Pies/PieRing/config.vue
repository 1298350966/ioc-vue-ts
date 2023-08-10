<template>
  <el-collapse>
  <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData"></global-setting>
    <CollapseItem name="饼图配置(series)" :expanded="true">
      <SettingItemBox name="类型">
        <SettingItem>
          <el-select-v2 v-model="optionData.type" size="small" :options="fontWeightOptions" />
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="圆心坐标">
          <el-input-number v-model="centerX" size="small"></el-input-number>
          <el-input-number v-model="centerY" size="small"></el-input-number>
     </SettingItemBox>
     <SettingItemBox name="半径">
        <template v-if="optionData.type == PieTypeObject[PieTypeEnum.RING]">
          <el-input-number v-model="radiusX" size="small"></el-input-number>
          <el-input-number v-model="radiusY" size="small"></el-input-number>
        </template>
        <el-input-number v-else v-model="radius" size="small"></el-input-number>
     </SettingItemBox>
     <seriesConfig :series="series"></seriesConfig>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, watch,computed } from 'vue'
import { GlobalSetting, CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { PieTypeObject, PieTypeEnum,option } from './config'
import seriesConfig from "../common/seriesConfig.vue"

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
const fontWeightOptions = [
  {
    label: PieTypeEnum.NORMAL,
    value: PieTypeObject[PieTypeEnum.NORMAL]
  },
  {
    label: PieTypeEnum.RING,
    value: PieTypeObject[PieTypeEnum.RING]
  },
  {
    label: PieTypeEnum.ROSE,
    value: PieTypeObject[PieTypeEnum.ROSE]
  }
]
const series = computed(()=>{
  return props.optionData.series[0] 
})

const centerX = computed({
  get(){
    return getNumber(series.value.center[0])
  },
  set(val){
    series.value.center[0] = val + "%"
  }
})
const centerY = computed({
  get(){
    return getNumber(series.value.center[1] || "")
  },
  set(val){
    series.value.center[1] = val + "%"
  }
})

function getNumber(str:string){
  return str.replace(/[^0-9]/ig,"")
}

const radiusX = computed({
  get(){
    return getNumber(series.value.radius[0] || "")
  },
  set(val){
    series.value.radius[0] = val + "%"
  }
})

const radiusY = computed({
  get(){
    return getNumber(series.value.radius[1] || "")
  },
  set(val){
    series.value.radius[1] = val + "%"
  }
})

const radius= computed({
  get(){
    if(!Array.isArray(series.value.radius)){
      return  getNumber(series.value.radius as unknown as string || "")
    }
    return 0
  },
  set(val){
    (series.value.radius as unknown as string) = val + "%"
  }
})

</script>

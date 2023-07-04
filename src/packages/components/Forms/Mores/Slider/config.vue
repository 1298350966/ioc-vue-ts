<template>
  <el-collapse>
    <collapse-item name="配置" :expanded="true">
      <template v-if="!optionData.attrs.range">
        <setting-item-box name="默认值"  :alone="true">
          <setting-item>
            <el-input-number v-model="optionData.modelValue as number" size="small"></el-input-number>
          </setting-item>
        </setting-item-box>
      </template>
    <template v-if="optionData.attrs.range">
      <setting-item-box name="默认值">
        <setting-item name="起始值">
          <el-input-number v-model="optionData.modelValue[0]" size="small"></el-input-number>
        </setting-item>
        <setting-item name="终止值">
          <el-input-number v-model="optionData.modelValue[1]" size="small"></el-input-number>
        </setting-item>
      </setting-item-box>
    </template>
      <setting-item-box name="范围">
        <setting-item name="最小值">
          <el-input-number v-model="optionData.attrs.min" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
        <setting-item name="最大值">
          <el-input-number v-model="optionData.attrs.max" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box>
        <setting-item name="步长">
          <el-input-number v-model="optionData.attrs.step" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
      </setting-item-box>

      <setting-item-box name="提示语">
        <setting-item name="是否显示提示信息">
          <el-switch v-model="optionData.attrs.showTooltip" />
        </setting-item>
        <setting-item name="提示语位置" v-if="optionData.attrs.showTooltip">
          <el-select-v2 v-model="optionData.attrs.placement" size="small" :options="placementOptions" />
        </setting-item>
      </setting-item-box>
      
      <setting-item-box name="模式" :alone="true">
        <setting-item name="是否开启垂直模式" >
          <el-switch v-model="optionData.attrs.vertical" />
        </setting-item>
        <setting-item name="滑块高度(垂直模式下必填)">
          <el-input v-model="optionData.attrs.height" size="small" />
        </setting-item>
      </setting-item-box>

      <setting-item-box name="开关">
        <setting-item name="是否禁用">
          <el-switch v-model="optionData.attrs.disabled" />
        </setting-item>
        <setting-item name="是否显示间断点">
          <el-switch v-model="optionData.attrs.showStops" />
        </setting-item>
        <setting-item name="是否开启选择范围">
          <el-switch v-model="optionData.attrs.range" />
        </setting-item>
      </setting-item-box>
    </collapse-item>

    <collapse-item name="样式" :expanded="true">
      <setting-item-box name="控件尺寸"  :alone="true">
          <setting-item>
            <el-select-v2 v-model="optionData.attrs.size" size="small" :options="sizeOptions" />
          </setting-item>
      </setting-item-box>
      <setting-item-box name="颜色">
          <setting-item name="已划过颜色">
              <el-color-picker
                  size="small"
                  :modes="['hex']"
                  v-model="optionData.style.mainBgColor"
                  show-alpha
              ></el-color-picker>
          </setting-item>
          <setting-item name="未划过颜色">
              <el-color-picker
                  size="small"
                  :modes="['hex']"
                  v-model="optionData.style.runwayBgColor"
                  show-alpha
              ></el-color-picker>
          </setting-item>
      </setting-item-box>
    </collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref,PropType } from 'vue'
import { option } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

watch(()=>props.optionData.attrs.range,(val,oldVal)=>{
  if(val){  //范围模式:绑定值为数组类型
    props.optionData.modelValue = [0,50];
  }else{  //绑定值为数字类型
    props.optionData.modelValue = 50;
  }},
  {immediate:true}
)

const sizeOptions = [
  { label: '小号', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大号', value: 'large' }
]

const placementOptions = [
  {label:'top',value:'top'},
  {label:'top-start',value:'top-start'},
  {label:'top-end',value:'top-end'},
  {label:'bottom',value:'bottom'},
  {label:'bottom-start',value:'bottom-start'},
  {label:'bottom-end',value:'bottom-end'},
  {label:'left',value:'left'},
  {label:'left-start',value:'left-start'},
  {label:'left-end',value:'left-end'},
  {label:'right',value:'right'},
  {label:'right-start',value:'right-start'},
  {label:'right-end',value:'right-end'}
]
</script>

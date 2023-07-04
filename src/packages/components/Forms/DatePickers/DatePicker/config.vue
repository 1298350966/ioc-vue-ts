<template>
  <el-collapse>
    <collapse-item name="配置" :expanded="true">
        <setting-item-box name="默认值" :alone="true">
          <el-date-picker
            v-model="(optionData.modelValue as any)"
            :type="(optionData.attrs.type as any)"
            placeholder="请选择时间"
            startPlaceholder="请选择开始时间"
            endPlaceholder="请选择结束时间"
            size="small"
          />

        </setting-item-box>
        <setting-item-box name="控件类型" :alone="true">
            <setting-item>
                <el-select-v2 v-model="optionData.attrs.type" size="small" :options="typeOptions" />
            </setting-item>
        </setting-item-box>

        <setting-item-box name="占位文本" v-if="componentType === 'pointer'" :alone="true">
            <setting-item> 
                <el-input v-model="optionData.attrs.placeholder" size="small"></el-input>
            </setting-item>
        </setting-item-box>
        <setting-item-box name="文本" v-if="componentType === 'range'"  :alone="true">
            <setting-item name="开始占位文本">
                <el-input v-model="optionData.attrs.startPlaceholder" size="small"></el-input>
            </setting-item>
            <setting-item name="结束占位文本">
                <el-input v-model="optionData.attrs.endPlaceholder" size="small"></el-input>
            </setting-item>
            <setting-item name="分隔符">
                <el-input v-model="optionData.attrs.rangeSeparator" size="small"></el-input>
            </setting-item>
        </setting-item-box>

        <setting-item-box name="格式" :alone="true">
          <setting-item name="显示值的格式">
                <el-input v-model="optionData.attrs.format" size="small"></el-input>
            </setting-item>
            <setting-item>
              <template #name>
                <span>绑定值的格式</span>
                <el-tooltip content="不指定则绑定值为 Date 对象" placement="top" effect="dark">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </template>
                <el-input v-model="optionData.attrs.valueFormat" size="small"></el-input>
            </setting-item>
        </setting-item-box>
        
       
      <setting-item-box name="开关">
        <setting-item name="是否只读">
          <el-switch v-model="optionData.attrs.readonly" size="small"/>
        </setting-item>
        <setting-item name="是否禁用">
          <el-switch v-model="optionData.attrs.disabled" size="small"/>
        </setting-item>
        <setting-item name="文本框是否可输入">
          <el-switch v-model="optionData.attrs.editable" size="small"/>
        </setting-item>
        <setting-item name="是否显示清除按钮">
          <el-switch v-model="optionData.attrs.clearable" size="small"/>
        </setting-item>
      </setting-item-box>
    </collapse-item>

    <collapse-item name="样式" :expanded="true">
      <setting-item-box name="控件尺寸" :alone="true">
        <setting-item>
          <el-select-v2 v-model="optionData.attrs.size" size="small" :options="sizeOptions" />
        </setting-item>
      </setting-item-box>
      <input-style-setting v-model:styleOptions = "optionData.style" />
      <!-- <setting-item-box name="颜色">
        <setting-item name="边框颜色">
          <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="optionData.style.borderColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="聚焦时边框颜色">
          <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="optionData.style.focusBorderColr"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="文字颜色">
          <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="optionData.style.textColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="背景色">
          <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="optionData.style.bgColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
      </setting-item-box> -->
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
import{ InputStyleSetting }from '@/components/Pages/FormItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const sizeOptions = [
  { label: '小号', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大号', value: 'large' }
]
const typeOptions = [ //type:pointer单个时间点类型；range时间范围类型
  { label: '年份', value: 'year',type:'pointer' },
  { label: '月份', value: 'month',type:'pointer' },
  { label: '日期', value: 'date',type:'pointer' },
  { label: '日期（多选）', value: 'dates',type:'pointer' },
  { label: '日期时间', value: 'datetime',type:'pointer' },
  { label: '周', value: 'week',type:'pointer' },
  { label: '日期时间范围', value: 'datetimerange',type:'range' },
  { label: '日期范围', value: 'daterange',type:'range' },
  { label: '月份范围', value: 'monthrange',type:'range' },
]

//时间控件类型（单点时间/范围时间）
const componentType = ref('pointer')
watch(()=>props.optionData.attrs.type,(val,oldVal)=>{
  
  let index = typeOptions.findIndex(item=>{
    return item.value === val
  })
  componentType.value = typeOptions[index].type;
  //清空当前控件绑定值
  if(componentType.value === 'pointer'){
    props.optionData.modelValue = null;
  }else{
    props.optionData.modelValue = [null,null];
  }
},{immediate:true})
</script>

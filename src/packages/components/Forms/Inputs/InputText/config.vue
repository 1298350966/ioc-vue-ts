<template>
  <el-collapse>
    <collapse-item name="配置" :expanded="true">
    <setting-item-box name="默认值"  :alone="true">
      <setting-item>
        <el-input v-model="props.optionData.modelValue" size="small"></el-input>
      </setting-item>
    </setting-item-box>
     <setting-item-box name="占位文本"  :alone="true">
      <setting-item>
        <el-input v-model="props.optionData.attrs.placeholder" size="small"></el-input>
      </setting-item>
     </setting-item-box>
      <setting-item-box name="长度">
        <setting-item name="最大输入长度">
          <el-input-number v-model="props.optionData.attrs.maxlength" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
        <setting-item name="最小输入长度">
          <el-input-number v-model="props.optionData.attrs.minlength" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="开关">
        <setting-item name="是否显示清除按钮">
          <el-switch v-model="props.optionData.attrs.clearable" size="small"/>
        </setting-item>
        <setting-item name="是否禁用">
          <el-switch v-model="props.optionData.attrs.disabled" size="small"/>
        </setting-item>
      </setting-item-box>
    </collapse-item>

    <collapse-item name="样式" :expanded="true">
      <setting-item-box name="控件尺寸"  :alone="true">
          <setting-item>
            <el-select-v2 v-model="props.optionData.attrs.size" size="small" :options="sizeOptions" />
          </setting-item>
      </setting-item-box>
      <input-style-setting v-model:styleOptions = "optionData.style" />
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
</script>

<template>
    <el-collapse>
        <collapse-item name="配置" :expanded="true">
            <setting-item-box>
                <setting-item name="默认值">
                    <el-switch v-model="optionData.modelValue"  size="small"/>
                </setting-item>
                <setting-item name="是否禁用">
                    <el-switch v-model="optionData.attrs.disabled"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box name="描述" :alone="true">
                <setting-item name="开启状态的文字描述">
                    <el-input v-model="optionData.attrs.activeText"  size="small"/>
                </setting-item>
                <setting-item name="关闭状态的文字描述">
                    <el-input v-model="optionData.attrs.inactiveText"  size="small"/>
                </setting-item>
            </setting-item-box>
        </collapse-item>
        <collapse-item name="样式" :expanded="true">
            <setting-item-box name="控件大小" :alone="true">
                <setting-item>
                    <el-select-v2 v-model="optionData.attrs.size" size="small" :options="sizeOptions" />
                </setting-item>
            </setting-item-box>
            <setting-item-box>
                <setting-item  name="开启状态按钮颜色">
                    <el-color-picker
                        size="small"
                        :modes="['hex']"
                        v-model="optionData.attrs.activeColor"
                        show-alpha
                    ></el-color-picker>
                </setting-item>
                <setting-item name="关闭状态按钮颜色">
                    <el-color-picker
                        size="small"
                        :modes="['hex']"
                        v-model="optionData.attrs.inactiveColor"
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

const sizeOptions = [
  { label: '小号', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大号', value: 'large' }
]

</script>

<style scoped>

</style>
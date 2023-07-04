<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
<el-collapse>
  <collapse-item name="视频" expanded>
    <setting-item-box name="源" alone>
      <setting-item name="自定义源">
        <el-input v-model="optionData.dataset" size="small"></el-input>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="控制">
      <setting-item>
        <el-checkbox v-model:checked="optionData.loop" size="small">循环播放</el-checkbox>
      </setting-item>
      <setting-item>
        <el-checkbox v-model:checked="optionData.muted" size="small">静音</el-checkbox>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="样式">
      <setting-item name="类型">
        <el-select-v2 v-model="optionData.fit" size="small" :options="fitList"></el-select-v2>
      </setting-item>
    </setting-item-box>
  </collapse-item>
</el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option } from './config'
// import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'

// 适应类型
const fitList = [
  {
    value: 'fill',
    label: 'fill'
  },
  {
    value: 'contain',
    label: 'contain'
  },
  {
    value: 'cover',
    label: 'cover'
  },
  {
    value: 'scale-down',
    label: 'scale-down'
  },
  {
    value: 'none',
    label: 'none'
  }
]

defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

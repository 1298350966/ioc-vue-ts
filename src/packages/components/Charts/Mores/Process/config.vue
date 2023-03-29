<template>
  <el-collapse>
    <!-- 默认展开 -->
    <CollapseItem name="进度条" :expanded="true">
      <SettingItemBox name="内容">
        <SettingItem name="数值">
          <!-- 与 config.ts 里的 option 对应 --><!-- el-input-number 是 NaiveUI 的控件 -->
          <el-input-number v-model="optionData.dataset" size="small" :min="0" placeholder="进度值"></el-input-number>
        </SettingItem>
        <setting-item name="单位">
          <el-input v-model="optionData.unit" size="small"></el-input>
        </setting-item>
      </SettingItemBox>

      <SettingItemBox name="轨道">
        <SettingItem name="形状">
          <el-select-v2 v-model="optionData.type" :options="types" placeholder="选择形状" />
        </SettingItem>

        <!-- 颜色粗细等等... -->
        <SettingItem name="进度条颜色">
          <el-color-picker size="small" :modes="['hex']" v-model="optionData.color"></el-color-picker>
        </SettingItem>
        <SettingItem name="轨道颜色">
          <el-color-picker size="small" :modes="['hex']" v-model="optionData.railColor"></el-color-picker>
        </SettingItem>
        <setting-item name="偏移角度" v-if="optionData.type !== types[0].value">
          <el-input-number v-model="optionData.offsetDegree" size="small"></el-input-number>
        </setting-item>
        <SettingItem v-if="optionData.type == types[0].value">
          <el-space>
            <el-switch v-model="optionData.processing" size="small" />
            <el-text>进行时动画</el-text>
          </el-space>
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="指标">
        <SettingItem name="位置" v-if="optionData.type == types[0].value">
          <el-select v-model="optionData.indicatorPlacement" :options="indicatorPlacements" placeholder="选择形状" />
        </SettingItem>
        <SettingItem name="文本颜色">
          <el-color-picker size="small" :modes="['hex']" v-model="optionData.indicatorTextColor"></el-color-picker>
        </SettingItem>
        <setting-item name="文本大小">
          <el-input-number v-model="optionData.indicatorTextSize" size="small"></el-input-number>
        </setting-item>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
// 以下是封装的设置模块布局组件，具体效果可在官网查看
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'

// 获取 option 的数据，便于使用 typeof 获取类型
import { option, types, indicatorPlacements } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

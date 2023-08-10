<template>
  <el-collapse>
    <!-- 遍历 seriesList -->
    <CollapseItem v-for="(item, index) in config.series" :key="index" :name="`圆环`" :expanded="true">
      <SettingItemBox name="数据">
        <SettingItem name="数值">
          <el-input-number v-model="config.dataset" :min="0" :max="1" :step="0.01" size="small" placeholder="数值">
          </el-input-number>
        </SettingItem>
      </SettingItemBox>
      <!-- Echarts 全局设置 -->
      <SettingItemBox name="进度条">
        <SettingItem name="颜色">
          <el-color-picker size="small" v-model="item.data[0].itemStyle.color" show-alpha></el-color-picker>
        </SettingItem>
        <SettingItem name="阴影模糊等级">
          <el-input-number
            v-model="item.data[0].itemStyle.shadowBlur"
            :min="0"
            :max="50"
            :step="1"
            size="small"
            placeholder="阴影模糊等级"
          >
          </el-input-number>
        </SettingItem>
        <SettingItem name="阴影颜色">
          <el-color-picker
            size="small"
            v-model="item.data[0].itemStyle.shadowColor"
            show-alpha
          ></el-color-picker>
        </SettingItem>
      </SettingItemBox>
      <!-- 中心标题 -->
      <SettingItemBox v-if="config.title" name="标题">
        <SettingItem name="颜色">
          <el-color-picker size="small" v-model="config.title.textStyle.color" show-alpha></el-color-picker>
        </SettingItem>
        <SettingItem name="字体大小">
          <el-input-number
            v-model="config.title.textStyle.fontSize"
            :min="0"
            :step="1"
            size="small"
            placeholder="字体大小"
          >
          </el-input-number>
        </SettingItem>
      </SettingItemBox>
      <!-- 其他样式 -->
      <SettingItemBox name="轨道样式">
        <SettingItem name="颜色">
          <el-color-picker size="small" v-model="item.data[1].itemStyle.color" show-alpha></el-color-picker>
        </SettingItem>
        <SettingItem name="阴影模糊等级">
          <el-input-number
            v-model="item.data[1].itemStyle.shadowBlur"
            :min="0"
            :step="1"
            size="small"
            placeholder="阴影模糊等级"
          >
          </el-input-number>
        </SettingItem>
        <SettingItem name="阴影颜色">
          <el-color-picker
            size="small"
            v-model="item.data[1].itemStyle.shadowColor"
            show-alpha
          ></el-color-picker>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
// 以下是封装的设置模块布局组件，具体效果可在官网查看
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { GlobalThemeJsonType } from '@/settings/chartThemes'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const config = computed<GlobalThemeJsonType>(() => {
  return props.optionData
})
</script>

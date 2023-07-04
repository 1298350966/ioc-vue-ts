<template>
  <el-collapse>
    <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData"> </global-setting>
    <!-- 漏斗图 -->
    <collapse-item v-for="(item, index) in seriesList" :key="index" :name="`漏斗图`" expanded>
      <setting-item-box name="排序" alone>
        <setting-item>
          <el-select-v2 v-model="item.sort" :options="FunnelOrderEnumList" size="small"/>
        </setting-item>
      </setting-item-box>

      <SettingItemBox name="范围" :alone="true">
        <setting-item :name="`顶部距离：${item.top}px`">
          <el-slider v-model="item.top" :min="0" :max="300" :format-tooltip="sliderFormatTooltip"></el-slider>
        </setting-item>
      </SettingItemBox>

      <setting-item-box name="区块">
        <setting-item name="边框大小">
          <el-input-number v-model="item.itemStyle.borderWidth" :min="0" :max="10" size="small" />
        </setting-item>
        <setting-item name="边框颜色">
          <el-color-picker v-model="item.itemStyle.borderColor" size="small" show-alpha/>
        </setting-item>
        <setting-item name="间隔">
          <el-input-number v-model="item.gap" :min="0" :max="20" size="small" />
        </setting-item>
      </setting-item-box>

      <setting-item-box name="标签">
        <setting-item name="是否显示">
          <el-checkbox v-model:checked="item.label.show" size="small">标签</el-checkbox>
        </setting-item>
        <setting-item name="位置">
          <el-select-v2 v-model="item.label.position" :options="FunnelLabelPositionEnumList" size="small" />
        </setting-item>
        <setting-item name="大小">
          <el-input-number v-model="item.label.fontSize" :min="0" size="small" />
        </setting-item>
        <setting-item name="悬停时大小">
          <el-input-number v-model="item.emphasis.label.fontSize" :min="0" size="small" />
        </setting-item>
      </setting-item-box>
    </collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { GlobalSetting, CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { option, FunnelOrderEnumList, FunnelLabelPositionEnumList } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option & GlobalThemeJsonType>,
    required: true
  }
})

const seriesList = computed(() => {
  return props.optionData.series
})

const sliderFormatTooltip = (v: number) => {
  return `${v}px`
}
</script>

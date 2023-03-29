<template>
  <el-collapse>
    <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData" :iel-chart="true"></global-setting>

    <CollapseItem :name="`散点-${index + 1}`" expanded v-for="(item, index) in optionData.series" :key="index">
      <SettingItemBox name="样式">
        <SettingItem name="类型">
          <el-select-v2 v-model="item.type" size="small" :options="ScatterEffectTypeEnumList" placeholder="选择" />
        </SettingItem>
        <SettingItem name="大小">
          <el-input-number v-model="item.symbolSize" size="small" :min="1"></el-input-number>
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="标域">
        <SettingItem name="粗细(0不显示)">
          <el-input-number v-model="item.markArea.itemStyle.borderWidth" size="small" :min="0"></el-input-number>
        </SettingItem>
        <SettingItem name="符号">
          <el-select-v2
            v-model="item.markArea.itemStyle.borderType"
            size="small"
            :options="axisConfig.splitLint.lineStyle.type"
            placeholder="选择"
          />
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="标点">
        <SettingItem name="形状">
          <el-select-v2 v-model="item.markPoint.symbol" size="small" :options="SymbolEnumList" placeholder="选择" />
        </SettingItem>
        <SettingItem name="大小">
          <el-input-number v-model="item.markPoint.symbolSize" size="small" :min="0"></el-input-number>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { GlobalSetting, CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { ScatterEffectTypeEnumList, SymbolEnumList } from '../shard'
import { axisConfig } from '@/packages/chartConfiguration/echarts/index'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType & typeof option>,
    required: true
  }
})
</script>

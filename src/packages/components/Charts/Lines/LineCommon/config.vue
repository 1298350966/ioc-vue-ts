<template>
  <el-collapse v-model="collapseActiveList">
    <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData"></global-setting>
    <CollapseItem v-for="(item, index) in seriesList" :key="index" :name="`折线图-${index + 1}`" :expanded="true">
      <template #header>
        <div class="title-container">
          <span>折线图-{{ index + 1 }}</span>
          <div>
            <el-icon @click.stop="handleCopy(item, index)">
              <Plus />
            </el-icon>
            <el-icon @click.stop="handleDelete(item, index)">
              <Minus />
            </el-icon>
          </div>
        </div>
      </template>
      <SettingItemBox name="线条">
        <SettingItem name="宽度">
          <el-input-number v-model="item.lineStyle.width" :min="1" :max="100" size="small"
            placeholder="自动计算"></el-input-number>
        </SettingItem>
        <SettingItem name="类型">
          <el-select-v2 v-model="item.lineStyle.type" size="small" :options="lineConf.lineStyle.type">
          </el-select-v2>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import { lineConf } from '@/packages/chartConfiguration/echarts/index'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import {
  GlobalSetting,
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import { cloneDeep } from 'lodash'
import { seriesItem } from './config'

const collapseActiveList = ref([])

const props = defineProps<{
  optionData: GlobalThemeJsonType
}>()

const seriesList = computed(() => {
  return props.optionData.series
})

function handleCopy(item, index) {
  // 更新目标图标配置项dataset.dimensions、dataset.source、series
  props.optionData.series.push(cloneDeep(seriesItem))
  let list = props.optionData.series.map((series, index) => {
    return props.optionData.dataset.dimensions[index + 1] || ("data" + (index + 1))
  })
  props.optionData.dataset.dimensions = [props.optionData.dataset.dimensions[0], ...list]
}
function handleDelete(item, index) {
  if (props.optionData.series.length === 1) {
    return window['$message'].error('至少保留一项数据！')
  }
  // 更新目标图标配置项dataset.dimensions、dataset.source、series
  props.optionData.series.splice(index, 1)
  let list = props.optionData.series.map((series, index) => {
    return props.optionData.dataset.dimensions[index + 1] || ("data" + (index + 1))
  })
  props.optionData.dataset.dimensions = [props.optionData.dataset.dimensions[0], ...list]
}
</script>
<style lang="scss" scoped>
.title-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 15px;

  :deep(.el-icon) {
    margin-left: 10px;
  }
}
</style>

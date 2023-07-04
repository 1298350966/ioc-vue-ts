<template>
  <el-collapse v-model="collapseActive">
    <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData"></global-setting>
    <el-collapse-item v-for="(item, index) in series" :key="index" :title="`柱状图-${index + 1}`" :name="index">
      <template #title>
        <div class="title-container">
          <span>{{item.name}}</span>
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
      <SettingItem name="组名称" alone>
          <el-input  v-model="item.name"></el-input>
      </SettingItem>
      <SettingItem name="是否展开" alone>
        <el-switch v-model="item.show"></el-switch>
      </SettingItem>
      <SettingItem name="选择项">
        <template #name>
          <el-icon class="cursor-pointer" @click.stop="seriesItemOptionsCopy(item)">
              <Plus />
           </el-icon>
        </template>
        <el-table class="mt-1" :data="item.options" border size="small">
          <el-table-column label="名称">
            <template #default="{row}">
              <el-input v-model="row.name" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column  label="默认值" width="60px" align="center">
            <template #default="{row}">
              <el-switch v-model="row.value" size="small"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60px" align="center">
            <template #default="{row,$index}">
              <!-- <el-icon  class="mr-7px" @click.stop="seriesItemOptionsDelete(row, index)">
                <Minus />
              </el-icon> -->
              <el-button size="small" type="danger" link @click.stop="seriesItemOptionsDelete(item.options, $index)">删除</el-button>
            </template>

          </el-table-column>
        </el-table>
        <!-- <div class="optionsBox" >
          <div class=" flex gap-10px mb-1 items-center" v-for="(option, index) in item.options" :key="index">
            <el-input v-model="option.name"></el-input>
            <el-icon class="mr-7px" @click.stop="seriesItemOptionsDelete(item.options, index)">
              <Minus />
            </el-icon>
          </div>    
        </div> -->
      </SettingItem>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import {
  GlobalSetting,
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { seriesItem, seriesItemOptions } from './config'
import { cloneDeep } from 'lodash'
const collapseActive = ref([])

const props = defineProps<{
  optionData: GlobalThemeJsonType
}>()

const {series} = toRefs(props.optionData)
function handleCopy(item, index) {
  let seriesOptions = cloneDeep(seriesItem)
  seriesOptions.name = "组" + series.value.length
  seriesOptions.options[0].name = seriesOptions.name + "控制"
  props.optionData.series.push(seriesOptions)
}
function handleDelete(item, index) {
  if (props.optionData.series.length === 1) {
    return window['$message'].error('至少保留一项数据！')
  }
  // 更新目标图表配置项dataset.dimensions、dataset.source、series
  props.optionData.series.splice(index, 1)

}
function seriesItemOptionsCopy(item) {
  let seriesOptions = cloneDeep(seriesItemOptions)
  seriesOptions.name = item.name + "控制" + item.options.length
  item.options.push(seriesOptions)
}

function seriesItemOptionsDelete(options,index) {
  options.splice(index, 1)
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

.g-2-50px {
  display: grid;
  grid-template-columns: 1fr 1fr 50px;
}

</style>
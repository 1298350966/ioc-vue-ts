<template>
  <!-- 组件配置 -->
  <el-divider />
  <setting-item-box
    :itemRightStyle="{
      gridTemplateColumns: '6fr 2fr'
    }"
    style="padding-right: 25px"
  >
    <template #name>
      地址
    </template>
    <setting-item name="请求方式 & URL 地址">
        <el-input class="input-with-select" v-model.trim="requestUrl" :min="1" placeholder="请输入地址（去除前置URL）">
          <template #prefix>
            <span>{{ requestOriginUrl }}</span>
            <el-divider direction="vertical"/>
          </template>
          <template #prepend>
            <!-- <el-select-v2 class="select-type-options" v-model="requestHttpType" :options="selectTypeOptions" /> -->
            <el-select v-model="requestHttpType"  class="select-type-options">
              <el-option v-for="(item, index) in selectTypeOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-input>
      <!-- 组件url -->
    </setting-item>
    <setting-item name="更新间隔，为 0 只会初始化">
      <el-space>
        <el-input-number
          v-model.trim="requestInterval"
          class="select-time-number"
          :min="0"
          placeholder="默认使用全局数据"
        >
        </el-input-number>
        <!-- 单位 -->
        <el-select-v2 class="select-time-options" v-model="requestIntervalUnit" :options="selectTimeOptions" />
      </el-space>
    </setting-item>
  </setting-item-box>
  <setting-item-box alone name="选择方式" class="go-mt-0">
    <request-header :targetDataRequest="targetDataRequest"></request-header>
  </setting-item-box>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { selectTypeOptions, selectTimeOptions } from '@/views/chart/ContentConfigurations/components/ChartData/index.d'
import { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { RequestHeader } from '../RequestHeader'
import { isDev } from '@/utils'
import { icon } from '@/plugins'
import {
  chartDataUrl,
  chartSingleDataUrl,
  rankListUrl,
  scrollBoardUrl,
  numberFloatUrl,
  numberIntUrl,
  textUrl,
  imageUrl,
  radarUrl,
  heatMapUrl,
  scatterBasicUrl,
  mapUrl,
  capsuleUrl,
  wordCloudUrl,
  treemapUrl,
  threeEarth01Url
} from '@/api/mock'

const props = defineProps({
  targetDataRequest: Object as PropType<RequestConfigType>
})

const { HelpOutlineIcon } = icon.ionicons5
const { chartEditStore } = useTargetData()
const { requestOriginUrl } = toRefs(chartEditStore.getRequestGlobalConfig)
const { requestInterval, requestIntervalUnit, requestHttpType, requestUrl } = toRefs(
  props.targetDataRequest as RequestConfigType
)

const apiList = [
  {
    value: `【图表】${chartDataUrl}`
  },
  {
    value: `【单数据图表】${chartSingleDataUrl}`
  },
  {
    value: `【文本】${textUrl}`
  },
  {
    value: `【0~100 整数】${numberIntUrl}`
  },
  {
    value: `【0~1小数】${numberFloatUrl}`
  },
  {
    value: `【图片地址】${imageUrl}`
  },
  {
    value: `【排名列表】${rankListUrl}`
  },
  {
    value: `【滚动表格】${scrollBoardUrl}`
  },
  {
    value: `【雷达】${radarUrl}`
  },
  {
    value: `【热力图】${heatMapUrl}`
  },
  {
    value: `【基础散点图】${scatterBasicUrl}`
  },
  {
    value: `【地图数据】${mapUrl}`
  },
  {
    value: `【胶囊柱图】${capsuleUrl}`
  },
  {
    value: `【词云】${wordCloudUrl}`
  },
  {
    value: `【树图】${treemapUrl}`
  },
  {
    value: `【三维地球】${threeEarth01Url}`
  }
]
</script>

<style lang="scss" scoped>
.select-time-number {
  width: 100%;
}
.select-time-options {
  width: 100px;
}
.select-type-options {
  width: 120px;
}

// :deep(.el-input-group__prepend){
//   background-color: var(--el-fill-color-blank);
//   padding: 0;
// }
</style>

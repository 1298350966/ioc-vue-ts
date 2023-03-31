<template>
  <!-- 全局配置 -->
  <el-card class="n-card-shallow">
    <el-tag type="info" :bordered="false" style="border-radius: 5px"> 全局公共配置 </el-tag>
    <setting-item-box
      name="服务"
      :itemRightStyle="{
        gridTemplateColumns: '5fr 2fr 1fr'
      }"
    >
      <!-- 源地址 -->
      <setting-item name="前置 URL">
        <el-input v-model.trim="requestOriginUrl" :disabled="editDisabled" placeholder="例：http://127.0.0.1/"></el-input>
      </setting-item>
      <setting-item name="更新间隔，为 0 只会初始化">
        <el-space>
          <el-input-number
            class="select-time-number"
            v-model.trim="requestInterval"
            :min="0"
            :show-button="false"
            :disabled="editDisabled"
            placeholder="请输入数字"
          >
          </el-input-number>
          <!-- 单位 -->
          <el-select-v2
            class="select-time-options"
            v-model="requestIntervalUnit"
            :options="selectTimeOptions"
            :disabled="editDisabled"
          />
        </el-space>
      </setting-item>
      <el-button v-show="editDisabled" type="primary" ghost @click="editDisabled = false">
        <template #icon>
          <n-icon>
            <pencil-icon />
          </n-icon>
        </template>
        编辑配置
      </el-button>
    </setting-item-box>
    <!-- table 内容体 -->
    <el-collapse-transition >
      <div :show="showTable">
        <request-global-header-table :editDisabled="editDisabled"></request-global-header-table>
      </div>
    </el-collapse-transition>
    <!-- 箭头 -->
    <div v-if="showTable" class="go-flex-center go-mt-3 down" @click="showTable = false">
      <el-icon size="32">
        <chevron-up-outline-icon />
      </el-icon>
    </div>
    <div v-else class="go-flex-center go-mt-3 down" @click="showTable = true">
      <el-tooltip content="展开" placement="top" :keep-alive-on-hover="false">
          <el-icon size="32">
            <chevron-down-outline-icon />
          </el-icon>
      </el-tooltip>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, toRefs, computed } from 'vue'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { selectTypeOptions, selectTimeOptions } from '@/views/chart/ContentConfigurations/components/ChartData/index.d'
import { RequestGlobalHeaderTable } from '../RequestGlobalHeaderTable'
import { icon } from '@/plugins'

const { PencilIcon, ChevronDownOutlineIcon, ChevronUpOutlineIcon } = icon.ionicons5
const { chartEditStore } = useTargetData()
const { requestOriginUrl, requestInterval, requestIntervalUnit } = toRefs(chartEditStore.getRequestGlobalConfig)
const editDisabled = ref(true)

const designStore = useDesignStore()

const showTable = ref(false)
// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})
</script>

<style lang="scss" scoped>
.n-card-shallow {
  &:hover {
    border-color: v-bind('themeColor');
  }
}
.down {
  cursor: pointer;
  &:hover {
    color: v-bind('themeColor');
  }
}
.select-time-number {
  width: 100%;
}
.select-time-options {
  width: 100px;
}
</style>

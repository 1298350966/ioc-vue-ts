<template>
  <!-- 侧边栏和数据分发处理 -->
  <div class="kh-chart-common">
    <charts-menu 
      class="charts-menu-2" 
      :options="packages.menuOptions" 
      @menuItemClick="clickItemHandle">
    </charts-menu>
  
    <el-scrollbar  class="chart-content-list">
      <charts-item-box class="" :menuOptions="packages.selectOptions"></charts-item-box>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue'
import { ConfigType } from '@/packages/index.d'
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { loadAsyncComponent } from '@/utils'
import {ChartsMenu} from "../ChartsMenu/index"
const ChartsItemBox = loadAsyncComponent(() => import('../ChartsItemBox/index.vue'))

const props = defineProps({
  selectOptions: {
    type: Object,
    default: () => {}
  }
})

// 隐藏设置
const settingStore = useSettingStore()

const hidePackageOneCategory = computed(() => {
  if (packages.categorysNum > 2) return true
  return !settingStore.getHidePackageOneCategory
})

let packages = reactive<{
  [T: string]: any
}>({
  // 侧边栏
  menuOptions: [],
  // 当前选择
  selectOptions: {},
  // 分类归档
  categorys: {
    all: []
  },
  categoryNames: {
    all: '所有'
  },
  // 分类归档数量
  categorysNum: 0,
  // 存储不同类别组件进来的选中值
  saveSelectOptions: {}
})

const selectValue = ref<string>()

// 设置初始列表
const setSelectOptions = (categorys: any) => {
  for (const val in categorys) {
    packages.selectOptions = categorys[val]
    break
  }
}

watch(
  // @ts-ignore
  () => props.selectOptions,
  (newData: { list: ConfigType[] }) => {
    packages.categorysNum = 0
    if (!newData) return
    newData.list.forEach((e: ConfigType) => {
      const value: ConfigType[] = (packages.categorys as any)[e.category]
      // @ts-ignore
      packages.categorys[e.category] = value && value.length ? [...value, e] : [e]
      packages.categoryNames[e.category] = e.categoryName
      packages.categorys['all'].push(e)
    })
    for (const val in packages.categorys) {
      packages.categorysNum += 1
      packages.menuOptions.push({
        key: val,
        label: packages.categoryNames[val]
      })
    }
    setSelectOptions(packages.categorys)
    // 默认选中处理
    selectValue.value = packages.menuOptions[0]['key']
  },
  {
    immediate: true
  }
)

// 处理点击事件
const clickItemHandle = (key: string) => {
  packages.selectOptions = packages.categorys[key]
}
</script>

<style lang="scss" scoped>
/* 此高度与 ContentBox 组件关联*/
$topHeight: 40px;
$menuWidth: 65px;
.kh-chart-common{
  display: flex;
  .chart-content-list {
    flex: 1;
    padding-top: 10px;
    box-sizing: border-box;
    background-color: var(--bg-color-1);
  }
}
.charts-menu-2{
    width:65px;
    height:100%;
    margin-top:1px;
    background:var(--bg-color-2);
    box-sizing: border-box;
   }
</style>

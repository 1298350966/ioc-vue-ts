<template>
  <el-collapse>
    <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData"></global-setting>
    <CollapseItem name="地图" :expanded="true">
      <SettingItemBox name="地图区域">
        <SettingItem name="默认中国">
          <el-select-v2
            size="small"
            v-model="mapRegion.adcode"
            :options="mapRegionOptions"
            value-field="adcode"
            label-field="name"
          />
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="区域颜色" :alone="true">
        <SettingItem name="0%处颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="seriesList[1].itemStyle.areaColor.colorStops[0].color"
          ></el-color-picker>
        </SettingItem>
        <SettingItem name="100%处颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="seriesList[1].itemStyle.areaColor.colorStops[1].color"
          ></el-color-picker>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="阴影">
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="seriesList[1].itemStyle.shadowColor"
          ></el-color-picker>
        </SettingItem>
        <SettingItem name="模糊程度">
          <el-input-number
            v-model="seriesList[1].itemStyle.shadowBlur"
            :min="0"
            size="small"
            placeholder="请输入模糊程度"
          ></el-input-number>
        </SettingItem>
        <SettingItem name="水平偏移">
          <el-input-number
            v-model="seriesList[1].itemStyle.shadowOffsetX"
            size="small"
            placeholder="请输入水平偏移大小"
          ></el-input-number>
        </SettingItem>
        <SettingItem name="垂直偏移">
          <el-input-number
            v-model="seriesList[1].itemStyle.shadowOffsetY"
            size="small"
            placeholder="请输入垂直偏移大小"
          ></el-input-number>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="聚焦 （预览可见）">
        <setting-item name="禁用">
          <el-space>
            <el-switch v-model="seriesList[1].emphasis.disabled" size="small"></el-switch>
          </el-space>
        </setting-item>
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="seriesList[1].emphasis.itemStyle.areaColor"
          ></el-color-picker>
        </SettingItem>
        <SettingItem name="阴影">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="seriesList[1].emphasis.itemStyle.shadowColor"
          ></el-color-picker>
        </SettingItem>
        <SettingItem name="边框大小">
          <el-input-number
            v-model="seriesList[1].emphasis.itemStyle.borderWidth"
            :min="1"
            size="small"
            placeholder="请输入边框大小"
          ></el-input-number>
        </SettingItem>
        <SettingItem name="文字颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="seriesList[1].emphasis.label.color"
          ></el-color-picker>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="边框">
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="seriesList[1].itemStyle.borderColor"
          ></el-color-picker>
        </SettingItem>
        <SettingItem name="大小">
          <el-input-number
            v-model="seriesList[1].itemStyle.borderWidth"
            :min="1"
            size="small"
            placeholder="请输入边框大小"
          ></el-input-number>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="其他" v-if="mapRegion.adcode === 'china'">
        <SettingItem>
          <el-checkbox v-model:checked="mapRegion.showHainanIsLands" size="small">显示南海群岛</el-checkbox>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
    <CollapseItem name="标记" :expanded="true">
      <SettingItemBox name="样式">
        <SettingItem name="大小">
          <el-input-number v-model="seriesList[0].symbolSize" size="small" :min="0"></el-input-number>
        </SettingItem>
        <SettingItem name="颜色">
          <el-color-picker size="small" :modes="['hex']" v-model="seriesList[0].itemStyle.color"></el-color-picker>
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="涟漪">
        <SettingItem name="涟漪大小">
          <el-input-number
            v-model="seriesList[0].rippleEffect.scale"
            :min="1"
            size="small"
            placeholder="请输入涟漪大小"
          ></el-input-number>
        </SettingItem>
        <SettingItem name="涟漪颜色">
          <el-color-picker size="small" :modes="['hex']" v-model="seriesList[0].rippleEffect.color"></el-color-picker>
        </SettingItem>
        <SettingItem name="涟漪的绘制方式">
          <el-select size="small" v-model="seriesList[0].rippleEffect.brushType" :options="rippleEffectOptions" />
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
// import { GlobalSetting } from '@/components/Pages/ChartItemSetting'
import { ref } from 'vue'
import mapChinaJson from './mapGeojson/china.json'

const mapRegionOptions = ref([
  {
    adcode: 'china',
    name: '中国'
  }
])

const rippleEffectOptions = ref([
  {
    value: 'fill',
    label: '实心'
  },
  {
    value: 'stroke',
    label: '空心'
  }
])

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const initMapRegionOptions = () => {
  mapChinaJson.features.forEach((element: any) => {
    if (element.properties.name) {
      mapRegionOptions.value.push({ ...element.properties })
    }
  })
}
initMapRegionOptions()

const seriesList = computed(() => {
  return props.optionData.series
})

const mapRegion = computed(() => {
  return props.optionData.mapRegion
})
</script>

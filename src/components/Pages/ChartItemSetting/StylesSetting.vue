<template>
  <div v-show="isGroup">
    <el-divider n-divider style="margin: 10px 0"></el-divider>
    <el-tag type="warning"> 解散分组「  {{ isCanvas ? '滤镜' : '滤镜 / 变换' }} 」也将消失!</el-tag>
  </div>

  <el-collapse-item :name="isCanvas ? '滤镜' : '滤镜 / 变换'">
    <template #title>
      <el-space class="kh-flex-between flex-1">
        <span>{{ isCanvas ? '滤镜' : '滤镜 / 变换' }}</span>
        <el-switch @click.stop v-model="chartStyles.filterShow" size="small"></el-switch>
      </el-space>
    </template>
    <setting-item-box name="色相" :alone="true">
      <setting-item :name="`值：${chartStyles.hueRotate}deg`">
        <!-- 透明度 -->
        <el-slider
          v-model="chartStyles.hueRotate"
          :step="3"
          :min="0"
          :max="360"
          :format-tooltip="degFormatTooltip"
        ></el-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="饱和度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.saturate)) * 100).toFixed(0)}%`">
        <!-- 透明度 -->
        <el-slider
          v-model="chartStyles.saturate"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></el-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="对比度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.contrast)) * 100).toFixed(0)}%`">
        <!-- 透明度 -->
        <el-slider
          v-model="chartStyles.contrast"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></el-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="亮度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.brightness)) * 100).toFixed(0)}%`">
        <!-- 透明度 -->
        <el-slider
          v-model="chartStyles.brightness"
          :step="0.1"
          :min="0"
          :max="2"
          :format-tooltip="sliderFormatTooltip"
        ></el-slider>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="透明度" :alone="true">
      <setting-item :name="`值：${(parseFloat(String(chartStyles.opacity)) * 100).toFixed(0)}%`">
        <!-- 透明度 -->
        <el-slider
          v-model="chartStyles.opacity"
          :step="0.1"
          :min="0"
          :max="1"
          :format-tooltip="sliderFormatTooltip"
        ></el-slider>
      </setting-item>
    </setting-item-box>

    <!-- 变换 -->
    <setting-item-box v-if="!isCanvas" name="旋转°">
      <setting-item name="Z轴(平面) - 旋转">
        <!-- 透明度 -->
        <el-input-number
          v-model="chartStyles.rotateZ"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></el-input-number>
      </setting-item>
      <setting-item name="X轴 - 旋转">
        <!-- 透明度 -->
        <el-input-number
          v-model="chartStyles.rotateX"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></el-input-number>
      </setting-item>
      <setting-item name="Y轴 - 旋转">
        <!-- 透明度 -->
        <el-input-number
          v-model="chartStyles.rotateY"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></el-input-number>
      </setting-item>
    </setting-item-box>

    <!-- 倾斜 -->
    <setting-item-box v-if="!isCanvas" name="倾斜°">
      <setting-item name="X轴 - 倾斜">
        <el-input-number
          v-model="chartStyles.skewX"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></el-input-number>
      </setting-item>
      <setting-item name="Y轴 - 倾斜">
        <el-input-number
          v-model="chartStyles.skewY"
          :min="0"
          :max="360"
          size="small"
          placeholder="角度"
        ></el-input-number>
      </setting-item>
    </setting-item-box>

    <!-- 提示 -->
    <el-tag type="warning"> 若预览时大屏模糊，可以尝试关闭滤镜进行修复 </el-tag>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { PickCreateComponentType } from '@/packages/index.d'
import { SettingItemBox, SettingItem} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  isGroup: {
    type: Boolean,
    required: false
  },
  isCanvas: {
    type: Boolean,
    default: false
  },
  chartStyles: {
    type: Object as PropType<Omit<PickCreateComponentType<'styles'>, 'animations'>>,
    required: true
  }
})

// 百分比格式化persen
const sliderFormatTooltip = (v: string) => {
  // @ts-ignore
  return `${(parseFloat(v) * 100).toFixed(0)}%`
}
// 角度格式化
const degFormatTooltip = (v: string) => {
  // @ts-ignore
  return `${v}deg`
}
</script>

<style lang="scss" scoped></style>

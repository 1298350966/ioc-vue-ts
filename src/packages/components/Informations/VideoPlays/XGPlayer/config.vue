<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
<el-collapse>
  <collapse-item name="视频" expanded>
    <setting-item-box name="源" alone>
      <setting-item name="播放格式">
        <el-radio-group v-model="optionData.type" size="small">
          <el-radio v-for="(type, index) in VideoFormatEnum" :key="index" :label="type"></el-radio>
        </el-radio-group>
      </setting-item>
      <setting-item name="是否直播" v-if="optionData.type != VideoFormatEnum.MP4">
        <el-switch v-model="optionData.isLive" ></el-switch>
      </setting-item>
      <setting-item name="播放地址">
        <el-input v-model="optionData.url" size="small"></el-input>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="控制">
      <setting-item>
        <el-checkbox v-model="optionData.autoplay" size="small">自动播放</el-checkbox>
      </setting-item>
      <setting-item>
        <el-checkbox v-model="optionData.muted" size="small">静音</el-checkbox>
      </setting-item>
      <!-- <setting-item>
        <el-checkbox v-model="optionData.controls.autoHide" size="small">控制栏</el-checkbox>
      </setting-item>
      <setting-item>
        <el-checkbox v-model="optionData.controls.initShow" size="small">控制栏</el-checkbox>
      </setting-item> -->
    </setting-item-box>

    <setting-item-box name="样式">
      <!-- <setting-item name="类型">
        <el-select-v2 v-model="optionData.fit" size="small" :options="fitList"></el-select-v2>
      </setting-item> -->
    </setting-item-box>
  </collapse-item>
</el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { VideoFormatEnum, option } from './config'
// import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'

// 适应类型
const fitList = [
  {
    value: 'fill',
    label: 'fill'
  },
  {
    value: 'contain',
    label: 'contain'
  },
  {
    value: 'cover',
    label: 'cover'
  },
  {
    value: 'scale-down',
    label: 'scale-down'
  },
  {
    value: 'none',
    label: 'none'
  }
]


const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

watch(()=>props.optionData.type ,(newVl)=>{
   if(newVl == VideoFormatEnum.MP4){
    props.optionData.isLive= false
   }
})
</script>

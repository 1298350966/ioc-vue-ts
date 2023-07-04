<template>
  <el-collapse>
    <CollapseItem name="标题" :expanded="true">
      <SettingItemBox name="内容" :alone="true">
        <el-input
          size="small"
          v-model="optionData.borderTitle"
          :minlength="1"
          type="text"
          placeholder="请输入标题内容"
        />
      </SettingItemBox>

      <SettingItemBox name="样式">
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            v-model="optionData.borderTitleColor"
            show-alpha
          ></el-color-picker>
        </SettingItem>
        <SettingItem name="文字大小">
          <el-input-number
            size="small"
            v-model="optionData.borderTitleSize"
            :min="12"
          />
        </SettingItem>
        <SettingItem name="高度">
          <el-input-number
            size="small"
            v-model="optionData.borderTitleHeight"
            :min="24"
          />
        </SettingItem>
        <SettingItem name="宽度">
          <el-input-number
            size="small"
            v-model="optionData.borderTitleWidth"
            :min="50"
            :step="10"
          />
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>

    <CollapseItem name="边框" :expanded="true">
      <SettingItemBox
        :name="`颜色-${index + 1}`"
        v-for="(item, index) in optionData.colors"
        :key="index"
      >
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            v-model="optionData.colors[index]"
            show-alpha
          ></el-color-picker>
        </SettingItem>
        <SettingItem>
          <el-button
            size="small"
            @click="optionData.colors[index] = option.colors[index]"
          >
            恢复默认
          </el-button>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>

    <CollapseItem name="背景" :expanded="true">
      <SettingItemBox name="颜色">
        <SettingItem>
          <el-color-picker
            size="small"
            v-model="optionData.backgroundColor"
            show-alpha
          ></el-color-picker>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>

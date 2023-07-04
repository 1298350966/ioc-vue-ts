<template>
  <el-collapse>
    <collapse-item name="配置" :expanded="true">
    <setting-item-box name="组件"  :alone="true">
      <setting-item>
        <el-input v-model="optionData.is" size="small">
          <template #append>
            <el-button icon="Tools" @click="componentSelectShow = true " />
          </template>
        </el-input>
        <componentSelect v-model:show="componentSelectShow" @select="componentSelectFun"></componentSelect>
      </setting-item>
      </setting-item-box>
      </collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref,PropType } from 'vue'
import { option } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import { CreateComponentType } from '@/packages/index.d'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  },
  targetData:{
    type: Object as PropType<CreateComponentType>,
  }
})

const componentSelectShow = ref(false)

function componentSelectFun(data){
  props.optionData.is = ""
  nextTick(() => {
    props.optionData.is = data.componentName
  });
  props.targetData.data = data.props
}
</script>

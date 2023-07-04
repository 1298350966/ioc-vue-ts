<template>
  <el-collapse>
    <collapse-item name="配置" :expanded="true">
      <setting-item-box name="默认值" :alone="true">
        <setting-item>
          <el-select-v2 v-model="optionData.modelValue" size="small" :options="optionList" clearable></el-select-v2>
        </setting-item>
      </setting-item-box>
      <setting-item-box>
        <setting-item name="是否禁用">
          <el-switch v-model="optionData.attrs.disabled" />
        </setting-item>
        <setting-item name="是否显示边框">
          <el-switch v-model="optionData.attrs.border" />
        </setting-item>
      </setting-item-box>
    </collapse-item>

    <!-- <collapse-item  
        v-for="(item, index) in optionList"
        :key="index"
        :name="`单选框-${index + 1}`" 
    >
    </collapse-item> -->

    <collapse-item name="样式" :expanded="true">
      <setting-item-box name="控件尺寸" :alone="true">
        <setting-item>
          <el-select-v2 v-model="optionData.attrs.size" size="small" :options="sizeOptions" />
        </setting-item>
      </setting-item-box>
      <input-style-setting v-model:styleOptions = "optionData.style" />
    </collapse-item>

    <template v-for="(item,index) in optionData.listOptions" :key="index">
      <collapse-item :name="'选项-'+`${index+1}`">
        <template #header>
            <div class="title-container">
            <span>选项-{{index + 1}}</span>
            <div>
                <el-icon @click.stop="handleCopy(item,index)"><Plus /></el-icon>
                <el-icon @click.stop="handleDelete(item,index)"><Minus /></el-icon>
            </div>
            </div>
        </template>
        <setting-item-box name="映射">
            <setting-item name="绑定字段">
                <el-input size="small" v-model="item.label"></el-input>
            </setting-item>
            <setting-item name="绑定值">
                <el-input size="small" v-model="item.value"></el-input>
            </setting-item>
        </setting-item-box>
      </collapse-item>
    </template>
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
import{ InputStyleSetting }from '@/components/Pages/FormItemSetting'
import defaultItemConfig from './defaultItemConfig.json'


const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

//增加选项
function handleCopy(item,index){
    let colsLength = props.optionData.listOptions.length;
    let {config} = defaultItemConfig;
    let newItemObj = Object.assign(
        {},
        config,
        {
          value:String(colsLength+1),
          label:config.label+(colsLength+1)
        }
    )
    props.optionData.listOptions.push(newItemObj)
}
// 删除选项
function handleDelete(item,index){
  props.optionData.listOptions.splice(index,1);
}
const optionList = computed(() => {
  return props.optionData.listOptions
})

const sizeOptions = [
  { label: '小号', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大号', value: 'large' }
]
</script>
<style scoped lang="scss">
.title-container{
  display:flex;
  justify-content:space-between;
  width:100%;
  padding-right: 15px;

  :deep(.el-icon){
    margin-left: 10px;
  }
}
</style>
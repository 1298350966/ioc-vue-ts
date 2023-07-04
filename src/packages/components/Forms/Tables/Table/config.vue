<template>
    <el-collapse>
        <collapse-item name="配置" :expanded="true">
            <setting-item-box name="高度边框">
                <setting-item name="表格高度（px）">
                    <el-input-number v-model="optionData.attrs.height"  size="small"/>
                </setting-item>
                <setting-item name="表格最大高度（px）">
                    <el-input-number v-model="optionData.attrs.maxHeight"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box >
                <setting-item name="是否设置边框">
                    <el-switch v-model="optionData.attrs.border"  size="small"/>
                </setting-item>
                <setting-item name="是否设置斑马纹">
                    <el-switch v-model="optionData.attrs.stripe"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box>
                <setting-item name="是否高亮当前行">
                    <el-switch v-model="optionData.attrs.highlightCurrentRow"  size="small"/>
                </setting-item>
                <setting-item name="tooltip 主题">
                    <el-select-v2 v-model="optionData.attrs.tooltipEffect" size="small" :options="tooltipEffectOptions" />
                </setting-item>
            </setting-item-box>
            <setting-item-box name="rowKey" :alone="true">
                <setting-item>
                    <el-input v-model="optionData.attrs.rowKey"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box name="空白描述" :alone="true">
                <setting-item>
                    <el-input v-model="optionData.attrs.emptyText"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box name="是否排序" :alone="true">
                <setting-item>
                    <el-switch v-model="optionData.extAttrs.isShowSelection"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box name="是否多选" :alone="true">
                <setting-item>
                    <el-switch v-model="optionData.extAttrs.isShowIndex"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box name="是否分页" :alone="true">
                <setting-item>
                    <el-switch v-model="optionData.extAttrs.isPaging"  size="small"/>
                </setting-item>
            </setting-item-box>
            <setting-item-box name="分页设置"  v-if="optionData.extAttrs.isPaging">
                <!-- <setting-item name="显示总数">
                    <el-switch  v-model="optionData.extAttrs.isPaging"></el-switch>
                </setting-item>
                <setting-item name="显示页码">
                    <el-switch  v-model="optionData.extAttrs.isPaging"></el-switch>
                </setting-item> -->
                <setting-item name="分页按钮背景">
                    <el-switch  v-model="optionData.extAttrs.pagingAttrs.background"></el-switch>
                </setting-item>
                <setting-item name="只有一页隐藏分页">
                    <el-switch  v-model="optionData.extAttrs.pagingAttrs.hideOnSinglePage"></el-switch>
                </setting-item>
                <!-- <setting-item name="分页大小">
                    <el-select-v2 v-model="optionData.extAttrs.pagingAttrs.pageSize" size="small" :options="paginationSizes" />
                </setting-item> -->
                <setting-item name="最大页码按钮数">
                    <el-input-number  v-model="optionData.extAttrs.pagingAttrs.pagerCount"  size="small" />
                </setting-item>
                <setting-item name="分页内容显示" alone="true">
                    <el-select-v2 v-model="paginationLayout" size="small" multiple collapse-tags :options="layoutOptions" />
                    <!-- <el-select-v2 v-model="optionData.extAttrs.pagingAttrs.layout" size="small" multiple :options="layoutOptions" /> -->
                </setting-item>
            </setting-item-box>
        </collapse-item>

        <collapse-item name="样式" :expanded="true">
            <setting-item-box name="控件尺寸" :alone="true">
                <setting-item>
                    <el-select-v2 v-model="optionData.attrs.size" size="small" :options="sizeOptions" />
                </setting-item>
            </setting-item-box>
            <setting-item-box name="分页控件尺寸" :alone="true" v-if="optionData.extAttrs.isPaging">
                <setting-item>
                    <el-select-v2 v-model="optionData.attrs.size" size="small" :options="sizeOptions" />
                </setting-item>
            </setting-item-box>
            <table-style-setting v-model:styleOptions = "optionData.style" />
        </collapse-item>

        <template v-for="(item,index) in optionData.columns" :key="index">
            <collapse-item :name="'列-'+`${index+1}`">
                <template #header>
                    <div class="title-container">
                    <span>列-{{index + 1}}</span>
                    <div>
                        <el-icon @click.stop="handleCopy()"><Plus /></el-icon>
                        <el-icon @click.stop="handleDelete(index)"><Minus /></el-icon>
                    </div>
                    </div>
                </template>
                <setting-item-box name="映射">
                    <setting-item name="绑定字段">
                        <el-input size="small" v-model="item.attrs.prop"></el-input>
                    </setting-item>
                    <setting-item name="列名">
                        <el-input size="small" v-model="item.attrs.label"></el-input>
                    </setting-item>
                </setting-item-box>

                <!-- <setting-item-box name="默认值" :alone="true">
                        <el-input size="small" v-model="item.label"></el-input>
                </setting-item-box> -->
                <setting-item-box name="列宽(px)">
                        <el-input-number size="small"  v-model="item.attrs.width" />
                </setting-item-box>
                <setting-item-box name="文本">
                    <!-- <setting-item name="字号(px)">
                        <el-input-number size="small"  v-model="item.style.fontSize" />
                    </setting-item>
                    <setting-item name="颜色">
                        <el-color-picker
                            size="small"
                            :modes="['hex']"
                            v-model="item.style.color"
                            show-alpha
                        ></el-color-picker>
                    </setting-item> -->
                    <setting-item name="是否溢出省略">
                        <el-switch size="small" v-model="item.attrs.showOverflowTooltip"></el-switch>
                    </setting-item>
                </setting-item-box>
                <setting-item-box name="对齐方式" :alone="true">
                    <setting-item name="内容对齐">
                        <div>
                            <el-button
                                :type="item.attrs.align == position.key ? 'primary' :'' "
                                v-for="position in positionList"
                                :key="position.key"
                                @click="item.attrs.align = position.key"
                                >
                                <template #icon>
                                    <component :is="position.icon" ></component>
                                </template>
                            </el-button>
                        </div>
                    </setting-item>
                    <setting-item name="表头对齐">
                        <div>
                            <el-button
                               :type="item.attrs.headerAlign == position.key ? 'primary' : ''"
                                v-for="position in positionList"
                                :key="position.key"
                                @click="item.attrs.headerAlign = position.key"
                                >
                                <template #icon>
                                    <component :is="position.icon" ></component>
                                </template>
                            </el-button>
                        </div>
                    </setting-item>
                </setting-item-box>
                <setting-item-box name="列固定" :alone="true">
                    <setting-item >
                        <el-select-v2 v-model="item.attrs.fixed" size="small" :options="colFixOptions" />
                    </setting-item>
                </setting-item-box>
            </collapse-item>
        </template>
    </el-collapse>
</template>

<script setup lang="ts">
import { ref,PropType } from 'vue'
import { columnItem, option } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import{ TableStyleSetting }from '@/components/Pages/FormItemSetting'
import { renderIcon } from "@/utils";
import { icon } from "@/plugins/index";
import { cloneDeep } from 'lodash'
const {
  AlignHorizontalLeftIcon,
  AlignHorizontalCenterIcon,
  AlignHorizontalRightIcon,
} = icon.carbon;

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const sizeOptions = [
  { label: '小号', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大号', value: 'large' }
]
const tooltipEffectOptions = [
    { label: '深色', value: 'dark' },
    { label: '亮色', value: 'light' }
]
const colFixOptions = [
    { label:'不固定',value:false},
    { label:'固定左侧',value:'left'},
    { label:'固定右侧',value:'right'},
]
const layoutOptions = [
    { label:'sizes',value:'sizes' },
    { label:'prev',value:'prev' },
    { label:'pager',value:'pager' },
    { label:'next',value:'next' },
    { label:'jumper',value:'jumper' },
    { label:'total',value:'total' },
]
// const paginationSizes = computed(()=>{
//     return props.optionData.extAttrs.pagingAttrs.pageSizes.map(item=>{
//         return {
//             label:`${item}`,
//             value:item,
//         }
//     })
// })
const paginationLayout = computed({
    get(){
        return props.optionData.extAttrs.pagingAttrs.layout.split(",")
    },
    set(val){
        props.optionData.extAttrs.pagingAttrs.layout = val.join(",")
    }
})
const positionList = [
  {
    key: "left",
    lable: "局左",
    icon: renderIcon(AlignHorizontalLeftIcon),
  },
  {
    key: "center",
    lable: "Y轴居中",
    icon: renderIcon(AlignHorizontalCenterIcon),
  },
  {
    key: "right",
    lable: "局右",
    icon: renderIcon(AlignHorizontalRightIcon),
  }
]

// //增加列
// function handleCopy(item,index){
//     let colsLength = props.optionData.dataset.tablePropsMap.length;
//     let {config} = defaultItemConfig;
//     let newItemObj = Object.assign(
//         {},
//         config,
//         {
//             prop:config.prop+(colsLength+1),
//             label:config.label+(colsLength+1)
//         }
//     )
//     props.optionData.dataset.tablePropsMap.push(newItemObj)
// }
// // 删除列
// function handleDelete(item,index){
//     props.optionData.dataset.tablePropsMap.splice(index,1);
// }
//增加列
function handleCopy() {
    let colsLength = props.optionData.columns.length;
    let newItemObj = cloneDeep(columnItem)
    newItemObj.attrs.label = "字段" + colsLength
    newItemObj.attrs.prop = "field" + colsLength
    props.optionData.columns.push(newItemObj)
}
// 删除列
function handleDelete(index) {
    if (props.optionData.columns.length <= 1) return
    props.optionData.columns.splice(index, 1);
}
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
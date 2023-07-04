<template>
  <el-collapse v-model="collapseName">
    <el-collapse-item title="组件列表" name="组件列表">
      <draggable item-key="id" v-model="groupList" ghostClass="ghost">
        <template #item="{ element }">
          <div class="kh-flex-between item-content" @click="setTargetSelectChart(element.id)">
            <div class="kh-flex-items-center  flex-1">
              <el-image class="list-img" :src="element.chartConfig.image" fit="contain" />
              <span class="list-text kh-nowrap">
                {{ element.chartConfig.title }}
              </span>
            </div>
            <el-icon size="18px">
              <ChevronForwardOutline />
            </el-icon>
          </div>
        </template>
      </draggable>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, reactive } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { CreateComponentGroupType } from '@/packages/index.d';
import { ChevronForwardOutline } from '@vicons/ionicons5';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import Draggable from 'vuedraggable'

const props = defineProps<{
  targetData: CreateComponentGroupType
}>()
// props.targetData.isGroup
const { groupList } = toRefs(props.targetData);
const { setTargetSelectChart } = useChartEditStore()
const collapseName = ref("组件列表")

</script>

<style lang="scss" scoped>
.item-content {
  background: var(--dark-color-3);
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 5px;
  cursor: pointer;

  .list-img {
    width: 50px;
    height: 50px;
    background: var(--dark-color-2);
    border-radius: 5px;
    margin-right: 5px;
  }

  &:hover {
    background: var(--dark-color-4);
  }
}
</style>
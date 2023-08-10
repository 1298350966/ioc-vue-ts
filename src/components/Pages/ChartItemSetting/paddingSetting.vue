<template>
  <setting-item-box name="内边距">
      <el-input-number
        v-model="chartStyles.paddingX"
        :min="0"
        size="small"
      >
      </el-input-number>
      <el-input-number
        v-model="chartStyles.paddingY"
        :min="0"
        size="small"
      >
      </el-input-number>
  </setting-item-box>
</template>

<script setup lang="ts">
import { PickCreateComponentType } from "@/packages/index.d";
import { SettingItemBox } from "@/components/Pages/ChartItemSetting";
import { EditCanvasConfigType } from "@/store/modules/chartEditStore/chartEditStore.d";

const props = defineProps({
  chartStyles: {
    type: Object as PropType<PickCreateComponentType<"styles">>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.paddingSetting{
    display: grid;
    grid-template-columns: 1fr 30px;
    grid-gap: 10px;
}
</style>
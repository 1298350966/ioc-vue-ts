<template>
  <setting-item-box name="背景色" alone>
    <div class="backgroundBox">
      <el-input size="small" placeholder="请输入背景色" v-model="chartStyles.backgroundColor">
      </el-input>
      <el-color-picker size="small" v-model="chartStyles.backgroundColor" show-alpha/>
    </div>
   
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
.backgroundBox{
    display: grid;
    grid-template-columns: 1fr 30px;
    grid-gap: 10px;
}
</style>
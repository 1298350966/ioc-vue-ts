<template>
  <setting-item-box name="尺寸">
    <div>
      <label class="label">宽度</label>
      <el-input-number
        style="width: calc(100% - 30px)"
        v-model="chartAttr.w"
        :min="50"
        :disabled="isGroup"
        size="small"
        placeholder="px"
      >
      </el-input-number>
    </div>

    <div>
      <label class="label">高度</label>
      <el-input-number
        style="width: calc(100% - 30px)"
        v-model="chartAttr.h"
        :min="20"
        :disabled="isGroup"
        size="small"
        placeholder="px"
      >
      </el-input-number>
    </div>
  </setting-item-box>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { PickCreateComponentType } from "@/packages/index.d";
import { SettingItemBox } from "@/components/Pages/ChartItemSetting";

const props = defineProps({
  chartAttr: {
    type: Object as PropType<
      Omit<PickCreateComponentType<"attr">, "node" | "conNode">
    >,
    required: true,
  },
  isGroup: {
    type: Boolean,
    required: false,
  },
});
</script>

<style scoped lang="scss">
.label{
  width:30px;
  display: inline-block;
}
</style>
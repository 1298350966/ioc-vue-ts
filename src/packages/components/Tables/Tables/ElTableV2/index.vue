<template>
  <div class="ElTableV2">
    <el-table-v2 :data="data" :width="w" :height="h" v-bind="attr" />
  </div>
</template>

<script setup lang="ts">
import { PropType, onUnmounted, reactive, toRefs, watch, onMounted } from "vue";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

const props = defineProps({
  chartConfig: {
    type: Object,
    required: true,
  },
});

// 这里能拿到图表宽高等
const { w, h } = toRefs(props.chartConfig.attr);
const { data, attr } = toRefs(props.chartConfig.option);
</script>

<style lang="scss" scoped>
.ElTableV2 {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: hidden;
}
</style>

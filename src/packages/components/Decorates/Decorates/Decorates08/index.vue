<template>
  <div class="go-border-08">
    <svg xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <template v-for="(point, i) in pointPositions">
        <rect :fill="colors[0]" :x="point[0] - halfPointSideLength" :y="point[1] - halfPointSideLength"
          :width="pointSideLength" :height="pointSideLength">
          <animate v-if="Math.random() > 0.6" attributeName="fill" :values="`${colors.join(';')}`"
            :dur="Math.random() + 1 + 's'" :begin="Math.random() * 2" repeatCount="indefinite" />
        </rect>
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const { w, h } = toRefs(props.chartConfig.attr)
const { colors} = toRefs(props.chartConfig.option)
const rowPoints = 25;
const rowCount = 2;
const pointSideLength = 7;
const halfPointSideLength = pointSideLength / 2;

const pointPositions = computed(()=>calcPointsPosition({
  width: w.value,
  height: h.value,
  rowPoints,
  rowCount,
})) 

function calcPointsPosition({
  width,
  height,
  rowPoints,
  rowCount,
}: {
  width: number;
  height: number;
  rowPoints: number;
  rowCount: number;
}) {
  const horizontalGap = width / (rowPoints + 1);
  const verticalGap = height / (rowCount + 1);

  return new Array(rowCount)
    .fill(0)
    .map((_, i) =>
      new Array(rowPoints).fill(0).map((_, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)])
    )
    .reduce((all, item) => [...all, ...item], []);
}

</script>

<style lang="scss" scoped>
@include go('border-08') {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    position: absolute;
    z-index: -1;
  }

  .fill {
    fill: v-bind('colors[0]');
  }

  .fill-none {
    fill: none;
  }

  .stroke {
    stroke: v-bind('colors[1]');
  }
}
</style>

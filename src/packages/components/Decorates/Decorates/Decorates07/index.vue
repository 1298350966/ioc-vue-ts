<template>
  <div class="go-border-07">
    <svg :width="w" :height="h" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">

      <template v-for="(point, i) in pointPositions">
        <rect v-if="Math.random() > 0.6" :key="i" :fill="colors[0]" :x="point[0] - halfPointSideLength"
          :y="point[1] - halfPointSideLength" :width="pointSideLength" :height="pointSideLength">
          <animate v-if="Math.random() > 0.6" attributeName="fill" :values="`${colors[0]};transparent`" dur="1s"
            :begin="Math.random() * 2" repeatCount="indefinite" />
        </rect>
      </template>

      <rect  :fill="colors[1]" :x="leftRectPosition[0] - pointSideLength" :y="leftRectPosition[1] - pointSideLength"
        :width="pointSideLength * 2" :height="pointSideLength * 2">
        <animate attributeName="width" :values="`0;${pointSideLength * 2}`" dur="2s" repeatCount="indefinite" />
        <animate attributeName="height" :values="`0;${pointSideLength * 2}`" dur="2s" repeatCount="indefinite" />
        <animate attributeName="x" :values="`${leftRectPosition[0]};${leftRectPosition[0] - pointSideLength}`" dur="2s"
          repeatCount="indefinite" />
        <animate attributeName="y" :values="`${leftRectPosition[1]};${leftRectPosition[1] - pointSideLength}`" dur="2s"
          repeatCount="indefinite" />
      </rect>

      <rect :fill="colors[1]" :x="rightRectPosition[0] - 40" :y="rightRectPosition[1] - pointSideLength" :width="40"
        :height="pointSideLength * 2">
        <animate attributeName="width" values="0;40;0" dur="2s" repeatCount="indefinite" />
        <animate attributeName="x" :values="`${rightRectPosition[0]};${rightRectPosition[0] - 40};${rightRectPosition[0]}`" dur="2s"
          repeatCount="indefinite" />
      </rect>
    </svg>

  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { getUUID } from '@/utils'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const id = getUUID()

const { w, h } = toRefs(props.chartConfig.attr)
const { colors, dataset, textSize, textColor } = toRefs(props.chartConfig.option)
const svgScale = ref([1,1])
const rowPoints = 20;
const rowCount =4;
const pointPositions = computed(()=>calcPointsPosition({
  width: w.value,
  height: h.value,
  rowPoints,
  rowCount,
})) 


const leftRectPosition = pointPositions.value[rowPoints * 2 - 1] ;
const rightRectPosition = pointPositions.value[rowPoints * 2 - 3];


const rects = ref([])
const pointSideLength = 2.5
const halfPointSideLength = pointSideLength / 2


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
@include go('border-06') {
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

  .text {
    color: v-bind('textColor');
    font-size: v-bind('textSize + "px"');
  }
}
</style>

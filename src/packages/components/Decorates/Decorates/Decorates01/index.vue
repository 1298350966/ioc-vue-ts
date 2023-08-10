<template>
  <svg :width="w" :height="h">
    <rect :x="rectX" :y="rectY" :width="width" :height="height" :fill="colors[0]">
      <animate
        :attributeName="reverse ? 'height' : 'width'"
        from="0"
        :to="reverse ? h : w"
        :dur="`${dur}s`"
        calcMode="spline"
        keyTimes="0;1"
        keySplines=".42,0,.58,1"
        repeatCount="indefinite"
      />
    </rect>

    <rect :x="rectX" :y="rectY" :width="reverse ? lineHeight : endWidth" :height="reverse ? endWidth : lineHeight" :fill="colors[1]">
      <animate
        :attributeName="reverse ? 'y' : 'x'"
        from="0"
        :to="reverse ? h : w"
        :dur="`${dur}s`"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.42,0,0.58,1"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
</template>

<script setup lang="ts">
import { PropType, computed, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
})

const { w, h } = toRefs(props.chartConfig.attr)
const { colors, dur, endWidth, lineHeight,reverse } = toRefs(props.chartConfig.option)
function calcSVGData(reverse, width, height) {
  if (reverse) {
    return {
      width: 1,
      height,
      x: width / 2,
      y: 0,
    };
  } else {
    return {
      width,
      height: 1,
      x: 0,
      y: height / 2,
    };
  }
}
const rectX = computed(() =>{
  if (reverse.value) {
    return w.value / 2
  }else{
    return 0
  }
})
const rectY = computed(() =>{
  if (reverse.value) {
    return 0
  }else{
    return h.value / 2
  }
})
const width = computed(() =>{
  if (reverse.value) {
    return lineHeight.value
  }else{
    return w.value 
  }
})

const height = computed(() =>{
  if (reverse.value) {
    return h.value 
  }else{
    return lineHeight.value
  }
})
</script>

<template>
  <div class="go-border-06">
    <svg xmlns="http://www.w3.org/2000/svg" :width="w" :height="h" viewBox="0,0,100,100">
      <defs>
        <polygon :id="polygonId" points="15, 46.5, 21, 47.5, 21, 52.5, 15, 53.5" />
      </defs>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        :stroke="colors[1]"
        stroke-width="10"
        stroke-dasharray="80, 100, 30, 100"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          :dur="`${dur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        :stroke="colors[0]"
        stroke-width="6"
        stroke-dasharray="50, 66, 100, 66"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;-360 50 50"
          :dur="`${dur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="38"
        fill="transparent"
        :stroke="fade(colors[1], 30)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />

      <use
        v-for="(foo, i) in new Array(20).fill(0)"
        :key="i"
        :xlink:href="`#${polygonId}`"
        :stroke="colors[1]"
        :fill="Math.random() > 0.4 ? 'transparent' : colors[0]"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          :dur="`${dur}s`"
          :begin="`${i * dur / 20}s`"
          repeatCount="indefinite"
        />
      </use>

      <circle
        cx="50"
        cy="50"
        r="26"
        fill="transparent"
        :stroke="fade(colors[1] || colors[1], 30)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />
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
const { colors, dur } = toRefs(props.chartConfig.option)
const polygonId = `decoration-9-polygon-${id}`;

function fade(colorStr,num:number){
  const RGB_COLOR_REG = /^(RGBA|rgba|RGB|rgb)\((0|1\d{0,2}|2[0-4]\d|25[0-5]|\d{1,2}), (0|1\d{0,2}|2[0-4]\d|25[0-5]|\d{1,2}), (0|1\d{0,2}|2[0-4]\d|25[0-5]|\d{1,2})\)$/;
  debugger
  if(RGB_COLOR_REG.test(colorStr)){
    let str = colorStr.replace(/^(rgba|rgb)\(/i,"").replace(/\)$/,"")
    let list = str.split(",")
    list.push(num / 100)
    return "rgba(" + list.join(',') + ")"
  }else{
    return colorStr
  }
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

}
</style>

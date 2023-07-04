<template>
  <el-amap-info-window
    v-if="config.visible"
    :isCustom="config.isCustom"
    :autoMove="config.autoMove"
    :avoid="config.avoid"
    :closeWhenClickMap="config.closeWhenClickMap"
    :offset="config.offset"
    v-model:visible="config.visible"
    :position="config.position"
    :anchor="config.anchor"
    :size="config.size"
    :extraOptions="config.extData"
  >
    <template v-if="config.content.type === 'component'">
      <component
        :is="componentIs"
        v-bind="config.content.attrs"
      ></component>
    </template>
    <template v-else-if="config.content.type === 'iframe'">
      <iframe class="content" v-bind="config.content.iframe"></iframe>
    </template>
  </el-amap-info-window>
</template>

<script setup lang="ts">
import { ElAmapInfoWindow } from "@vuemap/vue-amap";
import {getAsyncCustomComponents} from "@/customComponents/index"
const props = defineProps({
  config: {
    type: Object,
    require: true,
  },
});
const componentIs = computed(()=>{
  return getAsyncCustomComponents(props.config.content.component.is)
})
</script>

<style scoped></style>

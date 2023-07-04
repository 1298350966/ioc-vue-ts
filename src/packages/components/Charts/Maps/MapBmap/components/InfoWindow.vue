<template>
  <BInfoWindow 
    v-model="config.visible"
    :position="config.position"
    :title="config.title"
    :width="config.width"
    :height="config.height"
    :offset="config.offset"
    :enableAutoPan="config.enableAutoPan"
    :enableCloseOnClick="config.enableCloseOnClick"
    :extraOptions="config.extData"
  >
    <template v-if="config.content.type === 'component'">
      <component
        :is="config.content.component.is"
        v-bind="config.content.component.attrs"
      ></component>
    </template>
    <template v-else-if="config.content.type === 'iframe'">
      <iframe class="content" v-bind="config.content.iframe"></iframe>
    </template>
  </BInfoWindow >
</template>

<script setup lang="ts">
import { BInfoWindow } from 'vue3-baidu-map-gl'
const props = defineProps({
  config: {
    type: Object,
    require: true,
  },
});
</script>

<style scoped></style>

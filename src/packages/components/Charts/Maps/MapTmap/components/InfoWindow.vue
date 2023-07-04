<template>
  <div v-if="!isRedraw">
    <tdt-infowindow
      v-if="config.visible"
      :target="config.position"
      :minWidth="minWidth"
      :maxWidth="maxWidth"
      :maxHeight="config.maxHeight"
      :autoPan="config.autoPan"
      :closeButton="config.closeButton"
      :offset="config.offset"
      :autoPanPadding="config.autoPanPadding"
      :closeOnClick="config.closeOnClick"
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
    </tdt-infowindow>
  </div>
</template>

<script setup lang="ts">
import { TdtInfowindow } from "vue-tianditu/packages/index";
const props = defineProps({
  config: {
    type: Object,
    require: true,
  },
});
const { visible, position, minWidth, maxWidth, closeButton } = toRefs(
  props.config
);
const isRedraw = ref(false);
watch(
  () => props.config,
  () => {
    isRedraw.value = true;
    nextTick(() => {
      isRedraw.value = false;
    });
  },
  {
    deep: true,
  }
);
</script>

<style scoped>
.content {
  /* width: 100%;
  height: 100%; */
}
</style>

<template>
  <div v-if="!isRedraw" class="infowindow">
    <tdt-infowindow
      v-if="config.visible"
      :target="config.position"
      :minWidth="minWidth + 'px'"
      :maxHeight="config.maxHeight + 'px'"
      :autoPan="config.autoPan"
      :closeButton="config.closeButton"
      :offset="config.offset"
      :autoPanPadding="config.autoPanPadding"
      :closeOnClick="config.closeOnClick"
    >
      <div :style="infoWindowStyle">
        <component-iframe
          :type="config.content.type"
          :attrs="attrs"
          :component="config.content.component"
          :iframe="config.content.iframe"
        ></component-iframe>
      </div>
    </tdt-infowindow>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { getValue } from "@/utils";
import { cloneDeep } from "lodash";
import { TdtInfowindow } from "vue-tianditu";
const props = defineProps({
  config: {
    type: Object,
    require: true,
  },
  data:{
    type: Object
  }
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

const infoWindowStyle = computed(() => {
  const { width, height } = props.config;
  return {
    width: width + "px",
    height: height + "px",
  };
});

const attrs = computed(()=>{
  if(props.data){
    let _attrs = cloneDeep( props.config.content.attrs)
    return getValue(_attrs, props.data)
  }
  return props.config.content.attrs
})
</script>

<style scoped>
:deep(.tdt-infowindow) {
  background-color: aqua;
}

.content {
  /* width: 100%;
  height: 100%; */
}
</style>

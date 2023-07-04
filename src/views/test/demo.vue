<template>
  <div>
    <!-- <demo2 :option-data="config"></demo2> -->
    <!-- <darkDialog v-if="config.show" :config="config" ></darkDialog> -->
    <!-- <component :is="config.component" v-if="config.show"  :config="config"></component> -->
    <!-- <FilterConfig :filters="filters"></FilterConfig> -->
    <div style="width: 400px;height: 240px;">
      <component :is="getAsyncCustomComponents('LED')" ></component> 
      <!-- <broadcast name="LED设备001"></broadcast> -->
    </div>

  </div>
</template>

<script lang="ts" setup>

import  darkDialog  from "@/packages/dialog/darkDialog/index.vue" 
import  {getGlobalDialogConfig}  from "@/packages/dialog/darkDialog/config" 
import configList from "@/packages/dialog/index"
import demo2 from "@/packages/dialog/darkDialog/config.vue"
import { fetchDialogComponent } from "@/packages";
import { EventConfigFiltersType, FiltersEnum } from "@/components/Pages/FilterConfig/type";
import {getAsyncCustomComponents} from  "@/customComponents/index"
// import broadcast from  "@/customComponents/map/InfoWindow/broadcast/index.vue"
const filters:EventConfigFiltersType =  reactive({
  enable:true,
  type:FiltersEnum.AND,
  conditions:[]
})

const config = reactive(getGlobalDialogConfig())
 
config.attrs.title = '111'
// config.body.type = "iframe"
config.body.component.is = 'demo2'
config.body.iframe.src = "https://colordrop.io/gradient/"
// config.component = fetchDialogComponent(config.component)
config.show = true
const a = import.meta.glob('@/packages/dialog/**',{ eager: true })
const b = import.meta.glob('@/packages/dialog/**',{ as: 'raw', eager: true })
const c = import.meta.glob('@/packages/dialog/**.vue')

window['$vue'].component(config.component, fetchDialogComponent(config.component))
// window['$vue'].component("demo2",demo2)
console.log(configList)
console.log(a,b,c);
console.log(config);
</script>

<style scoped>

</style>
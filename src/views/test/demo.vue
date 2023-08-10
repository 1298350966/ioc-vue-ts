<template>
  <div>
    1111
    <!-- <el-input placeholder="" v-model="value"></el-input> -->
    <!-- <demo2 :a="value"></demo2> -->
    <!-- <dom></dom> -->
    <!-- <darkDialog v-if="config.show" :config="config" ></darkDialog> -->
    <!-- <component :is="config.component" v-if="config.show"  :config="config"></component> -->
    <!-- <FilterConfig :filters="filters"></FilterConfig> -->
    <!-- <div style="width: 400px;height: 240px;">
      <component :is="getAsyncCustomComponents('LED')" ></component> 
    </div> -->

  </div>
</template>

<script lang="ts" setup>

// import  darkDialog  from "@/packages/dialog/darkDialog/index.vue" 
// import  {getGlobalDialogConfig}  from "@/packages/dialog/darkDialog/config" 
// import configList from "@/packages/dialog/index"
// import demo2 from "@/packages/dialog/darkDialog/config.vue"
// import { fetchDialogComponent } from "@/packages";
// import { EventConfigFiltersType, FiltersEnum } from "@/components/Pages/FilterConfig/type";
// import {getAsyncCustomComponents} from  "@/customComponents/index"
// import broadcast from  "@/customComponents/map/InfoWindow/broadcast/index.vue"
// import demo2 from "./demo2.vue"

// const filters:EventConfigFiltersType =  reactive({
//   enable:true,
//   type:FiltersEnum.AND,
//   conditions:[]
// })
// const dom = ref(`
//   <template>
//     <div>
//       11111111111
//       </div>
//   </template>
//   // <script>
//   // export default {
    
//   // }
//   // </script>
// `)
// const value = ref("")
// const config = reactive(getGlobalDialogConfig())
 
// config.attrs.title = '111'
// config.body.type = "iframe"
// config.body.component.is = 'demo2'
// config.body.iframe.src = "https://colordrop.io/gradient/"
// config.component = fetchDialogComponent(config.component)
// config.show = true
// const a = import.meta.glob('@/packages/dialog/**',{ eager: true })
// const b = import.meta.glob('@/packages/dialog/**',{ as: 'raw', eager: true })
// const c = import.meta.glob('@/packages/dialog/**.vue')

// window['$vue'].component(config.component, fetchDialogComponent(config.component))
// window['$vue'].component("demo2",demo2)
// console.log(configList)
// console.log(a,b,c);
// console.log(config);
</script>

<style scoped>

</style>
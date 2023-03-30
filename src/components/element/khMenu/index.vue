<template>
  <el-menu>
    <template v-for="(option,index) in options" :key="index">
     <kh-menu-item :option="option"> </kh-menu-item>
   </template>

  </el-menu>
</template>

<script lang="ts" setup> 
import {khMenuItem}  from "../khMenuItem/index"
defineOptions({
  name:"khMenu"
})
// if (!window['$vue'].component("khMenuItem")) {
//   window['$vue'].component("khMenuItem", khMenuItem)
// }
const props = defineProps({
  options: {
    type: Array,
    default: () => {

    }
  }
})

</script>

<style lang="scss" scoped>

</style>
<template>
  <div>
{{ a }}
  </div>
</template>

<!-- <script setup lang="ts">
import { useProps } from '../preview/hooks/useProps.hook';
// const {props} =  useProps([{field:"a",type:"string",default:"0",fun:""}])
// defineOptions({
//   props:{
//     a:String
//   }
// });
const p = {
  aa:{
    type:String
  }
}

// const props = defineProps<{
// aa:string
// }>()
// console.log(`output->`,attrs)
</script> -->



<script >
import { defineComponent } from 'vue'
// import { useProps } from '../preview/hooks/useProps.hook';
// const {props,watch} =  useProps([{field:"a",type:"string",default:"0"}])/*  */
const p = {
  a:{
    type:String
  }
}

export default defineComponent({
  props:p,
}) 
</script>

<style scoped>

</style>
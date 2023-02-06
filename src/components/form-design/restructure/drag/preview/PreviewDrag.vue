<template>
     <div class='dragAndResize' :style="style" ref="cyGridster">
         <div :style="nowItemStyle(item,index)" v-for="(item,index) in yourList" :key="index">
               <slot :name="'slot'+index" :item="item"></slot>
         </div>
    </div>
</template>

<script>
import previewDrag from '@/components/form-design/restructure/drag/mixins/previewDrag.js';
export default {
    name: 'PreviewDrag',
    mixins:[previewDrag],
};
</script>

<style lang="scss" scoped>
 .scrollBar{
   position: relative;
   overflow:auto;
 }
</style>

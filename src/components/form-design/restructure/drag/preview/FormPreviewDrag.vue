<template>
    <div class='dragAndResize' ref='container'>
        <div v-if="renderOk">
            <div style="overflow: hidden;" v-if="item.sizex!==undefined"
                 :class="{item:true,moveAnimation:moveAnimate,movingItem:item.isPlayer,canNotDrag:!draggable}"
                 :ref="'item'+index"
                 v-for="(item,index) in yourList"
                 :key="'item'+index" :style="nowItemStyle(item,index)">
                <slot :name="'slot'+index"></slot>
                <span class="resizeHandle" v-show="resizable"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import js from "./FormPreviewDrag.js"
    
    export default js

</script>

<style scoped lang="scss">
    @import "@/assets/style/report/drag.scss";
    
    .dragAndResize {
        
        .item {
          // border: 1px solid #E4E7ED;
        }
    }
</style>

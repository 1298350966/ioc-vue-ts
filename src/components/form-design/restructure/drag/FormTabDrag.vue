<template>
    <div class='dragAndResize' ref='container'
         @mousedown.stop="containerMouseDown($event)"
         @mouseup="endMove($event)"
         @mousemove="moving($event)">
        <div v-if="renderOk">
            <div v-if="item.sizex!==undefined"
                 style="overflow: hidden;" 
                 :class="{item:true,moveAnimation:moveAnimate,movingItem:item.isPlayer,canNotDrag:!draggable, active: addOrEdit&&item.id === checkedId}"
                 @click="handleClick(item)"
                 @mousedown="startMove($event,item,index)"
                 :ref="'item'+index"
                 v-for="(item,index) in yourList"
                 :key="'item'+index" :style="nowItemStyle(item,index)">
                <slot :name="'slot'+index"></slot>
                <span class="resizeHandle" v-show="resizable" @mousedown="startResize($event,item,index)"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import js from "./FormTabDrag.js"
    
    export default js

</script>

<style scoped lang="scss">
    @import "@/assets/style/report/drag.scss";
    
</style>

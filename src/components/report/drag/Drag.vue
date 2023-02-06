<template>
    <div class='dragAndResize' ref='container' @mousedown="containerMouseDown($event)" @mouseup="endMove($event)"
         @mousemove="moving($event)">
        <div v-if="renderOk">
            <!--         checkedId:{{checkedId}}-->
            <!--          checkedId:{{checkedId}}
                      item.id:{{item}}-->
            <!--     {{addOrEdit}}-->
            <div class="shadow" style="overflow: hidden;" v-if="item.sizex!==undefined"
                 :class="{item:true,moveAnimation:moveAnimate,movingItem:item.isPlayer,canNotDrag:!draggable, active: addOrEdit&&item.id === checkedId}"
                 @click.native.stop="handleClick(item)"
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
    import js from "./Drag.js"
    
    export default js

</script>

<style scoped lang="scss">
    @import "@/assets/style/report/drag.scss";
    .shadow{
        &:hover{
        box-shadow: 2px 2px 5px #6f7d8178;
        }
    }
</style>

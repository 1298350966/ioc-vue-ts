<template>
  <div class="border-setter mb-2">
    <div class="border-setter-left-pane">
      <span></span>
      <el-tooltip  content="上边框" placement="top"	>
        <span class="top" :class="{ active: borderType == BorderEnum.TOP }" @click="borderType = BorderEnum.TOP">┳</span>
      </el-tooltip>
      <span></span>
      <el-tooltip  content="左边框" placement="left">
        <span class="left" :class="{ active: borderType == BorderEnum.LEFT }" @click="borderType = BorderEnum.LEFT">┣</span>
      </el-tooltip>


      <el-tooltip content="全部" placement="top">
        <span class="all" :class="{ active: borderType == BorderEnum.ALL }" @click="borderType = BorderEnum.ALL">╋</span>
      </el-tooltip>

      <el-tooltip content="右边框" placement="right">
        <span class="right" :class="{ active: borderType == BorderEnum.RIGHT }" @click="borderType = BorderEnum.RIGHT">┫</span>
      </el-tooltip>
      <span></span>
      <el-tooltip content="下边框" placement="bottom">
        <span class="bottom" :class="{ active: borderType == BorderEnum.BOTTOM }" @click="borderType = BorderEnum.BOTTOM">┻</span>
      </el-tooltip>
      <span></span>
    </div>
    <div class="border-setter-right-pane">
      <div class="border-field">
        <span>线性</span>
        <el-select-v2 v-model="borderStyle" :options="borderStyleOptions" size="small"></el-select-v2>
      </div>
      <div class="border-field">
        <span>线宽</span>
        <el-input-number v-model="borderColor" size="small"></el-input-number>
      </div>
      <div class="border-field">
        <span>颜色</span>
        <el-color-picker v-model="borderWidth" show-alpha size="small"></el-color-picker>
      </div>
    </div>
  </div>
  <div class="border-setter">
    <div class="border-setter-left-pane">
  
      <el-tooltip  content="左上角" placement="left-start">
        <span :class="{ active: borderRadiusType == '1' }" @click="borderRadiusType = '1'">┏</span>
      </el-tooltip>
      <span></span>
      <el-tooltip  content="右上角" placement="right-start">
        <span :class="{ active: borderRadiusType == '2' }" @click="borderRadiusType = '2'">┓</span>
      </el-tooltip>

      <span></span>
      <el-tooltip content="全部" placement="top">
        <span class="all" :class="{ active: borderRadiusType == '3' }" @click="borderRadiusType = '3'">╋</span>
      </el-tooltip>
      <span></span>
      <el-tooltip content="右下角" placement="left-end">
        <span :class="{ active: borderRadiusType == '4' }" @click="borderRadiusType = '4'">┗</span>
      </el-tooltip>
      <span></span>
      <el-tooltip content="右下角" placement="right-end">
        <span :class="{ active: borderRadiusType == '5' }" @click="borderRadiusType = '5'">┛</span>
      </el-tooltip>
    </div>
    <div class="border-setter-right-pane">
      <div class="border-field">
        <span>圆角</span>
        <el-input-number v-model="borderRadius" size="small"></el-input-number>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash';
import { borderConfig, borderStyleOptions } from './config';
import { BorderEnum } from './type.d';

const emit = defineEmits(['update:borderOptions'])

const props = defineProps<{
  borderOptions: {
    [T:string]:string
  }
}>()


const borderObj = reactive(borderConfig)

const borderType = ref(BorderEnum.ALL)

const borderRadiusType = ref("1")
 
const borderWidthList = ["borderTopWidth" ,"borderBottomWidth","borderRightWidth","borderLeftWidth"]
const borderStyleList = ["borderTopStyle" ,"borderBottomStyle","borderRightStyle","borderLeftStyle"]
const borderColorList = ["borderTopColor" ,"borderBottomColor","borderRightColor","borderLeftColor"]
const borderRadiusList = ["borderTopLeftRadius" ,"borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]

const borderStyle = computed({
  get() {
    switch (borderType.value) {
      case BorderEnum.ALL:
        return borderObj.borderStyle
      case BorderEnum.TOP:
        return borderObj.borderTopStyle
      case BorderEnum.BOTTOM:
        return borderObj.borderBottomStyle
      case BorderEnum.RIGHT:
        return borderObj.borderRightStyle
      case BorderEnum.LEFT:
        return borderObj.borderLeftStyle
      default:
        return;
    }
  },
  set(val) {
    switch (borderType.value) {
      case BorderEnum.ALL:
        borderObj.borderStyle = val
        borderObj.borderTopStyle = val
        borderObj.borderBottomStyle = val
        borderObj.borderRightStyle = val
        borderObj.borderLeftStyle = val
        return
      case BorderEnum.TOP:
        borderObj.borderTopStyle = val
        if(borderObj.borderTopStyle === borderObj.borderBottomStyle  && borderObj.borderRightStyle === borderObj.borderLeftStyle && borderObj.borderTopStyle === borderObj.borderRightStyle){
          borderObj.borderStyle = val
        }else{
          borderObj.borderStyle = ""
        }
        return
      case BorderEnum.BOTTOM:
        borderObj.borderBottomStyle = val
        if(borderObj.borderTopStyle === borderObj.borderBottomStyle  && borderObj.borderRightStyle === borderObj.borderLeftStyle && borderObj.borderTopStyle === borderObj.borderRightStyle){
          borderObj.borderStyle = val
        }else{
          borderObj.borderStyle = ""
        }
        return
      case BorderEnum.RIGHT:
        borderObj.borderRightStyle = val
        if(borderObj.borderTopStyle === borderObj.borderBottomStyle  && borderObj.borderRightStyle === borderObj.borderLeftStyle && borderObj.borderTopStyle === borderObj.borderRightStyle){
          borderObj.borderStyle = val
        }else{
          borderObj.borderStyle = ""
        }
        return
      case BorderEnum.LEFT:
        borderObj.borderLeftStyle = val
        if(borderObj.borderTopStyle === borderObj.borderBottomStyle  && borderObj.borderRightStyle === borderObj.borderLeftStyle && borderObj.borderTopStyle === borderObj.borderRightStyle){
          borderObj.borderStyle = val
        }else{
          borderObj.borderStyle = ""
        }
        return
      default:
        return;
    }
  }
})

const borderColor = computed({
  get() {
    switch (borderType.value) {
      case BorderEnum.ALL:
        return borderObj.borderColor
      case BorderEnum.TOP:
        return borderObj.borderTopColor
      case BorderEnum.BOTTOM:
        return borderObj.borderBottomColor
      case BorderEnum.RIGHT:
        return borderObj.borderRightColor
      case BorderEnum.LEFT:
        return borderObj.borderLeftColor
      default:
        return;
    }
  },
  set(val) {
    switch (borderType.value) {
      case BorderEnum.ALL:
        borderObj.borderColor = val
        borderObj.borderTopColor = val
        borderObj.borderBottomColor = val
        borderObj.borderRightColor = val
        borderObj.borderLeftColor = val
        return
      case BorderEnum.TOP:
        borderObj.borderTopColor = val
        if(borderObj.borderTopColor === borderObj.borderBottomColor  && borderObj.borderRightColor === borderObj.borderLeftColor && borderObj.borderTopColor === borderObj.borderLeftColor){
          borderObj.borderColor = val
        }else{
          borderObj.borderColor = ""
        }
        return
      case BorderEnum.BOTTOM:
        borderObj.borderBottomColor = val
        if(borderObj.borderTopColor === borderObj.borderBottomColor  && borderObj.borderRightColor === borderObj.borderLeftColor && borderObj.borderTopColor === borderObj.borderLeftColor){
          borderObj.borderColor = val
        }else{
          borderObj.borderColor = ""
        }
        return
      case BorderEnum.RIGHT:
        borderObj.borderRightColor = val
        if(borderObj.borderTopColor === borderObj.borderBottomColor  && borderObj.borderRightColor === borderObj.borderLeftColor && borderObj.borderTopColor === borderObj.borderLeftColor){
          borderObj.borderColor = val
        }else{
          borderObj.borderColor = ""
        }
        return
      case BorderEnum.LEFT:
        borderObj.borderLeftColor = val
        if(borderObj.borderTopColor === borderObj.borderBottomColor  && borderObj.borderRightColor === borderObj.borderLeftColor && borderObj.borderTopColor === borderObj.borderLeftColor){
          borderObj.borderColor = val
        }else{
          borderObj.borderColor = ""
        }
        return
      default:
        return;
    }
  }
})

const borderWidth = computed({
  get() {
    switch (borderType.value) {
      case BorderEnum.ALL:
        return borderObj.borderWidth
      case BorderEnum.TOP:
        return borderObj.borderTopWidth
      case BorderEnum.BOTTOM:
        return borderObj.borderBottomWidth
      case BorderEnum.RIGHT:
        return borderObj.borderRightWidth
      case BorderEnum.LEFT:
        return borderObj.borderLeftWidth
      default:
        return;
    }
  },
  set(val) {
    switch (borderType.value) {
      case BorderEnum.ALL:
        borderObj.borderWidth = val
        borderObj.borderTopWidth = val
        borderObj.borderBottomWidth = val
        borderObj.borderRightWidth = val
        borderObj.borderLeftWidth = val
        return
      case BorderEnum.TOP:
        borderObj.borderTopWidth = val
        if(borderObj.borderTopWidth === borderObj.borderBottomWidth  && borderObj.borderRightWidth === borderObj.borderLeftWidth && borderObj.borderTopWidth === borderObj.borderRightWidth){
          borderObj.borderWidth = val
        }else{
          borderObj.borderWidth = ""
        }
        return
      case BorderEnum.BOTTOM:
        borderObj.borderBottomWidth = val
        if(borderObj.borderTopWidth === borderObj.borderBottomWidth  && borderObj.borderRightWidth === borderObj.borderLeftWidth && borderObj.borderTopWidth === borderObj.borderRightWidth){
          borderObj.borderWidth = val
        }else{
          borderObj.borderWidth = ""
        }
        return
      case BorderEnum.RIGHT:
        borderObj.borderRightWidth = val
        if(borderObj.borderTopWidth === borderObj.borderBottomWidth  && borderObj.borderRightWidth === borderObj.borderLeftWidth && borderObj.borderTopWidth === borderObj.borderRightWidth){
          borderObj.borderWidth = val
        }else{
          borderObj.borderWidth = ""
        }
        return
      case BorderEnum.LEFT:
        borderObj.borderLeftWidth = val
        if(borderObj.borderTopWidth === borderObj.borderBottomWidth  && borderObj.borderRightWidth === borderObj.borderLeftWidth && borderObj.borderTopWidth === borderObj.borderRightWidth){
          borderObj.borderWidth = val
        }else{
          borderObj.borderWidth = ""
        }
        return
      default:
        return;
    }
  }
})

const borderRadius = computed({
  get() {
    switch (borderRadiusType.value) {
      case "3":
        return borderObj.borderRadius
      case "1":
        return borderObj.borderTopLeftRadius
      case "2":
        return borderObj.borderTopRightRadius
      case "4":
        return borderObj.borderBottomLeftRadius
      case "5":
        return borderObj.borderBottomRightRadius
      default:
        return;
    }
  },
  set(val) {
    switch (borderRadiusType.value) {
      case "3":
        borderObj.borderRadius = val
        borderObj.borderTopLeftRadius = val
        borderObj.borderTopRightRadius = val
        borderObj.borderBottomLeftRadius = val
        borderObj.borderBottomRightRadius = val
        return
      case "1":
        borderObj.borderTopLeftRadius = val
        if(borderObj.borderTopLeftRadius === borderObj.borderTopRightRadius  && borderObj.borderBottomLeftRadius === borderObj.borderBottomRightRadius && borderObj.borderTopLeftRadius === borderObj.borderBottomLeftRadius){
          borderObj.borderRadius = val
        }else{
          borderObj.borderRadius = ""
        }
        return
      case "2":
        borderObj.borderTopRightRadius = val
        if(borderObj.borderTopLeftRadius === borderObj.borderTopRightRadius  && borderObj.borderBottomLeftRadius === borderObj.borderBottomRightRadius && borderObj.borderTopLeftRadius === borderObj.borderBottomLeftRadius){
          borderObj.borderRadius = val
        }else{
          borderObj.borderRadius = ""
        }
        return
      case "4":
        borderObj.borderBottomLeftRadius = val
        if(borderObj.borderTopLeftRadius === borderObj.borderTopRightRadius  && borderObj.borderBottomLeftRadius === borderObj.borderBottomRightRadius && borderObj.borderTopLeftRadius === borderObj.borderBottomLeftRadius){
          borderObj.borderRadius = val
        }else{
          borderObj.borderRadius = ""
        }
        return
      case "5":
        borderObj.borderBottomRightRadius = val
        if(borderObj.borderTopLeftRadius === borderObj.borderTopRightRadius  && borderObj.borderBottomLeftRadius === borderObj.borderBottomRightRadius && borderObj.borderTopLeftRadius === borderObj.borderBottomLeftRadius){
          borderObj.borderRadius = val
        }else{
          borderObj.borderRadius = ""
        }
        return
      default:
        return;
    }
  }
})

onMounted(() => {
  Object.keys(borderObj).forEach((key)=>{
    props.borderOptions[key] && (borderObj[key] = props.borderOptions[key])
  })
});

watch(borderObj,()=>{
  emit('update:borderOptions', borderObjFilter())     
},{
  deep:true
})

function borderObjFilter(){
  let obj:any = {}
  Object.keys(borderObj).forEach((key)=>{
    borderObj[key] && (obj[key] = borderObj[key])
  })
  if(borderObj.borderWidth){
    borderWidthList.forEach((key)=>{
      obj[key] && delete obj[key]
    })
  }  
  if(borderObj.borderStyle){
    borderStyleList.forEach((key)=>{
      obj[key] && delete obj[key]
    })
  } 
  if(borderObj.borderColor){
    borderColorList.forEach((key)=>{
      obj[key] && delete obj[key]
    })
  } 
  if(borderObj.borderRadius){
    borderRadiusList.forEach((key)=>{
      obj[key] && delete obj[key]
    })
  } 
  return obj
}


</script>

<style lang="scss" scoped>
.border-setter {
  display: flex;
  // .top{
  //       grid-area: top;
  //     }
      // .left{
      //   grid-area: left;
      // }
      // .right{
      //   grid-area: right;
      // }
      // .all{
      //   grid-area: all;
      // }
      // .bottom{
      //   grid-area: bottom;
      // }
  .border-setter-left-pane {
    flex: 1;
    display: grid;
    align-items: center;
    justify-content: space-around;
    grid-template-columns: 1fr 1fr 1fr;
    margin-right: 15px;
    gap: 5px;
    span{
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
      
      .active {
        background: linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .2));
        border-radius: 4px;
      }
  }

  .border-setter-right-pane {
    flex: 1;
    display: grid;
    gap: 5px;

    .border-field {
      display: grid;
      grid-template-columns: 50px 1fr;
      align-items: center;
    }
  }
}
</style>
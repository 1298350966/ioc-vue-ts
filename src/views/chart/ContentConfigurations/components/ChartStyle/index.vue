<template>
  <div class="ChartStyle">
    <!-- <div class="ChartStyleItem">
      <span class="title">Margin</span>
      <el-input v-model="styleOptions.margin"></el-input>
    </div>
    <div class="ChartStyleItem">
      <span class="title">padding</span>
      <el-input v-model="styleOptions.padding"></el-input>
    </div>
    <div >
      <div class="ChartStyleItem"  @click="show = !show">
        <span class="title">Margin</span>
        <el-input v-model="styleOptions.margin"></el-input>
      </div>
    </div> -->
    <collapseItem  name="Margin">
      <template #title-right>
        <el-select style="width: 100%;" v-model="styleOptions.margin" allow-create	filterable @change="marginChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </template>
      <div class="collapseStyleItem">
        <span class="title">上间距</span>
        <el-select v-model="styleOptions['margin-top']" allow-create	filterable @change="marginItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
      <div class="collapseStyleItem">
        <span class="title">右间距</span>
        <el-select v-model="styleOptions['margin-right']" allow-create	filterable @change="marginItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
      <div class="collapseStyleItem">
        <span class="title">下间距</span>
        <el-select v-model="styleOptions['margin-bottom']" allow-create	filterable @change="marginItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
      <div class="collapseStyleItem">
        <span class="title">左间距</span>
        <el-select v-model="styleOptions['margin-left']" allow-create	filterable @change="marginItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
    </collapseItem>

    <collapseItem  name="padding">
      <template #title-right>
        <el-select style="width: 100%;" v-model="styleOptions.padding" allow-create	filterable @change="paddingChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </template>
      <div class="collapseStyleItem">
        <span class="title">上间距</span>
        <el-select v-model="styleOptions['padding-top']" allow-create	filterable @change="paddingItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
      <div class="collapseStyleItem">
        <span class="title">右间距</span>
        <el-select v-model="styleOptions['padding-right']" allow-create	filterable @change="paddingItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
      <div class="collapseStyleItem">
        <span class="title">下间距</span>
        <el-select v-model="styleOptions['padding-bottom']" allow-create	filterable @change="paddingItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
      <div class="collapseStyleItem">
        <span class="title">左间距</span>
        <el-select v-model="styleOptions['padding-left']" allow-create	filterable @change="paddingItemChange" size="small">
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in pxOptions" :key="index"/>
        </el-select>
      </div>
    </collapseItem>
    <collapseItem  name="背景">
      <div class="collapseStyleItem">
        <span class="title">背景颜色</span>
        <el-color-picker v-model="styleOptions['background-color']" show-alpha size="small"/>
      </div>
      <div class="collapseStyleItem">
        <span class="title">背景图</span>
        <el-input v-model="styleOptions['background-image']" size="small"></el-input>
      </div>
    </collapseItem>
    <collapseItem name="边框">
      <border v-model:border-options="borderOptions"></border>

    </collapseItem>
    <div class="ChartStyleItem">
      <span class="title">鼠标手势</span>
      <el-select style="width: 100%;" v-model="styleOptions.cursor" allow-create	filterable >
          <el-option :value="item.value" :label="item.label"  v-for="(item, index) in cursorOptions" :key="index"/>
        </el-select>
    </div>
    <el-divider/>
  </div>
</template>

<script setup lang="ts">
import collapseItem from "./collapseItem.vue"
import border from "./border.vue"
import { pxOptions, cursorOptions } from "./config";


const styleOptions = reactive({
  margin: "",
  "margin-top": "",
  "margin-right": "",
  "margin-bottom": "",
  "margin-left": "",
  padding:"",
  "padding-top": "",
  "padding-right": "",
  "padding-bottom": "",
  "padding-left": "",
  "background-color":"",
  "background-image":"",
  "background-position":"",
  cursor:null,
})
const marginObj = reactive({
  marginTop:"",
  marginBottom: "",
  marginRight:"",
  marginLeft:""
})
const marginTop = ref("")
const marginBottom = ref("")
const marginRight= ref("")
const marginLeft = ref("")
const marginTopNumber:Number = ref(null)
const show = ref(true)

const borderOptions = ref({
  borderColor:"#333",
})

function marginChange(marginStr:string){
  let list = marginStr.split(" ")
  if(list.length == 1){
    styleOptions["margin-top"] = list[0] || ""
    styleOptions["margin-right"] = list[0] || ""
    styleOptions["margin-bottom"] = list[0] || ""
    styleOptions["margin-left"] = list[0] || ""
  }else if(list.length == 2){
    styleOptions["margin-top"] = list[0] || ""
    styleOptions["margin-right"] = list[1] || ""
    styleOptions["margin-bottom"] = list[0] || ""
    styleOptions["margin-left"] = list[1] || ""
  }else{
    styleOptions["margin-top"] = list[0] || ""
    styleOptions["margin-right"] = list[1] || ""
    styleOptions["margin-bottom"] = list[2] || ""
    styleOptions["margin-left"] = list[3] || ""
  }
}
function marginItemChange(marginStr:string){
  let list = marginStr.split(" ")
  if(styleOptions["margin-top"] ==  styleOptions["margin-bottom"]  &&  styleOptions["margin-right"] == styleOptions["margin-left"] && styleOptions["margin-right"] == styleOptions["margin-top"]){
    styleOptions.margin = styleOptions["margin-top"]
  }else if(styleOptions["margin-top"] ==  styleOptions["margin-bottom"]  &&  styleOptions["margin-right"] == styleOptions["margin-left"]){
    styleOptions.margin = `${styleOptions["margin-top"]} ${styleOptions["margin-right"]}`
  }else{
    if(styleOptions["margin-top"] && styleOptions["margin-right"] && styleOptions["margin-bottom"] && styleOptions["margin-left"]){
      styleOptions.margin = `${styleOptions["margin-top"]} ${styleOptions["margin-right"]} ${styleOptions["margin-bottom"]} ${styleOptions["margin-left"]}`
    }else{
      styleOptions.margin = "自定义"
    }
  }
}

function paddingChange(marginStr:string){
  let list = marginStr.split(" ")
  if(list.length == 1){
    styleOptions["padding-top"] = list[0] || ""
    styleOptions["padding-right"] = list[0] || ""
    styleOptions["padding-bottom"] = list[0] || ""
    styleOptions["padding-left"] = list[0] || ""
  }else if(list.length == 2){
    styleOptions["padding-top"] = list[0] || ""
    styleOptions["padding-right"] = list[1] || ""
    styleOptions["padding-bottom"] = list[0] || ""
    styleOptions["padding-left"] = list[1] || ""
  }else{
    styleOptions["padding-top"] = list[0] || ""
    styleOptions["padding-right"] = list[1] || ""
    styleOptions["padding-bottom"] = list[2] || ""
    styleOptions["padding-left"] = list[3] || ""
  }

}

function paddingItemChange(marginStr:string){
  let list = marginStr.split(" ")
  if(styleOptions["padding-top"] ==  styleOptions["padding-bottom"]  &&  styleOptions["padding-right"] == styleOptions["padding-left"] && styleOptions["padding-right"] == styleOptions["padding-top"]){
    styleOptions.padding = styleOptions["margin-top"]
  }else if(styleOptions["padding-top"] ==  styleOptions["padding-bottom"]  &&  styleOptions["padding-right"] == styleOptions["padding-left"]){
    if(styleOptions["padding-top"] && styleOptions["padding-right"]){
      styleOptions.padding = `${styleOptions["padding-top"]} ${styleOptions["padding-right"]}`
    }else{
      styleOptions.padding = "自定义"
    }
  }else{
    if(styleOptions["padding-top"] && styleOptions["padding-right"] && styleOptions["padding-bottom"] && styleOptions["padding-left"]){
      styleOptions.padding = `${styleOptions["padding-top"]} ${styleOptions["padding-right"]} ${styleOptions["padding-bottom"]} ${styleOptions["padding-left"]}`
    }else{
      styleOptions.padding = "自定义"
    }
  }
}

watch(styleOptions,()=>{
   
})

</script>

<style lang="scss" scoped>
.ChartStyle {
  .ChartStyleItem {
    display: grid;
    grid-template-columns: 75px 1fr;
    height: 45px;
    align-items: center;    
    .title {}
  }
  .collapseStyleItem{
    display: grid;
    grid-template-columns: 65px 1fr;
    align-items: center;
  }
}
.el-divider--horizontal{
    margin: 0;
  }
</style>
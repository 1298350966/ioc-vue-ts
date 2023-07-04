<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"/>
    </setting-item>
    <setting-item name="位置">
      <el-select-v2 v-model="options.position" :options="positionOptions" />
    </setting-item>
    <setting-item name="是否默认展开">
      <el-switch v-model="options.isOpen"/>
    </setting-item>
    <setting-item name="是否随主图视口变化移动">
      <el-switch v-model="options.autoMove"/>
    </setting-item>
    <setting-item name="是否显示视口矩形">
      <el-switch v-model="options.showRectangle"/>
    </setting-item>
    <setting-item name="是否显示打开关闭的按钮">
      <el-switch v-model="options.showButton"/>
    </setting-item>
    <setting-item name="缩略图要显示的地图自定义样式，如'amap://styles/dark'">
      <el-input v-model="options.mapStyle"/>
    </setting-item>
    <setting-item name="缩略图要显示的图层类型（数组类型）">
      <el-input v-model="options.layers"/>
    </setting-item>
    <setting-item name="缩略图的宽度">
      <el-input-number v-model="currentOptions.width"/>
    </setting-item>
    <setting-item name="缩略图的高度">
      <el-input-number v-model="currentOptions.height"/>
    </setting-item>
    <setting-item name="控件偏移量（px）">
      <div class="kh-g-2">
        <el-input-number v-model="options.offset[0]"/>
        <el-input-number v-model="options.offset[1]"/>
      </div>
    </setting-item>
    <setting-item name="缩略图的边框样式">
      <el-input v-model="options.borderStyle"/>
    </setting-item>
    <setting-item name="缩略图的边框颜色">
      <el-color-picker v-model="options.borderColor" />
    </setting-item>
    <setting-item name="缩略图的边框角度（px)">
      <el-input-number v-model="currentOptions.borderRadius"/>
    </setting-item>
    <setting-item name="缩略图的边框宽度（px)">
      <el-input-number v-model="currentOptions.borderWidth"/>
    </setting-item>
    <setting-item name="箭头按钮的像素尺寸（px)">
      <el-input-number v-model="currentOptions.buttonSize"/>
    </setting-item>
  </div>
</template>
  
  <script setup lang="ts">
  const props = defineProps({
    options: {
      type: Object,
      required: true,
    },
  });
  const positionOptions = [
    {
      value: "RT",
      label: "右上",
    },
    {
      value: "LT",
      label: "左上",
    },
    {
      value: "RB",
      label: "右下",
    },
    {
      value: "LB",
      label: "左下",
    },
  ];

  const currentOptions = reactive({
    width:200,
    height:200,
    borderRadius:2,
    borderWidth:2,
    buttonSize:20,
  })
  watch(()=>currentOptions.width,(val,oldVal)=>{
    props.options.width = val + 'px';
  })
  watch(()=>currentOptions.height,(val,oldVal)=>{
    props.options.height = val + 'px';
  })
  watch(()=>currentOptions.borderRadius,(val,oldVal)=>{
    props.options.borderRadius = val + 'px';
  })
  watch(()=>currentOptions.borderWidth,(val,oldVal)=>{
    props.options.borderWidth = val + 'px';
  })
  watch(()=>currentOptions.buttonSize,(val,oldVal)=>{
    props.options.buttonSize = val + 'px';
  })
  </script>
  
  <style scoped>
  </style>
  
<template>
  <el-collapse>
    <collapse-item name="地图">
      <setting-item-box name="位置">
        <setting-item name="经度">
          <el-input-number v-model="optionData.mapOptions.mapLat" :step="step" size="small">
          </el-input-number>
        </setting-item>
        <setting-item name="纬度">
          <el-input-number v-model="optionData.mapOptions.mapLog" :step="step" size="small">
          </el-input-number>
        </setting-item>
        <setting-item name="初始缩放">
          <el-input-number
            v-model="optionData.mapOptions.zoom"
            :min="0"
            size="small"
          ></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="动画">
        <setting-item name="平移惯性">
          <el-switch v-model="optionData.mapOptions.inertia" size="small"></el-switch>
        </setting-item>
        <setting-item name="缩放动画">
          <el-switch v-model="optionData.mapOptions.zoomAnimation" size="small"></el-switch>
        </setting-item>
        <setting-item name="淡入淡出动画">
          <el-switch v-model="optionData.mapOptions.fadeAnimation" size="small"></el-switch>
        </setting-item>
      </setting-item-box>
    </collapse-item>
    <collapse-item name="平铺图层">
      <setting-item name="是否显示">
        <el-switch v-model="optionData.tileLayer.visible" size="small"></el-switch>
      </setting-item>
      <setting-item name="名称">
        <el-input v-model="optionData.tileLayer.name" size="small"></el-input>
      </setting-item>
      <setting-item name="图层地址">
        <el-input v-model="optionData.tileLayer.url" size="small"></el-input>
      </setting-item>
    </collapse-item>
    <collapse-item name="覆盖物群组">
      <template #header>
        <el-space class="kh-flex-between flex-1">
          <span>覆盖物组</span>
          <el-icon @click.stop="createCoverGroup">
            <Plus />
          </el-icon>
        </el-space>
      </template>
      <coverGroupList
        :coverGroupList="props.optionData.coverGroupList"
        :optionData="optionData"
      ></coverGroupList>
      <coverGroupDialog
        v-if="coverGroup.show"
        v-model="coverGroup.show"
        :config="coverGroup.config"
        :optionData="optionData"
        @save="addCoverGroup"
      ></coverGroupDialog>
    </collapse-item>
  </el-collapse>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import {
  coverGroupOptions,
  option,
  InfoWindowOptions
} from "./config";
import { cloneDeep } from "lodash";
import { getUUID } from "@/utils";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
const coverGroupDialog = defineAsyncComponent(
  () => import("./configComponents/coverGroupDialog.vue")
);
const coverGroupList = defineAsyncComponent(
  () => import("./configComponents/coverGroupList.vue")
);




const coverGroup = reactive({
  show: false,
  config: null,
});

function createCoverGroup() {
  coverGroup.config = cloneDeep(coverGroupOptions);
  const id = getUUID();
  coverGroup.config.id = id;
  coverGroup.config.name = id;
  coverGroup.show = true;
}

function addCoverGroup(config) {
  props.optionData.coverGroupList.push(config);
  coverGroup.show = false;
}

const InfoWindowDialog = reactive({
  show: false,
  config: null,
});
function createInfoWindow() {
  InfoWindowDialog.config = cloneDeep(InfoWindowOptions);
  const id = getUUID();
  InfoWindowDialog.config.id = id;
  InfoWindowDialog.config.name = id;
  InfoWindowDialog.show = true;
}

function addInfoWindow(config) {
  props.optionData.InfoWindowList.push(config);
  InfoWindowDialog.show = false;
}

const step = ref(1)
watch(()=> props.optionData.mapOptions.zoom,(val)=>{
  if(val >= 17){
    step.value = 0.001
  } else if(val >= 15){
    step.value = 0.005
  }else if(val >= 13){
    step.value = 0.01
  }else if(val >= 11){
    step.value = 0.05
  }else if(val >= 9){
    step.value = 0.1
  }else if(val >= 7){
    step.value = 0.5
  }else if(val >= 5){
    step.value = 1
  }else {
    step.value = 10
  }
},{
  immediate:true
})
</script>
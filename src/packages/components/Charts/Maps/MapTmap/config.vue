<template>
  <el-collapse>
    <collapse-item name="基础" :expanded="true">
      <setting-item-box name="Key" :alone="true">
        <setting-item name="请务必使用自己的天地key">
          <el-input
            v-model="optionData.mapOptions.mapKey"
            size="small"
          ></el-input>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="定义图层" :alone="true">
        <setting-item>
          <!-- <el-input
            size="small"
            v-model="optionData.mapOptions.mapStyleKeyCustom"
          /> -->
          <el-select-v2
            v-model="optionData.mapOptions.mapStyleKeyCustom"
            :options="mapStyleKeyCustomInitOptions"
            placeholder="请选择"
            style="width: 240px; vertical-align: middle"
            allow-create
            filterable
            clearable
            size="small"
          />
        </setting-item>
      </setting-item-box>
    </collapse-item>
    <collapse-item name="地图" :expanded="true">
      <setting-item-box name="主题">
        <setting-item>
          <el-select-v2
            size="small"
            v-model="optionData.mapOptions.mapStyleKey"
            :options="themeOptions"
          />
        </setting-item>
      </setting-item-box>
      <setting-item-box name="位置">
        <setting-item name="经度">
          <el-input-number
            v-model="optionData.mapOptions.mapLng"
            :show-button="false"
            size="small"
          >
            <template #suffix>°</template>
          </el-input-number>
        </setting-item>
        <setting-item name="纬度">
          <el-input-number
            v-model="optionData.mapOptions.mapLat"
            :show-button="false"
            size="small"
          >
            <template #suffix>°</template>
          </el-input-number>
        </setting-item>
        <setting-item name="初始缩放">
          <el-input-number
            v-model="optionData.mapOptions.mapZindex"
            :min="0"
            size="small"
          ></el-input-number>
        </setting-item>
      </setting-item-box>
    </collapse-item>
    <collapse-item name="遮罩" :expanded="true">
      <template #header>
        <el-space class="kh-flex-between flex-1">
          <span>遮罩</span>
          <el-switch
            size="small"
            @click.stop
            v-model="optionData.mask.enable"
          ></el-switch>
        </el-space>
      </template>
      <setting-item name="遮罩轮廓编辑">
        <editPolygon :optionData="optionData"></editPolygon>
      </setting-item>
      <PolygonConfig :options="optionData.mask.polygonOptions"></PolygonConfig>
    </collapse-item>
    <collapse-item name="控件" :expanded="true">
      <template #header>
        <el-space class="kh-flex-between flex-1">
          <span>控件</span>
          <el-icon @click.stop="createControls">
            <Plus />
          </el-icon>
        </el-space>
      </template>
      <controlGroupList
        :controlGroupList="props.optionData.controlGroupList"
        :optionData="optionData"
      ></controlGroupList>
      <controlGroupDialog
        v-if="controlGroup.show"
        v-model="controlGroup.show"
        :config="controlGroup.config"
        :optionData="optionData"
        @save="addControls"
      ></controlGroupDialog>
    </collapse-item>
    <collapse-item name="覆盖物群组" :expanded="true">
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
    <collapse-item name="信息窗体" :expanded="true">
      <template #header>
        <el-space class="kh-flex-between flex-1">
          <span>信息窗体</span>
          <el-icon @click.stop="createInfoWindow">
            <Plus />
          </el-icon>
        </el-space>
      </template>
      <InfoWindowList
        :InfoWindowList="optionData.InfoWindowList"
        :optionData="optionData"
      ></InfoWindowList>
      <InfoWindowSetting
        v-if="InfoWindowDialog.show"
        v-model="InfoWindowDialog.show"
        :config="InfoWindowDialog.config"
        :optionData="optionData"
        @save="addInfoWindow"
      ></InfoWindowSetting>
    </collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import {
  coverGroupOptions,
  controlGroupOptions,
  option,
  themeOptions,
  mapStyleKeyCustomOptions,
  InfoWindowOptions,
} from "./config";
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { ThemeEnum } from "./type";
import { cloneDeep } from "lodash";
import { getUUID } from "@/utils";
const coverGroupDialog = defineAsyncComponent(
  () => import("./configComponents/coverGroupDialog.vue")
);
const coverGroupList = defineAsyncComponent(
  () => import("./configComponents/coverGroupList.vue")
);
const controlGroupDialog = defineAsyncComponent(
  () => import("./configComponents/controlGroupDialog.vue")
);
const controlGroupList = defineAsyncComponent(
  () => import("./configComponents/controlGroupList.vue")
);


const PolygonConfig = defineAsyncComponent(
  () => import("./configComponents/coverGroupDialog/coverConfig/PolygonConfig.vue")
);
const editPolygon = defineAsyncComponent(
  () => import("./configComponents/editPolygon.vue")
);
const InfoWindowSetting = defineAsyncComponent(
  () => import("./configComponents/InfoWindowSetting/index.vue")
);
const InfoWindowList = defineAsyncComponent(
  () => import("./configComponents/InfoWindowList.vue")
);
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});



const mapStyleKeyCustomInitOptions = computed(()=>{
  return mapStyleKeyCustomOptions.map(item=>{
    return {
      value:
        "http://t0.tianditu.gov.cn/" +
        item.value +
        "/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
        item.value.split("_")[0] +
        "&STYLE=default&TILEMATRIXSET=" +
        item.value.split("_")[1] +
        "&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" +
        props.optionData.mapOptions.mapKey,
      label: item.label,
    };
  });
});

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

const controlGroup = reactive({
  show: false,
  config: null,
})
function createControls() {
  controlGroup.config = cloneDeep(controlGroupOptions);
  const id = getUUID();
  controlGroup.config.id = id;
  controlGroup.config.name = id;
  controlGroup.show = true;
}
function addControls(config) {
  props.optionData.controlGroupList.push(config);
  controlGroup.show = false;
}
</script>

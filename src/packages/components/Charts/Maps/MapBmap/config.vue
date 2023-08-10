<template>
  <el-collapse>
    <collapse-item name="基础" :expanded="true">
      <setting-item-box name="Key" :alone="true">
        <setting-item name="请务必使用自己的百度应用 key">
          <el-input
            v-model="optionData.mapOptions.mapKey"
            size="small"
          ></el-input>
        </setting-item>
      </setting-item-box>
      <!-- <setting-item-box name="自定义地图样式ID" :alone="true">
        <setting-item>
          <el-input
            size="small"
            v-model="optionData.mapOptions.mapStyleKeyCustom"
          />
        </setting-item>
      </setting-item-box> -->
    </collapse-item>
    <collapse-item name="地图" :expanded="true">
      <!-- <setting-item-box name="主题">
        <setting-item>
          <el-select-v2
            size="small"
            v-model="optionData.mapOptions.mapStyleKey"
            :options="themeOptions"
          />
        </setting-item>
      </setting-item-box> -->
      <setting-item-box name="地图类型" :alone="true">
        <el-radio-group v-model="optionData.mapOptions.mapType">
          <el-radio
            :label="item.value"
            v-for="(item, index) in mapTypeOptions"
            :key="index"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </setting-item-box>
      <setting-item-box name="位置">
        <setting-item name="经度">
          <el-input-number
            v-model="optionData.mapOptions.mapLog"
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
        <setting-item name="最小级别">
          <el-input-number
            v-model="optionData.mapOptions.minZoom"
            :min="0"
            :max="20"
            size="small"
          ></el-input-number>
        </setting-item>
        <setting-item name="最大级别">
          <el-input-number
            v-model="optionData.mapOptions.maxZoom"
            :min="0"
            :max="20"
            size="small"
          ></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="视角">
        <setting-item name="倾斜角度">
          <el-input-number
            v-model="optionData.mapOptions.pitch"
            :min="0"
            :max="88"
            size="small"
          ></el-input-number>
        </setting-item>
        <setting-item name="旋转角度">
          <el-input-number
            v-model="optionData.mapOptions.heading"
            size="small"
          ></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="自定义样式ID">
        <el-input v-model="optionData.mapOptions.mapStyleId" size="small"></el-input>
      </setting-item-box>
    </collapse-item>
    <!-- <collapse-item name="遮罩" :expanded="true">
      <template #header>
        <el-space class="kh-flex-between flex-1">
          <span>遮罩</span>
          <el-switch v-model="optionData.mask.enable"></el-switch>
        </el-space>
      </template>
      <setting-item name="遮罩轮廓编辑">
        <editPolygon :optionData="optionData"></editPolygon>
      </setting-item>
      <PolygonConfig :options="optionData.mask.polygonOptions"></PolygonConfig>
    </collapse-item> -->
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

import { option, coverGroupOptions,controlGroupOptions,InfoWindowOptions, } from "./config";
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { cloneDeep } from "lodash";
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

const InfoWindowSetting = defineAsyncComponent(
  () => import("./configComponents/InfoWindowSetting/index.vue")
);
const InfoWindowList = defineAsyncComponent(
  () => import("./configComponents/InfoWindowList.vue")
);
import editPolygon from "./configComponents/editPolygon.vue";

import { getUUID } from "@/utils";
import { MapTypeEnum } from "./type";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

const mapTypeOptions = [
  {
    value: MapTypeEnum.BMAP_NORMAL_MAP,
    label: "标准地图",
  },
  {
    value: MapTypeEnum.BMAP_EARTH_MAP,
    label: "地球模式",
  },
  {
    value: MapTypeEnum.BMAP_SATELLITE_MAP ,
    label: "普通卫星地图",
  },
];


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

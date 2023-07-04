<template>
  <el-collapse>
    <collapse-item name="基础" :expanded="true">
      <setting-item-box name="语言类型" :alone="true">
        <setting-item>
          <el-select-v2
            size="small"
            v-model="optionData.mapOptions.lang"
            :options="langOptions"
          />
        </setting-item>
      </setting-item-box>
      <setting-item-box name="Key" :alone="true">
        <setting-item name="请务必使用自己的高德应用 key">
          <el-input
            v-model="optionData.mapOptions.amapKey"
            size="small"
          ></el-input>
        </setting-item>
      </setting-item-box>
      <!-- <setting-item-box name="自定义地图样式ID" :alone="true">
        <setting-item>
          <el-input
            size="small"
            v-model="optionData.mapOptions.amapStyleKeyCustom"
          />
        </setting-item>
      </setting-item-box> -->
      <setting-item-box name="定义图层" :alone="true">
        <setting-item>
          <!-- <el-input
            size="small"
            v-model="optionData.mapOptions.mapStyleKeyCustom"
          /> -->
          <el-select-v2
            v-model="optionData.mapOptions.amapStyleKeyCustom"
            :options="amapStyleKeyCustomOptions"
            placeholder="请选择"
            style="width: 240px; vertical-align: middle"
            allow-create
            filterable
            clearable
            size="small"
          />
        </setting-item>
        <setting-item
          v-if="optionData.mapOptions.amapStyleKeyCustom === 'ElAmapLayerTile'"
          name="切片图层地址"
        >
          <el-input
            size="small"
            v-model="optionData.mapOptions.layerOptions.tileUrl"
          />
        </setting-item>
      </setting-item-box>
    </collapse-item>
    <collapse-item name="地图" :expanded="true">
      <setting-item-box name="主题">
        <setting-item>
          <el-select-v2
            size="small"
            v-model="optionData.mapOptions.amapStyleKey"
            :options="themeOptions"
          />
        </setting-item>
      </setting-item-box>
      <setting-item-box name="内容" :alone="true">
        <el-checkbox-group v-model="optionData.mapOptions.features">
          <el-checkbox
            :value="item.value"
            :label="item.label"
            v-for="(item, index) in featuresOptions"
            :key="index"
          />
        </el-checkbox-group>
      </setting-item-box>
      <setting-item-box name="位置">
        <setting-item name="经度">
          <el-input-number
            v-model="optionData.mapOptions.amapLon"
            :show-button="false"
            size="small"
          >
            <template #suffix>°</template>
          </el-input-number>
        </setting-item>
        <setting-item name="纬度">
          <el-input-number
            v-model="optionData.mapOptions.amapLat"
            :show-button="false"
            size="small"
          >
            <template #suffix>°</template>
          </el-input-number>
        </setting-item>
        <setting-item name="初始缩放">
          <el-input-number
            v-model="optionData.mapOptions.amapZindex"
            :min="0"
            size="small"
          ></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="模式" :alone="true">
        <setting-item>
          <el-radio-group
            v-model="optionData.mapOptions.viewMode"
            name="radiogroup"
          >
            <el-radio
              v-for="song in viewModeOptions"
              :label="song.value"
              :value="song.value"
            >
              {{ song.label }}
            </el-radio>
          </el-radio-group>
        </setting-item>
      </setting-item-box>
      <template v-if="optionData.mapOptions.viewMode === '3D'">
        <setting-item-box>
          <setting-item name="天空色">
            <el-color-picker
              size="small"
              v-model="optionData.mapOptions.skyColor"
              show-alpha
            ></el-color-picker>
          </setting-item>
          <setting-item name="俯仰角">
            <el-input-number
              v-model="optionData.mapOptions.pitch"
              :min="0"
              :max="83"
              size="small"
            ></el-input-number>
          </setting-item>
        </setting-item-box>
      </template>
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
  option,
  MarkerEnum,
  ThemeEnum,
  LangEnum,
  ViewModeEnum,
  FeaturesEnum,
  coverGroupOptions,
  InfoWindowOptions,
  controlGroupOptions,
} from "./config";
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { cloneDeep } from "lodash";
// import coverGroupDialog from "./components/coverGroupDialog.vue";
// import coverGroupList from "./components/coverGroupList.vue"

const coverGroupDialog = defineAsyncComponent(
  () => import("./components/coverGroupDialog.vue")
);
const coverGroupList = defineAsyncComponent(
  () => import("./components/coverGroupList.vue")
);
const controlGroupDialog = defineAsyncComponent(
  () => import("./components/controlGroupDialog.vue")
);
const controlGroupList = defineAsyncComponent(
  () => import("./components/controlGroupList.vue")
);

const PolygonConfig = defineAsyncComponent(
  () => import("./components/coverGroupDialog/coverConfig/PolygonConfig.vue")
);

const InfoWindowSetting = defineAsyncComponent(
  () => import("./configComponents/InfoWindowSetting/index.vue")
);
const InfoWindowList = defineAsyncComponent(
  () => import("./configComponents/InfoWindowList.vue")
);

import editPolygon from "./components/editPolygon.vue";

import { getUUID } from "@/utils";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

const themeOptions = [
  {
    value: ThemeEnum.NORMAL,
    label: "标准",
  },
  {
    value: ThemeEnum.DARK,
    label: "幻影黑",
  },
  {
    value: ThemeEnum.LIGHT,
    label: "月光银",
  },
  {
    value: ThemeEnum.WHITES_MOKE,
    label: "远山黛",
  },
  {
    value: ThemeEnum.FRESH,
    label: "草色青",
  },
  {
    value: ThemeEnum.GREY,
    label: "雅士灰",
  },
  {
    value: ThemeEnum.GRAFFITI,
    label: "涂鸦",
  },
  {
    value: ThemeEnum.MACARON,
    label: "马卡龙",
  },
  {
    value: ThemeEnum.BLUE,
    label: "靛青蓝",
  },
  {
    value: ThemeEnum.DARKBLUE,
    label: "极夜蓝",
  },
  {
    value: ThemeEnum.WINE,
    label: "酱籽",
  },
];

const langOptions = [
  {
    value: LangEnum.ZH_CN,
    label: "中文简体",
  },
  {
    value: LangEnum.EN,
    label: "英文",
  },
  {
    value: LangEnum.ZH_EN,
    label: "中英文对照",
  },
];

const viewModeOptions = [
  {
    value: ViewModeEnum.PLANE,
    label: "2D",
  },
  {
    value: ViewModeEnum.STEREOSCOPIC,
    label: "3D",
  },
];

const featuresOptions = [
  {
    value: FeaturesEnum.BG,
    label: "显示地图背景",
  },
  {
    value: FeaturesEnum.POINT,
    label: "显示标识",
  },
  {
    value: FeaturesEnum.ROAD,
    label: "显示道路",
  },
  {
    value: FeaturesEnum.BUILDING,
    label: "显示建筑",
  },
];

const amapStyleKeyCustomOptions = [
  {
    value: "ElAmapLayerDefault",
    label: "默认图层",
  },
  {
    value: "ElAmapLayerTile",
    label: "切片图层",
  },
  {
    value: "ElAmapLayerTraffic",
    label: "实时交通图层",
  },
  {
    value: "ElAmapLayerSatellite",
    label: "卫星图层",
  },
  {
    value: "ElAmapLayerRoadNet",
    label: "路网图层",
  },
  {
    value: "ElAmapLayerBuildings",
    label: "建筑楼块3D图层",
  },
  {
    value: "ElAmapLayerDistrict",
    label: "简易行政区划图层",
  },
  {
    value: "ElAmapLayerIndoorMap",
    label: "室内图层",
  },
];

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

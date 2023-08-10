<template>
  <div class="InfoWindowList">
    <el-empty
      v-if="InfoWindowList.length === 0"
      class="empty-box"
      :image-size="100"
      description="暂无数据"
    />
    <template v-else>
      <div
        class="item-content"
        v-for="(item, index) in InfoWindowList"
        :key="index"
      >
        <div>
          <el-tag class="go-mr-1" type="warning"> 名称 </el-tag>
          <span style="max-width: 180px">
            {{ item.name || "暂无" }}
          </span>
        </div>
        <div class="item-content-icon">
          <el-space>
            <el-icon size="16px" @click="openInfoWindow(item, index)">
              <Edit />
            </el-icon>
            <el-icon
              size="16px"
              color="#F56C6C"
              @click="removeInfoWindow(index)"
            >
              <Delete />
            </el-icon>
          </el-space>
        </div>
      </div>
    </template>

    <InfoWindowSetting
      v-if="InfoWindowDialog.show"
      v-model="InfoWindowDialog.show"
      :config="InfoWindowDialog.config"
      :optionData="optionData"
      @save="updateInfoWindow"
    ></InfoWindowSetting>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import { InfoWindowOptions, option } from "../config";

const InfoWindowSetting = defineAsyncComponent(
  () => import("./InfoWindowSetting/index.vue")
);
const props = defineProps({
  InfoWindowList: {
    type: Array as PropType<(typeof InfoWindowOptions)[]>,
    require: true,
    default: () => {
      return [];
    },
  },
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

const InfoWindowDialog = reactive({
  show: false,
  config: null,
  index: null,
});
function openInfoWindow(item, index) {
  InfoWindowDialog.config = cloneDeep(item);
  InfoWindowDialog.index = index;
  InfoWindowDialog.show = true;
}
function updateInfoWindow(config) {
  props.InfoWindowList[InfoWindowDialog.index] = config;
  InfoWindowDialog.show = false;
}

function removeInfoWindow(index) {
  props.InfoWindowList.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.item-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: all 0.5s linear;
  background-color: var(--bg-color-3);
  .item-content-icon {
    position: absolute;
    right: 5px;
    top: 5px;
    opacity: 0;
    height: 20px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }
  &:hover {
    .item-content-icon {
      opacity: 1;
    }
  }
}
</style>

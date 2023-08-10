<template>
  <div class="coverGroupList">
    <el-empty
      v-if="coverGroupList.length === 0"
      class="empty-box"
      :image-size="100"
      description="暂无数据"
    />
    <template v-else>
      <div
        class="item-content"
        v-for="(item, index) in coverGroupList"
        :key="index"
      >
        <div>
          <el-tag class="go-mr-1" type="warning"> 名称 </el-tag>
          <span style="max-width: 180px">
            {{ item.name || "暂无" }}
          </span>
        </div>
        <div>
          <el-tag class="go-mr-1" type="warning">类型 </el-tag>
          <span style="max-width: 180px">
            {{ getTypeName(item.type) || "暂无" }}
          </span>
        </div>
        <div class="item-content-icon">
          <el-space>
            <el-switch v-model="item.visible" size="small"></el-switch>
            <el-icon size="16px" @click="openCoverGroup(item, index)">
              <Edit />
            </el-icon>
            <el-icon
              size="16px"
              color="#F56C6C"
              @click="removeCoverGroup(index)"
            >
              <Delete />
            </el-icon>
          </el-space>
        </div>
      </div>
    </template>
    <coverGroupDialog
      v-if="coverGroup.show"
      v-model="coverGroup.show"
      :config="coverGroup.config"
      :optionData="optionData"
      @save="updateCoverGroup"
    ></coverGroupDialog>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import { coverGroupOptions, coverOptions, option } from "../config";
const coverGroupDialog = defineAsyncComponent(
  () => import("./coverGroupDialog.vue")
);
const props = defineProps({
  coverGroupList: {
    type: Array as PropType<(typeof coverGroupOptions)[]>,
    require: true,
  },
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});

const coverGroup = reactive({
  show: false,
  config: null,
  index: null,
});
function openCoverGroup(item, index) {
  coverGroup.config = cloneDeep(item);
  coverGroup.index = index;
  coverGroup.show = true;
}
function updateCoverGroup(config) {
  props.coverGroupList[coverGroup.index] = config;
  coverGroup.show = false;
}
const getTypeName = (type) => {
  return coverOptions.find((c) => {
    return type == c.value;
  }).label;
};

function removeCoverGroup(index) {
  props.coverGroupList.splice(index, 1);
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

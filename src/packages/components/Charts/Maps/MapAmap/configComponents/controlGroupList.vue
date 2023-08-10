<template>
    <div class="coverGroupList">
      <el-empty
        v-if="controlGroupList.length === 0"
        class="empty-box"
        :image-size="100"
        description="暂无数据"
      />
      <template v-else>
        <div
          class="item-content"
          v-for="(item, index) in controlGroupList"
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
              {{ getTypeName(item.type) || "暂无" }}控件
            </span>
          </div>
          <div class="item-content-icon">
            <el-space>
              <el-icon size="16px" @click="openControlGroup(item, index)">
                <Edit />
              </el-icon>
              <el-icon
                size="16px"
                color="#F56C6C"
                @click="removeControlGroup(index)"
              >
                <Delete />
              </el-icon>
            </el-space>
          </div>
        </div>
      </template>
      <controlGroupDialog
        v-if="controlGroup.show"
        v-model="controlGroup.show"
        :config="controlGroup.config"
        :optionData="optionData"
        @save="updateControlGroup"
      ></controlGroupDialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { cloneDeep } from "lodash";
  import { controlGroupOptions, controlOptions, option } from "../config";
  const controlGroupDialog = defineAsyncComponent(
    () => import("./controlGroupDialog.vue")
  );
  const props = defineProps({
    controlGroupList: {
      type: Array as PropType<(typeof controlGroupOptions)[]>,
      require: true,
    },
    optionData: {
      type: Object as PropType<typeof option>,
      required: true,
    },
  });
  
  const controlGroup = reactive({
    show: false,
    config: null,
    index: null,
  });
  function openControlGroup(item, index) {
    controlGroup.config = cloneDeep(item);
    controlGroup.index = index;
    controlGroup.show = true;
  }
  function updateControlGroup(config) {
    props.controlGroupList[controlGroup.index] = config;
    controlGroup.show = false;
  }
  const getTypeName = (type) => {
    return controlOptions.find((c) => {
      return type == c.value;
    }).label;
  };
  
  function removeControlGroup(index) {
    props.controlGroupList.splice(index, 1);
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
  
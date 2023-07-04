<template>
  <div class="map-item">
    <transition name="slide-vertical">
      <el-scrollbar>
        <div
          class="item-box"
          :class="{ active: item.show }"
          v-for="(item, index) in series"
          :key="index"
        >
          <div class="item-title" @click="item.show = !item.show">
            <div style="display: flex; align-items: center; gap: 5px">
              <el-image
                style="width: 28px; height: 28px"
                :src="icon"
              ></el-image>
              <span>{{ item.name }}</span>
            </div>
            <el-icon class="Tools-icon">
              <Tools />
            </el-icon>
          </div>
          <el-collapse-transition>
            <div class="list-group" v-show="item.show">
              <template v-for="(option, index) in item.options" :key="index">
                <el-checkbox
                  v-model="option.value"
                  :label="option.name"
                  @change="checkboxChange($event, option, item)"
                  size="large"
                />
              </template>
            </div>
          </el-collapse-transition>
        </div>
      </el-scrollbar>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useAddEvent } from "@/packages/hooks/useAddEvent.kooks";
import { CreateComponentType } from "@/packages/index.d";
import { Events } from "./config";
import icon from "./icon.png";
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});
const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events);
const { series } = toRefs(props.chartConfig.option);

function checkboxChange(value, option, seriesItem) {
  console.log(`output->`, value, option);
  getEvents.value.change(value, option, seriesItem);
}
</script>

<style lang="scss" scoped>
.item-box {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 0 5px;
  padding: 0 15px;
  text-align: center;
  background-color: rgba(24, 34, 52, 0.802);
  // border: 2px solid #50b3ff;
  border-image-source: radial-gradient(
    60% 60%,
    transparent 0px,
    transparent 100%,
    cyan 100%
  );

  // border-image-slice: 1;
  // border-width: 1px;
  // border-style: solid;
  // border-image-outset: 1cm;
  .item-title {
    display: flex;
    width: 100%;
    height: 55px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 20px;
    letter-spacing: 1px;
    line-height: 60px;
    color: #deefff;

    .Tools-icon {
      transform: rotate(180deg);
      transition: all 1s ease-in-out;

      &:hover {
        color: #00fbfe;
      }
    }
  }

  .list-group {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 15px;
    padding: 0 15px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  &::before,
  &::after,
  & .item-title::before,
  & .item-title::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 13px;
    border: 3px solid #50b3ff;
  }

  &::before {
    bottom: 0;
    left: 0;
    border-top: 0;
    border-right: 0;
  }

  &::after {
    bottom: 0;
    right: 0;
    border-top: 0;
    border-left: 0;
  }

  & .item-title::before {
    top: 0;
    left: 0;
    border-bottom: 0;
    border-right: 0;
  }

  & .item-title::after {
    top: 0;
    right: 0;
    border-bottom: 0;
    border-left: 0;
  }

  :deep(.el-checkbox) {
    .el-checkbox__inner {
      width: 18px;
      height: 18px;
      border: 1px solid #537fbf;
      border-radius: 2px;

      &:after {
        width: 6px;
        height: 10px;
      }
    }

    .el-checkbox__label {
      font-size: 16px;
    }
  }
}

.active {
  .item-title {
    .Tools-icon {
      transform: rotate(-180deg);
    }
  }
}
</style>

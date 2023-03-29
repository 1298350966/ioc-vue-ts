<template>
  <div class="ChartAnimation">
    <el-button
      class="clear-btn"
      type="primary"
      :disabled="!targetData.styles.animations.length"
      @click="clearAnimation"
    >清除动画</el-button>
   
    <el-collapse v-model="collapseActive">
    <!-- 右侧 -->
    <el-collapse-item v-for="(item,index) in animations" :key="index" :title="item.label" :name="item.label">
      <div class="grid-box">
        <div
          class="column animation-item go-transition-quick"
          :class="[
            activeIndex(childrenItem.value) && 'active',
            hoverPreviewAnimate === childrenItem.value &&
              `animate__animated  animate__${childrenItem.value}`,
          ]"
          v-for="(childrenItem, index) in item.children"
          :key="index"
          @mouseover="hoverPreviewAnimate = childrenItem.value"
          @click="addAnimation(childrenItem)"
        >
          {{ childrenItem.label }}
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
    <!-- <CollapseItem
      v-for="(item, index) in animations"
      :key="index"
      :name="item.label"
      :collapseList="animations"
    >
      
    </CollapseItem> -->
  </div>
</template>

<script lang="ts" setup name="ChartAnimation">
import { ref, computed } from "vue";
import { animations } from "@/settings/animations/index";
import { useDesignStore } from "@/store/modules/designStore/designStore";
import { useTargetData } from "../hooks/useTargetData.hook";
import { CollapseItem } from "@/components/Pages/ChartItemSetting";

const collapseActive = ref([]);
// 全局颜色
const designStore = useDesignStore();

const hoverPreviewAnimate = ref("");

const { targetData } = useTargetData();

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme;
});

// * 选中的动画样式
const activeIndex = (value: string) => {
  const selectValue = targetData.value.styles.animations;
  if (!selectValue.length) return false;
  return selectValue[0] === value;
};

// * 清除动画
const clearAnimation = () => {
  targetData.value.styles.animations = [];
};

// * 新增动画，现只支持一种
const addAnimation = (item: { label: string; value: string }) => {
  targetData.value.styles.animations = [item.value];
};
</script>

<style lang="scss" scoped>
.grid-box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  gap: 10px 6px;

  .column {
    grid-column: span 1 / span 1;
  }
}

.ChartAnimation {
  // padding: 5px 10px;
  .clear-btn {
    width: 100%;
  }

  .animation-item {
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #373739;
    &:hover,
    &.active {
      color: v-bind("themeColor");
      border: 1px solid v-bind("themeColor");
    }
  }
}
</style>

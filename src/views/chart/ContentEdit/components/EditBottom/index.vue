<template>
  <div class="KH-edit-bottom">
    <span></span>
    <!-- 快捷键提示 -->
    <!-- <edit-shortcut-key /> -->

    <!-- 缩放比例 -->
    <el-space>
      <el-select
        size="small"
        class="scale-btn"
        v-model="filterValue"
        :disabled="lockScale"
        @change="selectHandle"
      >
        <el-option
          v-for="item in filterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-slider
        class="scale-slider"
        :min="10"
        :max="200"
        size="small"
        :marks="sliderMaks"
        :step="5"
        :format-tooltip="sliderFormatTooltip"
        v-model="sliderValue"
        @change="sliderHandle"
      />
    </el-space>

    <!-- 锁定缩放 -->

    <!-- <n-tooltip trigger="hover">
        <template #trigger>
          <n-button @click="lockHandle" text>
            <n-icon
              class="lock-icon"
              :class="{ color: lockScale }"
              size="18"
              :depth="2"
            >
              <lock-closed-outline-icon v-if="lockScale"></lock-closed-outline-icon>
              <lock-open-outline-icon v-else></lock-open-outline-icon>
            </n-icon>
          </n-button>
        </template>
        <span>{{ lockScale ? '解锁' : '锁定' }}当前比例</span>
      </n-tooltip> -->

    <!-- 拖动 -->

    <!-- <n-slider
        class="scale-slider"
        v-model="sliderValue"
        :default-value="50"
        :min="10"
        :max="200"
        :step="5"
        :format-tooltip="sliderFormatTooltip"
        :disabled="lockScale"
        :marks="sliderMaks"
        @update:value="sliderHandle"
     ></n-slider> -->
  </div>
</template>

<script setup lang="ts">
import "./var.scss"
import { reactive, ref, toRefs, watchEffect } from "vue";
import { icon } from "@/plugins";
// import { EditHistory } from '../EditHistory/index'
// import EditShortcutKey from '../EditShortcutKey/index.vue'
import { useDesignStore } from "@/store/modules/designStore/designStore";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { EditCanvasTypeEnum } from "@/store/modules/chartEditStore/chartEditStore.d";
const { LockClosedOutlineIcon, LockOpenOutlineIcon } = icon.ionicons5;

// 全局颜色
const designStore = useDesignStore();
const themeColor = ref(designStore.getAppTheme);

const chartEditStore = useChartEditStore();
const { lockScale, scale } = toRefs(chartEditStore.getEditCanvas);

// 缩放选项
let filterOptions = [
  {
    label: "200%",
    value: 200,
  },
  {
    label: "150%",
    value: 150,
  },
  {
    label: "100%",
    value: 100,
  },
  {
    label: "50%",
    value: 50,
  },
  {
    label: "自适应",
    value: 0,
  },
];

// 选择值
const filterValue = ref("");

// 用户自选择
const selectHandle = (v: number) => {
  if (v === 0) {
    chartEditStore.computedScale();
    return;
  }
  chartEditStore.setScale(v / 100);
};

// 点击锁处理
const lockHandle = () => {
  chartEditStore.setEditCanvas(EditCanvasTypeEnum.LOCK_SCALE, !lockScale.value);
};

// 拖动
const sliderValue = ref(100);

// 拖动格式化
const sliderFormatTooltip = (v: number | string) => `${v}%`;

// 拖动处理
function sliderHandle(v:any){
  chartEditStore.setScale(v / 100);
};

const sliderMaks = reactive({
  100: "",
});

// 监听 scale 变化
watchEffect(() => {
  const value = (scale.value * 100).toFixed(0);
  filterValue.value = `${value}%`;
  sliderValue.value = parseInt(value);
});
</script>

<style lang="scss" scoped>
$min-width: 500px;

.KH-edit-bottom {
  --el-color-white:rgba(255, 255, 255, 0.82);;
  
  width: 100%;
  min-width: $min-width;
  padding: 0 10px;
  padding-bottom: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  :deep(.scale-btn) {

    width: 90px;
    font-size: 12px;
    .el-input__wrapper{
       background:rgba(255, 255, 255, 0.1);
       box-shadow:none;
    }
    .el-input__inner{
      --el-input-text-color:rgba(255, 255, 255, 0.82);
    }
  }

  :deep(.scale-slider) {
    --el-slider-runway-bg-color:rgba(255, 255, 255, 0.1);
    position: relative;
    width: 120px;
  }

}
</style>

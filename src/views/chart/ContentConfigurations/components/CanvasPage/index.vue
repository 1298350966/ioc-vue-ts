<template>
  <div class="kh-canvas-setting">
    <el-form inline size="small" label-placement="left">
      <el-form-item label="宽度" style="width: 45%">
        <!-- 尺寸选择 -->
        <el-input-number
          size="small"
          v-model="canvasConfig.width"
          :disabled="editCanvas.lockScale"
          :min="50"
          @change="changeSizeHandle"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="高度" style="width: 45%">
        <el-input-number
          size="small"
          v-model="canvasConfig.height"
          :disabled="editCanvas.lockScale"
          :min="50"
          @change="changeSizeHandle"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <el-upload
      v-model:file-list="uploadFileListRef"
      class="upload-box"
      :show-file-list="false"
      :http-request="customRequest"
      :before-upload="beforeUploadHandle"
      drag
    >
      <el-image
        fit="cover"
        v-if="canvasConfig.backgroundImage"
        class="upload-show"
        :src="canvasConfig.backgroundImage"
      />
      <div class="upload-img" v-else>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处或单击以上载</div>
      </div>

      <template #tip>
        <div class="el-upload__tip">
          背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif的文件
        </div>
      </template>
    </el-upload>
    <el-form size="small" label-placement="left">
      <el-form-item label="背景颜色">
        <el-color-picker
          v-model="canvasConfig.background"
          show-alpha
          :predefine="swatchesColors"
        />
      </el-form-item>
      <el-form-item label="颜色应用">
        <el-switch v-model="canvasConfig.selectColor" />
      </el-form-item>
      <el-form-item label="适配方式">
        <el-button-group>
          <template v-for="item in previewTypeList">
            <el-tooltip :content="item.desc">
              <el-button
                style="width: 23%"
                :key="item.key"
                :type="
                  canvasConfig.previewScaleType === item.key ? 'primary' : ''
                "
                @click="selectPreviewType(item.key)"
              >
                <component :is="item.icon" style="width: 16px"></component>
              </el-button>
            </el-tooltip>
          </template>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { backgroundImageSize } from "@/settings/designSetting";
import { FileTypeEnum } from "@/enums/fileTypeEnum";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { EditCanvasConfigEnum } from "@/store/modules/chartEditStore/chartEditStore.d";
// import { StylesSetting } from '@/components/Pages/ChartItemSetting'
// import { UploadCustomRequestOptions } from 'naive-ui'
import { fileToUrl, loadAsyncComponent } from "@/utils";
import { PreviewScaleEnum } from "@/enums/styleEnum";
import { icon } from "@/plugins";
const { ColorPaletteIcon } = icon.ionicons5;
const { ScaleIcon, FitToScreenIcon, FitToHeightIcon, FitToWidthIcon } =
  icon.carbon;

const chartEditStore = useChartEditStore();
const canvasConfig = chartEditStore.getEditCanvasConfig;
const editCanvas = chartEditStore.getEditCanvas;

const uploadFileListRef = ref();
const switchSelectColorLoading = ref(false);

// const ChartThemeColor = loadAsyncComponent(() =>
//   import('./components/ChartThemeColor/index.vue')
// )

// 北京默认展示颜色列表
const swatchesColors = [
  "#232324",
  "#2a2a2b",
  "#313132",
  "#373739",
  "#757575",
  "#e0e0e0",
  "#eeeeee",
  "#fafafa",
];

const globalTabList = [
  {
    key: "ChartTheme",
    title: "主题颜色",
    icon: ColorPaletteIcon,
    // render: ChartThemeColor
  },
];

const previewTypeList = [
  {
    key: PreviewScaleEnum.FIT,
    title: "自适应",
    icon: ScaleIcon,
    desc: "自适应比例展示，页面会有留白",
  },
  {
    key: PreviewScaleEnum.SCROLL_Y,
    title: "Y轴滚动",
    icon: FitToWidthIcon,
    desc: "X轴铺满，Y轴自适应滚动",
  },
  {
    key: PreviewScaleEnum.SCROLL_X,
    title: "X轴滚动",
    icon: FitToHeightIcon,
    desc: "Y轴铺满，X轴自适应滚动",
  },
  {
    key: PreviewScaleEnum.FULL,
    title: "铺满",
    icon: FitToScreenIcon,
    desc: "强行拉伸画面，填充所有视图",
  },
];

// 画布尺寸规则
const validator = (x: number) => x > 50;

// 修改尺寸
const changeSizeHandle = () => {
  chartEditStore.computedScale();
};

// 上传图片前置处理
//@ts-ignore
const beforeUploadHandle = async (file) => {
  console.log(file);
  uploadFileListRef.value = [];
  const type = file.type;
  const size = file.size;

  if (size > 1024 * 1024 * backgroundImageSize) {
    window["$message"].warning(
      `图片超出 ${backgroundImageSize}M 限制，请重新上传！`
    );
    return false;
  }
  if (
    type !== FileTypeEnum.PNG &&
    type !== FileTypeEnum.JPEG &&
    type !== FileTypeEnum.GIF
  ) {
    window["$message"].warning("文件格式不符合，请重新上传！");
    return false;
  }
  return true;
};

// 清除背景
const clearImage = () => {
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.BACKGROUND_IMAGE,
    undefined
  );
  chartEditStore.setEditCanvasConfig(EditCanvasConfigEnum.SELECT_COLOR, true);
};

// 清除颜色
const clearColor = () => {
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.BACKGROUND,
    undefined
  );
  if (canvasConfig.backgroundImage) {
    chartEditStore.setEditCanvasConfig(
      EditCanvasConfigEnum.SELECT_COLOR,
      false
    );
  }
};

// 启用/关闭 颜色
const switchSelectColorHandle = () => {
  switchSelectColorLoading.value = true;
  setTimeout(() => {
    switchSelectColorLoading.value = false;
  }, 1000);
};

// 自定义上传操作
const customRequest = (options: any) => {
  const { file } = options;
  nextTick(() => {
    if (file) {
      const ImageUrl = fileToUrl(file);
      chartEditStore.setEditCanvasConfig(
        EditCanvasConfigEnum.BACKGROUND_IMAGE,
        ImageUrl
      );
      chartEditStore.setEditCanvasConfig(
        EditCanvasConfigEnum.SELECT_COLOR,
        false
      );
    } else {
      window["$message"].error("添加图片失败，请稍后重试！");
    }
  });
};

// 选择预览方式
const selectPreviewType = (key: PreviewScaleEnum) => {
  chartEditStore.setEditCanvasConfig(
    EditCanvasConfigEnum.PREVIEW_SCALE_TYPE,
    key
  );
};
</script>

<style lang="scss" scoped>
$updloadWidth: 326px;
$updloadHeight: 193px;

:deep(.el-form-item:last-child) {
  margin-right: 0;
}
:deep(.el-upload) {
  .el-upload-dragger {
    padding: 5px;
    display: flex;
    align-items: center;
  }
}
.kh-canvas-setting {
  // padding: 10px;

  .upload-box {
    cursor: pointer;
    margin-bottom: 20px;

    .upload-show {
      width: -webkit-fill-available;
      height: $updloadHeight;
      border-radius: 5px;
    }

    .upload-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: $updloadHeight;
      width: -webkit-fill-available;
      img {
        height: 150px;
      }

      .upload-desc {
        padding: 10px 0;
      }
    }
  }

  .icon-position {
    padding-top: 2px;
  }

  .tabs-box {
    margin-top: 20px;
  }
}
</style>

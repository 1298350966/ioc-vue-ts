<template>
 <div class="kh-content-box">
  <div v-if="showTop" class="top go-mt-0 kh-flex-no-wrap">
    <el-space class="kh-flex-no-wrap">
       <span>{{ title }}</span>
       <span class="mt-1">
          <slot name="icon"></slot>
        </span>
    </el-space>
    <el-space>
      <slot name="top-right"></slot>
      <!-- <el-icon v-show="backIcon" :size="20" :color="color" @click="backHandle">
        <ArrowLeftBold />
      </el-icon> -->
    </el-space>
  </div>
  <el-scrollbar class="content" view-style="height:100%;">
    <slot></slot>
  </el-scrollbar>
  
  <div v-if="showBottom" class="bottom go-mt-0">
      <slot name="bottom"></slot>
    </div>
    <div class="aside">
      <slot name="aside"></slot>
    </div>
 </div>
</template>
<script setup lang="ts">

const emit = defineEmits(['back'])

defineProps({
  title: String,
  showTop: {
    type: Boolean,
    default: true
  },
  showBottom: {
    type: Boolean,
    default: false
  },
  flex: {
    type: Boolean,
    default: false
  },
  // back
  backIcon: {
    type: Boolean,
    default: true
  },
  // 背景深度
  depth: {
    type: Number,
    default: 1
  },
  // x 轴滚动
  xScroll: {
    type: Boolean,
    default: false
  }
})

const backHandle = () => {
  emit('back')
}
</script>


<style lang="scss" scoped>
$topOrBottomHeight: 40px;
.kh-content-box{
  height: 100%;
  margin: 1px;
  margin-bottom: 0;
  display: flex;
  flex-flow: column;
  .content{
    flex: 1;
    overflow: hidden;
  }
  .top,
  .bottom {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    height: $topOrBottomHeight;
    padding: 0 10px;
    // border-top: 1px solid;
    background-color:$--color-dark-bg-3;
    .mt-1 {
      margin-top: 2px;
    }
  }
}
</style>
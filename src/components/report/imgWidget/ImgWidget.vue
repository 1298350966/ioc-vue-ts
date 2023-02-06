<template>
<div class="scrollBar">
    <a @click="openUrl">
        <el-image
            style="width: 100%; height: calc(100% - 3px)"
            :src="imageWidgetData.imageUrl"
            :fit="imageWidgetData.style.fit"
        ></el-image>
    </a>
</div>
</template>
<script>
    export default {
        name: 'ImgWidget',
        props: {
            imageWidgetData: {required: true, type: Object},
        },
        methods: {
            openUrl() {
                if (!this.KHUtils.isNull(this.imageWidgetData.imageUrl) && !this.KHUtils.isNull(this.imageWidgetData.adjustUrl)) {
                    window.open(this.imageWidgetData.adjustUrl);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.scrollBar{
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  overflow:auto;
}
</style>

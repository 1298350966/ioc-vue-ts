<template>
    <a @click="openUrl">
        <el-image
            style="width: 100%; height: 100%"
            :src="imageWidgetData.imageUrl"
            :fit="imageWidgetData.style.fit"
        ></el-image>
    </a>
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
<style>
</style>

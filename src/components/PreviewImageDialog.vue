<template>
    <el-image-viewer 
      style="z-index:9999"
      append-to-body
      v-if="visibleDialog" 
      :on-close="closeImgViewer" 
      :url-list="[getImgeUrl(imageId)]" />
    <!-- <el-dialog title="图片" :visible.sync="visibleDialog" v-if="visibleDialog" :modal="false" width="50%"
               :close-on-click-modal="false">
        <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="2"></el-col>
            <el-col :span="14">
                <el-image   :src="getImgeUrl(imageId)" style="width: 100%;height: 100%">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
            </el-col>
            <el-col :span="2"></el-col>
        </el-row>

    </el-dialog> -->
</template>

<script>
    export default {
        name:"PreviewImageDialog",
        props:['visible','imageId'],
        components:{
            'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
        },
        computed:{
            getImgeUrl(){
                return function (imageUrl) {
                    //如果是完整图片路径直接返回 ，如果是uuid 就补齐路径
                    if(this.KHUtils.isUrlPath(imageUrl) == true){
                        return imageUrl;
                    }else {
                        return this.khConfig.host.rest+ this.khConfig.api.imageDownload + "/" + imageUrl;
                    }

                }
            },
            visibleDialog:{
                get(){
                    return this.visible
                },
                set(value){
                    console.log(value);
                    this.$emit("update:visible",value)
                }
            }
        },
        methods:{
            closeImgViewer(){
                this.visibleDialog = false
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>

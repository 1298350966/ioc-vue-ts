<template>
    <div class="report-set-margin-let">
        <div class="secondary-font-color" style="margin-top: 10px">控件</div>
        <div style="margin-bottom: 10px">
            <span class="secondary-font-color">背景颜色</span>
            <el-color-picker v-model="item.backgroundColor" show-alpha></el-color-picker>
            <span class="secondary-font-color">边框颜色</span>
            <el-color-picker v-model="item.borderColor" show-alpha></el-color-picker>
        </div>
        <div class="secondary-font-color" style="margin-top: 10px">填充边距</div>
        <div style="margin-bottom: 10px">
            <el-tooltip class="item" effect="dark" content="上内边距">
                <el-input-number v-model="item.paddingTop" style="width: 20%"></el-input-number>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="右内边">
                <el-input-number v-model="item.paddingRight" style="width: 20%"></el-input-number>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下内边距">
                <el-input-number v-model="item.paddingBottom" style="width: 20%"></el-input-number>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="左内边距">
                <el-input-number v-model="item.paddingLeft" style="width: 20%"></el-input-number>
            </el-tooltip>
        </div>
        <div class="secondary-font-color" style="margin-top: 10px">主标题</div>
        <div style="margin-bottom: 10px">
            <el-input class="report-set-style" style="width: 90%"
                      v-model="item.style.mainTitle"></el-input>
            <el-color-picker v-model="item.style.mainTitleColor" show-alpha></el-color-picker>
        </div>
        <div class="secondary-font-color" style="margin-top: 10px">嵌入形式</div>
        <div class="secondary-font-color" style="margin-top: 10px">
            <el-radio-group v-model="item.innerType" @change="changeInnerType">
                <el-radio  label="0">链接</el-radio>
                <el-radio  label="1">Vue组件</el-radio>
                <el-radio  label="2">普通表单</el-radio>
                <el-radio  label="3">报表</el-radio>
            </el-radio-group>

        </div>

        <div style="margin-bottom: 10px">
        </div>
        <div v-show="item.innerType==='0'">
            <span class="secondary-font-color">链接</span>
            <el-input
                class="report-set-style imageMarginTop"
                placeholder="请输入页面地址"
                v-model="item.src"
                clearable>
            </el-input>
        </div>
        <div v-show="item.innerType==='1'">
            <span class="secondary-font-color">组件路径(以@/views/或@/components/开头路由文件)</span>
            <el-input v-model="item.src" style="width:300px"
                      placeholder="例@/views/Redirect或@/components/Constants"
                      @blur="checkComponentUrl(item.src)"></el-input>
            <el-tooltip class="item" effect="dark" content="校验路径的是否正确" placement="top">
                <i class="el-icon-circle-check" style="color:#409EFF"
                   @click="checkComponentUrl(item.src)"></i>
            </el-tooltip>
        </div>
        <div v-show="item.innerType==='2'">
            <form-inner-form-set :item="item" :dynCols="dynCols" @notifyUpdateInnerComponent="notifyUpdateInnerComponent"></form-inner-form-set>
        </div>
        <div v-show="item.innerType==='3'">
            <form-inner-report-set :item="item" :dynCols="dynCols" @notifyUpdateInnerComponent="notifyUpdateInnerComponent"></form-inner-report-set>
        </div>

        <div style="margin-top: 10px;margin-bottom: 10px"  v-if="item.innerType==='0' || item.innerType==='1'">
            <span class="secondary-font-color">传参设置</span>
            <el-button type="primary" icon="el-icon-plus" circle @click.native="addParams"></el-button>
            <div v-if="item.params instanceof Array && item.params.length >0" v-for="(param,index) in item.params" :key="index" style="margin-bottom: 10px;padding-right: 10px">
                <el-row :span="24">
                    <el-col :span="10">
                        <el-select v-model="param.model" placeholder="请选择参数">
                            <el-option
                                v-for="col in dynCols"
                                :key="col.model"
                                :label="col.name"
                                :value="col.model">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10" style="margin-left: 5px;margin-right: 5px">
                        <el-input v-model="param.paramName" placeholder="请输入接收参数名称"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" icon="el-icon-delete" circle @click.native="deleteParams(index)"></el-button>
                    </el-col>
                </el-row>

            </div>
        </div>
    </div>
</template>

<script>
    import FormInnerReportSet from "@/components/form-design/restructure/innerPageWidget/FormInnerReportSet.vue";
    import FormInnerFormSet from "@/components/form-design/restructure/innerPageWidget/FormInnerFormSet.vue";
    export default {
        name: "InnerPageWidgetSet",
        components:{
            FormInnerReportSet,
            FormInnerFormSet
        },
        created() {
        },
        props: {
            item: {required: true, type: Object},
            dynCols:{type:Array}
        },
        data() {
            return {}
        },
        watch: {},
        methods: {
            // 校验Vue组件的路径是否正确
            checkComponentUrl(url) {
                let _this = this;
                if (_this.KHUtils.isNull(url)) {
                    _this.$message.error("组件路径填写有误或组件不存在,请核对后再重新输入");
                    return false;
                }
                let componentName = url.substring(url.lastIndexOf('/') + 1, url.length);
                let flag = _this.KHForm.registerComponent(componentName, url);
                if (flag) {
                    _this.$message.success("组件路径填写正确");
                    _this.$emit("notifyUpdateInnerComponent");
                } else {
                    _this.$message.error("组件路径填写有误或组件不存在,请核对后再重新输入");
                }
            },
            notifyUpdateInnerComponent(){
                this.$emit("notifyUpdateInnerComponent");
            },
            changeInnerType(value){
                this.item.targetId = null;
                this.item.targetName = "";
                this.item.params = [];

            },
            addParams(){
                
                if(this.KHUtils.isNull(this.item.params)){
                    this.$set(this.item,'params',[]);
                }
                let obj = {model:"",paramName:""};
                this.item.params.push(obj);
            },
            deleteParams(index){
                if(this.item.params instanceof Array && this.item.params.length >0){
                    this.item.params.splice(index,1)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/report/report-set.scss";
</style>

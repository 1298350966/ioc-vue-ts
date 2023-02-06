<template>
    <div>
        <el-card class="box-card my-card" >
            <div class="title"><b>{{currentQrCode.name}}</b></div>
            <div style="text-align: center" v-loading="qrCodeLoading">
                <div class="qr-code">
                    <vue-qr v-if="JSON.stringify(currentQrCode) != '{}'"
                            :text="getQrCodeUrl(currentQrCode,currentQrCode.id)"
                            ref="qrCode"
                            :correctLevel="3"
                            :size="180"
                            :margin="0"
                            colorDark="black"
                            colorLight="white"
                            backgroundColor="white"
                            backgroundDimming="white"
                            :logoScale=".2"
                            :logoMargin="5"
                            logoBackgroundColor="white"
                    ></vue-qr>
                    <div v-else style="height: 180px;line-height: 180px;font-size: 16px">未设置二维码</div>
                </div>
            </div>
            <div class="title-bottom">
                <span>请使用</span>
                <span style="color: #409EFF">「白告云APP」</span>
                <span>扫一扫填写</span>
            </div>
            <div style="text-align: center">
                <el-select v-model="currentQrCodeId" placeholder="请选择" style="width: 200px">
                    <el-option
                        v-for="item in qrCodeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </el-card>
        <div style="text-align: center;margin-top: 10px;margin-bottom: 30px">
            <el-button type="primary" @click="!KHUtils.isNull(currentQrCode.id)?downloadQrCode(currentQrCode.id,currentQrCode.name):downloadDefaultQrCode()" size="medium">保存到本地</el-button>
        </div>
    </div>
</template>

<script>
    import vueQr from "vue-qr"; //引入二维码生成组件
    export default {
        name:"QrCodeManager",
        props:['formId','qrCodeType','dataId'],
        components:{vueQr},
        computed: {
            getQrCodeUrl() {
                return function (item,id) {
                    let url = "";
                    if(this.KHUtils.isNull(id)){
                        if(this.qrCodeType == "add"){
                            url = "formId="+this.formId+"&qrCodeType="+this.qrCodeType;
                        }else if(this.qrCodeType == "query" || this.qrCodeType == "edit"){
                            url = "formId="+this.formId+"&qrCodeType="+this.qrCodeType+"&dataId="+this.dataId;
                        }
                    }else {
                        if(item.isDefault){
                            if(this.qrCodeType == "add"){
                                url = "formId="+this.formId+"&qrCodeType="+this.qrCodeType;
                            }else if(this.qrCodeType == "query" || this.qrCodeType == "edit"){
                                url = "formId="+this.formId+"&qrCodeType="+this.qrCodeType+"&dataId="+this.dataId;
                            }
                        }else {
                            if(this.qrCodeType == "add"){
                                url = "formId="+this.formId+"&qrCodeType="+this.qrCodeType+"&id="+id;
                            }else if(this.qrCodeType == "query" || this.qrCodeType == "edit"){
                                url = "formId="+this.formId+"&qrCodeType="+this.qrCodeType+"&id="+id+"&dataId="+this.dataId;
                            }
                        }

                    }


                    return url;
                };
            },
        },
        watch: {
            qrCodeType(val) {
                this.initQrCode();
            },
            currentQrCodeId(val){
                this.currentQrCode = {};
                if(this.qrCodeList instanceof Array && this.qrCodeList.length >0){
                    for(var i = 0;i<this.qrCodeList.length;i++){
                        let item = this.qrCodeList[i];
                        if(item.id == val){
                            this.currentQrCode = item;
                        }
                    }
                }
            },
        },
        mounted(){
            this.initQrCode();
        },
        data(){
            return {
                qrCodeConf:{},
                qrCodeList:[],
                currentQrCode:{},
                currentQrCodeId:"",
                qrCodeLoading:false
            }
        },
        methods: {
            initQrCode(){
                let _this = this;
                if(!_this.formId){
                    return;
                }
                _this.qrCodeConf = {};
                _this.qrCodeList = [];
                _this.currentQrCode = {};
                _this.currentQrCodeId = "";
                _this.qrCodeLoading = true;
                _this.$Get(_this.khConfig.api.queryFormSetByFormId + "/" + _this.formId, null).then(res => {
                    _this.qrCodeLoading = false;
                    if (res.errCode === 0) {
                        if (res.data && !_this.KHUtils.isNull(res.data.qrCodeConf)) {
                            _this.qrCodeConf = JSON.parse(res.data.qrCodeConf);
                            if(_this.qrCodeConf && _this.qrCodeConf[_this.qrCodeType] && _this.qrCodeConf[_this.qrCodeType] instanceof Array && _this.qrCodeConf[_this.qrCodeType].length >0){
                                _this.qrCodeConf[_this.qrCodeType].forEach((item,index)=>{
                                    if(item.isShow){
                                        _this.qrCodeList.push(item);
                                    }
                                })
                                _this.currentQrCodeId = _this.qrCodeList[0].id;



                            }
                        }else {
                            //添加默认二维码
                            let obj = {
                                name:"默认",
                                id:""
                            }
                            _this.qrCodeList.push(obj);
                            _this.currentQrCodeId = _this.qrCodeList[0].id;
                            _this.currentQrCode = _this.qrCodeList[0];
                        }

                    }
                })
            },
            // 二维码下载
            downloadQrCode(id,name) {
                //const iconUrl = this.$refs['qrCode' + id][0].$el.src;
                const iconUrl = this.$refs.qrCode.$el.src;
                let a = document.createElement('a');
                let event = new MouseEvent('click');
                a.download = name;
                a.href = iconUrl;
                a.dispatchEvent(event);
            },
            downloadDefaultQrCode() {
                const iconUrl = this.$refs.qrCode.$el.src;
                let a = document.createElement('a');
                let event = new MouseEvent('click');
                let name = "";
                if(this.qrCodeType == "add"){
                    name="默认新增";
                }else if(this.qrCodeType == "edit"){
                    name="默认编辑";
                }else if(this.qrCodeType == "query"){
                    name="默认查看";
                }
                a.download = name;
                a.href = iconUrl;
                a.dispatchEvent(event);
            },
        }
    }
</script>

<style scoped lang="scss">
    .my-card{
        margin-top: 30px;
        margin-bottom: 30px;
        margin-left: 30px;
        margin-right: 30px;
        padding-bottom: 20px;
    }
    .title{
        text-align: center;
        margin-top: 15px;
        font-size: 20px;
        margin-bottom: 15px;
    }
    .title-bottom{
        font-size: 14px;
        color: #909399;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .qr-code{
        text-align: center;
        border: 5px solid #68A9FB;
        width: 190px;
        height: 190px;
        display: inline-block;
    }
</style>

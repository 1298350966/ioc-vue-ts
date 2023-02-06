<template>
  <div class="IconSetting">
        <el-button type="primary" class="update-icon" :style="iconStyle(data)"
            @click="openDialog">
            <i :class="iconClassObject(data)" style="color: white;font-size: 30px"></i>
        </el-button>
         <!-- 图标选择器对话框 -->
        <el-dialog  title="图标设置" :visible.sync="appIconSetVisible" v-if="appIconSetVisible"
            width="50%" top="5vh" custom-class="col-cond-filter-dialog"
            append-to-body :close-on-click-modal="false">
            <div class="dialog-content">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-button @click="setColor" type="primary" class="update-icon" :style="iconStyle(appIconObj)">
                        <i :class="iconClassObject(appIconObj)" style="color: white;font-size: 30px"></i>
                    </el-button>
                </el-row>
                <el-row type="flex"  style="margin-bottom: 10px" class="icon-content" >
                    <div class="icon-box" v-for="(appIcon,index) in appIcons" :key="index" @click="selectIcon(appIcon)">
                        <div class="iconI">
                            <i :class="iconClassObject(appIcon)" style="font-size: 25px;"></i>
                        </div>
                        <div class="name">{{appIcon.name}}</div>
                        <div class="iconName">{{appIcon.iconName}}</div>
                    </div>
                </el-row>

                <el-row type="flex" style="padding: 10px;border-top: 1px solid #EAF1F7;">
                    <el-button style="background-color: #409EFF;border-color: #409EFF" circle
                                @click="slectBgColor('#409EFF')"></el-button>
                    <el-button style="background-color: #67C23A;border-color: #67C23A" circle
                                @click="slectBgColor('#67C23A')"></el-button>
                    <el-button style="background-color: #E6A23C;border-color: #E6A23C" circle
                                @click="slectBgColor('#E6A23C')"></el-button>
                    <el-button style="background-color: #F56C6C;border-color: #F56C6C" circle
                                @click="slectBgColor('#F56C6C')"></el-button>
                    <el-button style="background-color: #909399;border-color: #909399" circle
                                @click="slectBgColor('#909399')"></el-button>
            
                        <el-color-picker
                            ref="colorPicker"
                            class="color-picker"
                            v-model="appIconObj.iconBgColor"
                            show-alpha
                            :predefine="predefineColors"
                            size="small">
                        </el-color-picker>
                </el-row>
            </div>
       
            <template v-slot:footer>
                <el-button size="small" @click="appIconSetVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="setAppIcon">确定</el-button>
            </template>
        </el-dialog>
  </div>
</template>

<script>
import { appIcons } from '@static/MicroAppIcon/MicroAppIcons.js';
export default {
    props:{
        data:{
            type:Object,
            default:function(){
                return {
                    iconName:"",
                    iconBgColor:"",
                }
            }
        }
    },
    data() {
        return {
            appIconSetVisible:false,
            appIcons:appIcons,
            appIconObj:{
                iconName:"",
                iconBgColor:"",
            },
            predefineColors: [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577'
            ]
        }
    },
    computed:{
        iconClassObject(){
            return function (appIcon) {
                let classObject = {};
                classObject.icon = true;
                classObject.KHIcon = true;
                classObject[appIcon.iconName] = true;
                return classObject;
            }
        },
        iconStyle(){
            return function (data) {
                let styleObj = {};
                styleObj.backgroundColor = data.iconBgColor;
                styleObj.borderColor = data.iconBgColor;
                return styleObj;
            }

        },
    },
    methods:{
        setColor(){
            this.$refs.colorPicker.$el.click()
            console.log(this.$refs.colorPicker) 
        },
        openDialog(){
            this.appIconObj.iconName = this.data.iconName
            this.appIconObj.iconBgColor = this.data.iconBgColor
            this.appIconSetVisible = true
        },
         //选择图标
        selectIcon(appIcon){
            this.appIconObj.iconName = appIcon.iconName;
        },
        //改变背景色
        slectBgColor(color){
            this.appIconObj.iconBgColor = color;
        },
        setAppIcon(){
            this.data.iconName = this.appIconObj.iconName
            this.data.iconBgColor = this.appIconObj.iconBgColor
            this.appIconSetVisible = false
            this.appIconObj.iconName = ""
            this.appIconObj.iconBgColor = ""
        }
    }

}
</script>

<style lang="scss" scoped>
    .update-icon {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    .dialog-content{
        .row-bg{
            margin-bottom: 10px;
        }
        .icon-content {
            max-height: 55vh;
            overflow-y: auto;
            flex-flow:wrap;
            white-space: nowrap;
            text-overflow: ellipsis;
            justify-content: space-between;
            .icon-box{
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
                width: 100px;
                height: 100px;
                text-align: center;
                &:hover{
                    background: #0000000d;
                    border-radius: 10px;
                }
                .iconI{
                    line-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .name,.iconName{
                    overflow: hidden;
                    line-height: 15px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width:90%;
                    font-size: 10px;
                }
            }
        }
    }
    
     ::v-deep.color-picker{
        // position: absolute;
        // top: 50%;
        // right: 0;
        // transform: translate(0, -40%);
        width: 20px;
        height: 20px;
        .el-color-picker__trigger{
            width: 20px;
            height: 20px;
            padding: 0;
            margin-left: 10px;
            border: none;
             .el-color-picker__color.is-alpha{
                width: 20px;
                height: 20px;
                border-radius: 50%;
                .el-color-picker__color-inner{
                    border-radius: 50%;
                }
            }
        }
     }
     
</style>


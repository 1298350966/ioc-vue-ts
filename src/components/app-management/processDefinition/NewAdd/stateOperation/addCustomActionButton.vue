<template>
  <div class="addCustomActionButton">
    <el-form>
      <el-form-item label="名称">
        <el-input style="width: 50%" v-model="customBtnConfig.label"></el-input>
      </el-form-item>
      <!-- <el-form-item label="处理状态：">
        <el-checkbox-group v-model="customBtnConfig.pageType">
          <el-checkbox
            label="0"
            >未处理</el-checkbox
          >
          <el-checkbox
            label="1"
            >已处理</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item label="控件条件：">
        <!-- <el-checkbox-group v-model="customBtnConfig.state">
          <el-checkbox
            v-for="(item, index) in stateConfig"
            :key="index"
            :label="item.label"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <div style="display: flex;">
              <el-row >
                <el-row  @click.native="addBtnCondition">
                    <span>条件</span>
                    <i class="el-icon-plus"></i>
                </el-row>
                <el-row v-for="(cond,index) in customBtnConfig.cond" :key="index" :span="24" style="margin-top: 10px">
                    <el-col :span="5">
                        <el-select v-model="cond.model" placeholder="请选择">
                            <el-option
                                v-for="item in colsArray"
                                :key="item.model"
                                :label="item.name"
                                :value="item.model">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10" style="margin-left: 10px;margin-right: 10px">
                        <el-input :value="getBtnCondValue(cond.values)" placeholder="请添加内容"  :disabled="true"></el-input>
                    </el-col>
                    <el-col :span="1" style="margin-left: 10px;margin-right: 10px">
                        <el-button type="text" @click="addBtnCondValue(cond)">添加</el-button>
                    </el-col>
                    <el-col :span="4" style="margin-left: 10px;margin-right: 10px">
                        <i class="el-icon-delete" @click="deleteBtnCondition(index)"></i>
                    </el-col>

                </el-row>
            </el-row>
        </div>
      
          <el-dialog title="添加" :visible.sync="addBtnValueDialogVisible" v-if="addBtnValueDialogVisible" :append-to-body="true"
                 custom-class="rename-excelName-dialog"
                 width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
          <el-input v-model="condValue" placeholder="请输入内容"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addBtnValueDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveBtnCondValue">确 定</el-button>
          </span>
      </el-dialog>
      </el-form-item>

      <el-form-item label="按钮颜色：">
        <el-color-picker v-model="customBtnConfig.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="跳转配置：">
          <el-link
            icon="el-icon-plus"
            @click="jumpConfigSetting"
            type="primary"
            >跳转设置</el-link
            >
      </el-form-item>
    </el-form>
      <el-dialog title="跳转配置" :visible.sync="jumpInfoSettingDialogVisible" v-if="jumpInfoSettingDialogVisible"
                   :append-to-body="true" top="15vh"
                   custom-class="jump-dialog" :close-on-click-modal="false" :close-on-press-escape="false"
                   @close="closeJumpInfoSettingDialog">
            <template v-slot:default>
                <div>
                    <jump-config :cols-list="jumpInfoSettingOptions" :form-list="formList"
                                 :jump-config="jumpInfoStartObj" :showType="configType" ref="jumpRef"></jump-config>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="closeJumpInfoSettingDialog">取消</el-button>
                <el-button type="primary" @click="saveJumpInfoSetting">确定</el-button>
            </template>
        </el-dialog>
  </div>
</template>

<script>
import JumpConfig from '@/components/JumpConfig'
export default {
    props:["customBtnConfig","formDataconfig","stateConfig"],
    components:{JumpConfig},
    data() {
        return {
            configType:"optButtons",
            jumpInfoStartObj:{},
            formList:[],
            jumpInfoSettingOptions:[],
            colsArray:[],
            allCols:[],
            jumpInfoSettingDialogVisible:false,
            addBtnValueDialogVisible:false,
            currentBtnCond:null,
            condValue:"",
        }
    },
    computed:{
        getBtnCondValue() {
          return function (values) {
            if(values instanceof Array && values.length >0){
                return values.join(",");
            }else {
                return "";
            }
          };
        },
    },
    mounted(){
        this.initColsArray()
        this.listFormConf()
        
    },
    methods:{
        saveBtnCondValue(){
            if(!this.KHUtils.isNull(this.condValue)){
                this.currentBtnCond.values.push(this.condValue);
            }
            this.addBtnValueDialogVisible = false;
        },
        deleteBtnCondition(index){
            if(this.customBtnConfig.cond instanceof Array && this.customBtnConfig.cond.length >0){
                this.customBtnConfig.cond.splice(index,1)
            }
        },
        addBtnCondValue(cond){
            this.condValue = "";
            this.currentBtnCond = cond;
            this.addBtnValueDialogVisible = true;
        },
        addBtnCondition(){
            if(this.KHUtils.isNull(this.customBtnConfig.cond)){
                this.$set(this.customBtnConfig,'cond',[]);
            }
            let obj = {
                model:"",
                values:[]
            }
            this.customBtnConfig.cond.push(obj);
        },
        jumpConfigSetting(){
            this.jumpInfoSettingDialogVisible = true
            this.jumpInfoStartObj = this.KHUtils.clone(this.customBtnConfig.jumpInfo) || {}
        },
        initColsArray(){
            if(this.formDataconfig){
                let _this =this
                this.formDataconfig.forEach(val => {
                    if (val.type === 'grid') {
                        this.loop(val, _this);
                    }else if ("table" == val.type) {

                    } else {
                        _this.allCols.push(val);
                        if (val.type === 'data_select' || val.type === 'org_select'
                        || val.type === 'user_select'
                        || val.type === 'company_select'
                        || val.type === 'role_select'
                        || val.type === 'dic_select' || val.type === 'current_user') {
                        _this.KHForm.processDataSourceControl(val, _this.colsArray, _this);
                    } else if (val.type === 'gis_select') {
                        _this.KHForm.processGisControl(val, _this.colsArray, _this);
                    } else if (val.type === 'region_select') {
                        _this.KHForm.processRegionControl(val, _this.colsArray, _this);
                    } else {
                        let temp = _this.KHUtils.clone(val);
                        if (temp.type === 'radio' || temp.type === 'select') {
                            // 查询条件设置,取消关联控件的设置
                            if (temp.options.options) {
                                if (temp.options.options instanceof Array) {
                                    temp.options.options.forEach(obj => {
                                        if (obj.relatedList) {
                                            obj.relatedList = [];
                                        }
                                    })
                                }
                            }
                        }
                        _this.colsArray.push(temp);
                    }
                    }
                })
                this.initJumpInfoSettingData()
            }
        },
        loop(obj, _this) {
                if (obj.columns) {
                    obj.columns.forEach(cs => {
                        cs.list.forEach(ls => {
                            _this.allCols.push(ls);
                            if (ls.type === 'data_select' || ls.type === 'org_select'
                                || ls.type === 'user_select'
                                || ls.type === 'company_select'
                                || ls.type === 'role_select'
                                || ls.type === 'dic_select'
                                || ls.type === 'current_user') {
                                _this.KHForm.processDataSourceControl(ls, _this.colsArray, _this);
                            } else if (ls.type === 'gis_select') {
                                _this.KHForm.processGisControl(ls, _this.colsArray, _this);
                            } else if (ls.type === 'region_select') {
                                _this.KHForm.processRegionControl(ls, _this.colsArray, _this);
                            } else {
                                let temp = _this.KHUtils.clone(ls);
                                if (temp.type === 'radio' || temp.type === 'select') {
                                    // 查询条件设置,取消关联控件的设置
                                    if (temp.options.options) {
                                        if (temp.options.options instanceof Array) {
                                            temp.options.options.forEach(obj => {
                                                if (obj.relatedList) {
                                                    obj.relatedList = [];
                                                }
                                            })
                                        }
                                    }
                                }
                                _this.colsArray.push(temp);
                            }
                            if (ls.columns) {
                                _this.loop(ls, _this);
                            }
                        })
                    })
                }
            },
        listFormConf() {
                let _this = this;
                let param = {
                    flag: 0,
                    pageNum: 1,
                    pageSize: 1000
                };
                _this.formList = [];
                _this.$Get(_this.khConfig.api.listFormConf, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            if (res.datas != null && res.datas instanceof Array && res.datas.length > 0) {
                                res.datas.forEach(item => {
                                    let formObj = {};
                                    formObj.formName = item.formName;
                                    formObj.formId = item.formId + "";
                                    _this.formList.push(formObj);
                                })
                            }
                        }
                    });
            },
         initJumpInfoSettingData() {
                this.colsArray.forEach(cr => {
                    if (!this.KHUtils.isNull(cr.name)) {
                        // 子表单,标签不再父表单结果列,导入导出中显示
                        if (cr.type !== 'table' && cr.type !== 'flow_table' && cr.type !== 'text' && cr.type !== 'grid') {
                            let newObj = {};
                            newObj.id = cr.model;
                            newObj.name = cr.name;
                            newObj.isSelected = false;
                            newObj.paramName = cr.model;
                            this.jumpInfoSettingOptions.push(({
                                id: newObj.id,
                                name: newObj.name,
                                paramName: newObj.id
                            }));
                        }
                    }
                });
            },
            closeJumpInfoSettingDialog() {
                this.jumpInfoSettingDialogVisible = false;
            },
             saveJumpInfoSetting() {
                let _this = this;
                _this.$refs.jumpRef.submitData();
                let obj = _this.KHUtils.clone(_this.jumpInfoStartObj);
                console.log('obj',obj);
                let jumpInfo = {};
                jumpInfo.formId = obj.formId;
                jumpInfo.type = obj.type;
                jumpInfo.urlType = obj.urlType;
                jumpInfo.url = obj.url;
                if(_this.jumpInfoStartObj.respParamSet){
                    jumpInfo.respParamSet = _this.jumpInfoStartObj.respParamSet;
                }
                jumpInfo.params = _this.jumpInfoStartObj.params;
                jumpInfo.jumpType = _this.jumpInfoStartObj.jumpType;
                jumpInfo.componentType = _this.jumpInfoStartObj.componentType;
                jumpInfo.dialogTitle = _this.jumpInfoStartObj.dialogTitle;
                jumpInfo.dialogWidth = _this.jumpInfoStartObj.dialogWidth;
                jumpInfo.dialogFullscreen = _this.jumpInfoStartObj.dialogFullscreen;
                jumpInfo.requestMethod = _this.jumpInfoStartObj.requestMethod;
                this.$set(this.customBtnConfig, 'jumpInfo', jumpInfo);
                // console.log(JSON.stringify(this.item.data.btns));
                this.closeJumpInfoSettingDialog();
            },
    },
    watch:{
        customBtnConfig(newVl){
            if(Array.isArray(newVl)){
                newVl.forEach((value, index, array) => {
                    value.key = index+1
                })
            }
        }
    }
};
</script>

<style></style>

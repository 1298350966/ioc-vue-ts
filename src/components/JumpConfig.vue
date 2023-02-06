<template>
    <div class="ty-transfer mt20 ml20">
        <el-form label-position="top">
            <el-row>
                <el-form-item label="">
                    <el-radio v-model="jumpType" label="0">参数跳转</el-radio>
                    <el-radio v-model="jumpType" label="1">外部链接跳转</el-radio>
                </el-form-item>
            </el-row>
            <el-row v-show="jumpType === '0'">
                <el-col :span="12">
                    <el-form-item label="跳转形式" v-show="jumpType === '0'" >
                        <el-radio-group v-model="urlType" @change="urlChange">
                            <el-radio  label="0">Vue组件</el-radio>
                            <el-radio  label="1">内部链接</el-radio>
                            <el-radio  label="2">API调用</el-radio>
                            <el-radio  label="3" >状态修改</el-radio>
                        </el-radio-group>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-show="jumpType === '0' && urlType === '0'">
                <el-col :span="12">
                    <el-form-item label="">
                        <el-radio v-model="componentType" label="0">自定义组件
                        </el-radio>
                        <el-radio v-model="componentType" label="1">公共组件</el-radio>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row v-show="jumpType === '1'">
                <el-col :span="12">
                    <el-form-item label="链接地址">
                        <el-input v-model="url" style="width: 300px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--API调用请求方式设置-->
            <el-row v-show="jumpType === '0' && urlType === '2'">
                <el-col :span="12">
                    <el-form-item label="请求方式">
                        <el-radio v-model="requestMethod" label="get">Get</el-radio>
                        <el-radio v-model="requestMethod" label="post">Post</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-show="jumpType === '0'">
                <el-col :span="12" v-show="urlType === '0'  && componentType === '0'">
                    <el-form-item label="组件路径(以@/views/或@/components/开头路由文件)">
                        <el-input v-model="url" style="width:300px"
                                  placeholder="例@/views/Redirect或@/components/Constants"
                                  @blur="checkComponentUrl(url)"></el-input>
                        <el-tooltip class="item" effect="dark" content="校验路径的是否正确" placement="top">
                            <i class="el-icon-circle-check" style="color:#409EFF"
                               @click="checkComponentUrl(url)"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-show="urlType === '0'  && componentType === '1'">
                    <el-form-item label="组件路径">
                        <el-select v-model="url" placeholder="请选择" value="" clearable
                                   style="width: 300px" @change="checkComponentUrl">
                            <el-option
                                v-for="(item,index) in commonComponents"
                                :key="index"
                                :label="item.url"
                                :value="item.url">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.url }}</span>
                            </el-option>
                        </el-select>
                        <el-input :value="formName + '('+ formId + ')'" @focus="selectFormVisible = true"  placeholder="请选择关联表单" style="width: 300px;margin-left: 10px;"></el-input>
                        <selectForm :formId="formId"  :visible.sync="selectFormVisible"  @onData="SelectFormoData"></selectForm>

                    </el-form-item>
                </el-col>

                <el-col :span="12" v-show="urlType === '1'">
                    <el-form-item label="链接地址">
                        <el-input v-model="url" style="width: 300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="urlType === '2'">
                    <el-form-item label="接口地址(例:/api/report/dataset/save)">
                        <el-input v-model="url" style="width: 300px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <template v-if="showType === 'btns'">
                <!--通用按钮参数设置-->
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="参数设置" v-show="jumpType === '0'">
                            <el-tooltip class="item" effect="dark" content="添加" placement="top">
                                <i class="el-icon-circle-plus"
                                   style="position: absolute;  bottom: 108%;  left: 99%;color:#409EFF"
                                   @click="addMappingRow"></i>
                            </el-tooltip>
                            <el-row>
                                <el-table :data="dynTableData" size="mini" highlight-current-row
                                          border style="width: 100%" ref="mappingRef">
                                    <el-table-column type="index" width="50">
                                    </el-table-column>
                                    <el-table-column prop="selectKey" label="接收参数对应的名称">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.paramName" style="width: 150px"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="model" label="接收参数对应的值">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.model" style="width: 150px"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100px">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger"
                                                       @click="handleMappingDelete(scope.$index, scope.row)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
            <template v-else>
                <!--列表字段参数设置-->
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="参数设置" v-if="jumpType === '0' && urlType != '3'">
                            <el-tooltip class="item" effect="dark" content="添加" placement="top">
                                <i class="el-icon-circle-plus"
                                   style="position: absolute;  bottom: 108%;  left: 99%;color:#409EFF"
                                   @click="addMappingRow"></i>
                            </el-tooltip>
                            <el-row>
                                <el-table :data="dynTableData" size="mini" highlight-current-row
                                          border style="width: 100%" ref="mappingRef">
                                    <el-table-column type="index" width="50">
                                    </el-table-column>
                                    <el-table-column prop="selectKey" label="接收参数对应的名称">
                                        <template slot-scope="scope">
                                            <template
                                                v-if="urlType === '0' && receiveParamSelect instanceof Array && receiveParamSelect.length > 0">
                                                <el-select v-model="scope.row.paramName" placeholder="请选择"
                                                           size="mini" value="">
                                                    <el-option
                                                        v-for="(item,index) in receiveParamSelect"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.model">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                            <template v-else>
                                                <el-input v-model="scope.row.paramName" style="width: 150px"></el-input>
                                            </template>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="model" label="接收参数对应的值">
                                        <template slot-scope="scope">
                                            <!-- <div>
                                                <el-radio-group  v-model="scope.row.type" @change="scope.row.model = ''">
                                                    <el-radio label="0">控件字段</el-radio>
                                                    <el-radio label="1">自定义</el-radio>
                                                 </el-radio-group>
                                            </div>
                                            <div> -->
                                                 <el-select v-model="scope.row.type" style="width: 100px" placeholder="请选择" size="mini" @change="scope.row.model = ''">
                                                    <el-option
                                                        v-for="(item,index) in typeOptions"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                                <el-select v-if="scope.row.type === '0'" v-model="scope.row.model" style="width: 150px" placeholder="请选择"
                                                        size="mini">
                                                    <el-option
                                                        v-for="(item,index) in colsList"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                                <el-input v-else-if="scope.row.type === '1'" v-model="scope.row.model" style="width: 150px"></el-input>
                                            <!-- </div> -->
                                            
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100px">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger"
                                                       @click="handleMappingDelete(scope.$index, scope.row)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="参数设置" v-if="jumpType === '0' && urlType === '3'">
                            <el-tooltip class="item" effect="dark" content="添加" placement="top">
                                <i class="el-icon-circle-plus"
                                   style="position: absolute;  bottom: 108%;  left: 99%;color:#409EFF"
                                   @click="addStateMappingRow"></i>
                            </el-tooltip>
                            <el-row>
                                <el-table :data="dynTableData" size="mini" highlight-current-row
                                          border style="width: 100%" ref="mappingRef">
                                    <el-table-column type="index" width="50">
                                    </el-table-column>
                                    <el-table-column prop="selectKey" label="接收参数">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.paramName" placeholder="请选择"
                                                       size="mini" value="">
                                                <el-option
                                                    v-for="(item,index) in colsList"
                                                    :key="index"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="model" label="接收参数对应的值">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.paramValue" style="width: 150px"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="100px">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger"
                                                       @click="handleMappingDelete(scope.$index, scope.row)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
            <!--打开方式设置-->
            <el-row v-show="jumpType==='0' && (urlType !== '2'&&  urlType !== '3')  ">
                <el-col :span="24">
                    <el-form-item label="">
                        <el-radio v-model="type" label="0">弹窗打开</el-radio>
                        <el-radio v-model="type" label="1" >当前窗口打开</el-radio>
                        <el-radio v-model="type" label="2" v-show="urlType !== '0'">新窗口打开</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-show="jumpType==='1'">
                <el-col :span="24">
                    <el-form-item label="">
                        <el-radio v-model="type" label="0">弹窗打开</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--弹窗相关属性配置-->
            <div v-if="urlType === '0' || urlType === '1'">
                <el-row>
                    <el-col :span="6" v-show="type === '0' || type === '1'">
                    <el-form-item label="标题">
                        <el-input v-model="dialogTitle" style="width: 150px"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="type === '0'">
                    <el-col :span="8">
                    <el-form-item label="顶部位置">
                        <el-input v-model="dialogTop" style="width: 150px"></el-input>
                    </el-form-item>
            
                    </el-col>
                    <el-col :span="8">
                    <el-form-item label="宽度">
                        <el-input v-model="dialogWidth" style="width: 150px"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    <el-form-item label="高度">
                        <el-input v-model="dialogHeight" style="width: 150px"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="全屏" v-show="type === '0'">
                    <el-radio v-model="dialogFullscreen" label="0">非全屏</el-radio>
                    <el-radio v-model="dialogFullscreen" label="1">全屏</el-radio>
                </el-form-item>
            </div>
            <!--接口返回参数设置-->
            <el-row v-show="jumpType==='0' && (urlType === '2' || urlType === '3')">
                <el-col :span="24">
                    <el-form-item label="接口调用返回设置">
                        <el-table :data="respParamSet" size="mini" highlight-current-row border style="width: 100%">
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column prop="errCode" label="提示码">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.errCode" style="width: 150px"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="errMsg" label="提示信息">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.errMsg" style="width: 150px"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--        <div slot="footer" class="dialog-footer" style="position: relative;left: 48%;padding:20px">
                    <el-button type="primary" @click.native="submitData">保存</el-button>
                </div>-->
    </div>
</template>

<script>
    import CustomUpload from "@/components/CustomUpload";
    import selectForm from "@/components/selectForm"
    import {dialogConfig} from "@/config"
    export default {
        name: "JumpConfig",
        components: {
            CustomUpload,
            selectForm
        },
        props: {
            "colsList": {type: Array, required: true},      // colsList:  当前表单字段
            // "formList": {type: Array, required: true},       // formList: 当前系统中设计的表单集合
            "jumpConfig": {type: Object, required: true},       // formList: 当前系统中设计的表单集合
            "showType": {type: String}
        },
        data() {
            return {
                selectFormVisible:false,
                requestMethod: "get",  // 请求方式
                activeName: "first",
                respParamSet: [{errCode: "errCode", errMsg: "errMsg"}],
                dynTableData: [],
                receiveParamSelect: [],
                formId: "",
                formName:"",
                jumpType: "0",
                urlType: "0",
                url: "",
                type: "0",
                dialogTitle: "",
                dialogWidth: dialogConfig.width || 50,
                dialogTop:dialogConfig.top || "",
                dialogHeight:dialogConfig.dialogHeight || "",
                dialogFullscreen:"0",
                componentType: "0", // 组件类型
                componentTypeSet0Disable: false,
                componentTypeSet1Disable: false,
                commonComponents: [
                    {name: "列表形式", url: "@/views/ListFormCustom"}, {
                        name: "查看形式",
                        url: "@/views/ViewFormCustom"
                    }
                ],
                typeOptions:[{id:"0", name:"控件字段"},{id:"1", name:"自定义"}]
            }
        },
        mounted() {
            let _this = this;
            this.formId = this.jumpConfig.formId || "";
            this.formName = this.jumpConfig.formName || "";
            if (_this.jumpConfig.params instanceof Array) {
                _this.dynTableData = _this.jumpConfig.params;
            }
            if (_this.jumpConfig.respParamSet instanceof Array) {
                _this.respParamSet = _this.jumpConfig.respParamSet;
            }
            _this.jumpType = _this.jumpConfig.jumpType;
            _this.urlType = _this.jumpConfig.urlType;
            _this.url = _this.jumpConfig.url;
            if (!_this.KHUtils.isNull(_this.jumpConfig.url) && _this.urlType === "0") {
                _this.checkComponentUrl(_this.jumpConfig.url);
            }
            _this.type = _this.jumpConfig.type;
            _this.dialogTitle = _this.KHUtils.isNull(_this.jumpConfig.dialogTitle) ? _this.jumpConfig.label : _this.jumpConfig.dialogTitle;
            _this.dialogWidth = _this.jumpConfig.dialogWidth;
            _this.dialogTop = _this.jumpConfig.dialogTop ;
            _this.dialogHeight = _this.jumpConfig.dialogHeight ;
            _this.dialogFullscreen = _this.jumpConfig.dialogFullscreen;
            if (!_this.KHUtils.isNull(_this.jumpConfig.requestMethod)) {
                _this.requestMethod = _this.jumpConfig.requestMethod;
            }

            //补充ID
            if(_this.colsList instanceof Array && _this.colsList.length >0){
                let obj = {};
                obj.id = "id";
                obj.name="ID";
                obj.paramName = "id";
                _this.colsList.push(obj);
            }
        },
        methods: {
            //选择表单
            SelectFormoData(dataObj) {
                this.formId = dataObj.formId;
                this.formName = dataObj.formName;
                this.selectFormVisible = false;
            },
            urlChange(value){
                this.dynTableData = [];
                if(value === '2' || value === '3'){
                    // this.type = "";
                }
                if(value === '3'){
                    this.url = "/api/form/updateformdatapart";
                    this.dynTableData = [];
                    this.requestMethod = "post";
                }
            },
            // 校验Vue组件的路径是否正确
            checkComponentUrl(url) {
                let _this = this;
                if (_this.KHUtils.isNull(url)) {
                    _this.$message.error("组件路径填写有误或组件不存在,请核对后再重新输入");
                    _this.componentTypeSet1Disable = false;
                    _this.componentTypeSet0Disable = false;
                    return false;
                }
                let componentName = url.substring(url.lastIndexOf('/') + 1, url.length);
                if (componentName === "ListFormCustom" || componentName === "ViewFormCustom") {
                    _this.componentType = "1";
                    _this.componentTypeSet0Disable = true;
                    _this.componentTypeSet1Disable = false;
                } else {
                    _this.componentType = "0";
                    _this.componentTypeSet0Disable = false;
                    _this.componentTypeSet1Disable = true;
                }
                if (_this.jumpType === '0') {
                    let tempObj = _this.khConfig.components[componentName];
                    if (_this.KHUtils.isNull(tempObj)) {
                        _this.$message({
                            showClose: true,
                            message: "请至kh.config.json文件中统一注册组件定义的props再进行配置以便提高效率",
                            type: 'warning'
                        });
                        _this.receiveParamSelect = [];
                        return false;
                    }
                    _this.receiveParamSelect = [];
                    let tempProps = _this.khConfig.components[componentName].props;
                    if (tempProps instanceof Array) {
                        tempProps.forEach(p => {
                            let tempObj = {
                                model: p,
                                name: p
                            };
                            _this.receiveParamSelect.push(tempObj);
                        })
                    }
                    let flag = _this.KHForm.registerComponent(componentName, url);
                    if (flag) {
                        _this.$message.success("组件路径填写正确");
                    } else {
                        _this.$message.error("组件路径填写有误或组件不存在,请核对后再重新输入");
                    }
                }
            },
            // 映射配置表格行动态新增
            addMappingRow() {
                let _this = this;
                let obj = {
                    type:"0",
                    model: "",
                    paramName: ""
                };
                _this.dynTableData.push(obj);
                setTimeout(() => {
                    this.$refs.mappingRef.setCurrentRow(obj);
                }, 10);
            },
            addStateMappingRow() {
                let _this = this;
                let obj = {
                    paramValue: "",
                    paramName: ""
                };
                _this.dynTableData.push(obj);
                setTimeout(() => {
                    this.$refs.mappingRef.setCurrentRow(obj);
                }, 10);
            },
            // 映射配置表格行动态删除
            handleMappingDelete(index) {
                let _this = this;
                if (!(_this.dynTableData instanceof Array)) {
                    return false;
                }
                _this.dynTableData.splice(index, 1)
            },
            // 图标上传处理
            getFileIdFromCusUpload(fileId) {
                if (!this.KHUtils.isNull(fileId)) {
                    // 存储文件ID便于后续对文件访问的权限控制
                    this.jumpConfig.imageId = fileId;
                }
            },
            // 通知父组件重新加载,并获取选中后的节点数据
            submitData() {
                let _this = this;
                _this.jumpConfig.params = _this.dynTableData;
                if (!_this.KHUtils.isNull(_this.formId) && _this.componentType === '1') {
                    _this.jumpConfig.formId = _this.formId;
                    _this.jumpConfig.formName = _this.formName;
                }
                if (_this.urlType === '2' || _this.urlType === '3') {
                    _this.jumpConfig.respParamSet = _this.respParamSet;
                    _this.jumpConfig.requestMethod = _this.requestMethod;
                }
                _this.jumpConfig.jumpType = _this.jumpType;
                _this.jumpConfig.urlType = _this.urlType;
                _this.jumpConfig.url = _this.url;
                if (_this.urlType === '2' || _this.urlType === '3') {
                    _this.jumpConfig.type = "0";
                }else {
                    _this.jumpConfig.type = _this.type;
                }
                _this.jumpConfig.dialogTitle = _this.dialogTitle;
                _this.jumpConfig.dialogWidth = _this.dialogWidth;
                _this.jumpConfig.dialogTop = _this.dialogTop
                _this.jumpConfig.dialogHeight = _this.dialogHeight 
                _this.jumpConfig.componentType = _this.componentType;
                _this.jumpConfig.dialogFullscreen = _this.dialogFullscreen;
            },
        }
    }
</script>
<style scoped>
</style>

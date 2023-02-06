<template>
    <div>
        <el-container class="qr-set-container">
            <el-aside class="aside" v-if="refreshList">
                <div class="qrcode" ref="qrCodeUrl"></div>
                <div style="height: 33%;">
                    <div class="div-title">
                        <span>新增填报</span>
                        <i class="el-icon-plus add-btn" @click="openAddQrCodeDialog('add')"></i>
                    </div>
                    <div class="div-add-contain" v-if="qrCodeConf && qrCodeConf.add instanceof Array && qrCodeConf.add.length >0">
                        <div class="div-add-item" v-for="(item,key) in qrCodeConf.add" :key="key">
                            <el-row :span="24">
                                <el-col :span="19" style="height: 35px;">
                                    <el-checkbox v-model="item.isShow"><span></span></el-checkbox>
                                    <div class="text-oneLine" style="display:inline-block;">{{item.name}}</div>
                                </el-col>
                                <el-col :span="5">
                                    <el-button type="text" class="set-btn"  @click="setQrCodeConf(item,'add')" v-if="!item.isDefault" >设置</el-button>
                                    <template v-if="!item.isDefault">
                                        <i class="el-icon-delete"  @click="deleteQrCode(qrCodeConf.add,key)"></i>
                                    </template>
                                    <template v-else>
                                        <i class="el-icon-delete" style="position: relative;left: 30px" @click="deleteQrCode(qrCodeConf.add,key)"></i>
                                    </template>

                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
                <div style="height: 33%;">
                    <div class="div-title">
                        <span>查看数据</span>
                        <i class="el-icon-plus add-btn" @click="openAddQrCodeDialog('query')"></i>
                    </div>
                    <div class="div-add-contain" v-if="qrCodeConf && qrCodeConf.query instanceof Array && qrCodeConf.query.length >0">
                        <div class="div-add-item"  v-for="(item,key) in qrCodeConf.query" :key="key">
                            <el-row :span="24">
                                <el-col :span="19" style="height: 35px;">
                                    <el-checkbox v-model="item.isShow"><span></span></el-checkbox>
                                    <div class="text-oneLine" style="display:inline-block;">{{item.name}}</div>
                                </el-col>
                                <el-col :span="5">
                                    <el-button type="text" class="set-btn"  @click="setQrCodeConf(item,'query')"  v-if="!item.isDefault">设置</el-button>
                                    <template v-if="!item.isDefault">
                                        <i class="el-icon-delete"  @click="deleteQrCode(qrCodeConf.query,key)"></i>
                                    </template>
                                    <template v-else>
                                        <i class="el-icon-delete" style="position: relative;left: 30px" @click="deleteQrCode(qrCodeConf.query,key)"></i>
                                    </template>

                                </el-col>
                            </el-row>
                        </div>
                    </div>

                </div>
                <div style="height: 33%;">
                    <div class="div-title">
                        <span>编辑数据</span>
                        <i class="el-icon-plus add-btn" @click="openAddQrCodeDialog('edit')"></i>
                    </div>
                    <div class="div-add-contain" v-if="qrCodeConf && qrCodeConf.edit instanceof Array && qrCodeConf.edit.length >0">
                        <div class="div-add-item" v-for="(item,key) in qrCodeConf.edit" :key="key">
                            <el-row :span="24">
                                <el-col :span="19" style="height: 35px;">
                                    <el-checkbox v-model="item.isShow"><span></span></el-checkbox>
                                    <div class="text-oneLine" style="display:inline-block;">{{item.name}}</div>
                                </el-col>
                                <el-col :span="5">
                                    <el-button type="text" class="set-btn"  @click="setQrCodeConf(item,'edit')"  v-if="!item.isDefault">设置</el-button>
                                    <template v-if="!item.isDefault">
                                        <i class="el-icon-delete"  @click="deleteQrCode(qrCodeConf.edit,key)"></i>
                                    </template>
                                    <template v-else>
                                        <i class="el-icon-delete" style="position: relative;left: 30px" @click="deleteQrCode(qrCodeConf.edit,key)"></i>
                                    </template>
                                </el-col>
                            </el-row>
                        </div>
                    </div>

                </div>
            </el-aside>
            <el-container>
                <el-main class="main">
                    <template >
                        <div style="width: 500px" v-if="active == 'add'">
                            <div style="margin-bottom: 10px">
                                <span style="margin-right: 10px">名称:</span>
                                <el-input style="width: 200px" v-model="currentQrCodeItemConf.name"></el-input>
                            </div>
                            <div>
                                <el-row :span="24" class="title">
                                    <el-col :span="12">
                                        <!--     <el-button type="primary" >表单操作设置</el-button>-->
                                        <el-tag type="success" effect="dark" size="medium">表单操作设置</el-tag>

                                    </el-col>
                                    <el-col :span="6">&nbsp;</el-col>
                                    <el-col :span="6">
                                        <el-button type="text" @click="openPresetValueDialog">预置数据设置</el-button>
                                        <el-button type="primary" icon="el-icon-plus" circle
                                                   style="float: right" @click="openSelectContentDialog(true,null)"></el-button>
                                    </el-col>
                                </el-row>


                            </div>
                            <div class="content-title">
                                <el-row :span="24" class="title">
                                    <el-col :span="12" class="item-title-font-left">主表字段</el-col>
                                    <el-col :span="6" class="item-title-font">预置值</el-col>
                                    <el-col :span="6" class="item-title-font">只读</el-col>
                                </el-row>

                                <el-row :span="24" class="item-content" v-if="currentQrCodeItemConf && currentQrCodeItemConf.content && currentQrCodeItemConf.content.parent instanceof Array && currentQrCodeItemConf.content.parent.length >0"
                                        v-for="(item,key) in currentQrCodeItemConf.content.parent" :key="key">
                                    <el-col :span="12" class="item-content-left text-oneLine">{{item.name}}</el-col>
                                    <el-col :span="6" class="item-check">
                                        <el-checkbox v-model="item.preset"></el-checkbox>
                                    </el-col>
                                    <el-col :span="6" class="item-check">
                                        <el-checkbox v-model="item.readOnly"></el-checkbox>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="child-content"  v-if="tableFormConfig instanceof Array && tableFormConfig.length >0"
                                 v-for="(table,key) in tableFormConfig" :key="key">
                                <div class="child-name">
                                    <b>{{table.name}}</b>
                                    <el-button type="primary" icon="el-icon-plus" circle
                                               style="float: right" @click="openSelectContentDialog(false,table)"></el-button>
                                </div>
                                <el-row :span="24" class="item-content"  v-if=" getSubContent(table.key) instanceof Array && getSubContent(table.key).length >0"
                                        v-for="(item,key) in getSubContent(table.key)" :key="key">
                                    <el-col :span="12" class="item-content-left text-oneLine">{{item.name}}</el-col>
                                    <el-col :span="6" class="item-check">
                                        <el-checkbox v-model="item.preset"></el-checkbox>
                                    </el-col>
                                    <el-col :span="6" class="item-check">
                                        <el-checkbox v-model="item.readOnly"></el-checkbox>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </template>
                    <template >
                        <div style="width: 500px" v-if="active == 'query'">
                            <div style="margin-bottom: 10px">
                                <span style="margin-right: 10px">名称:</span>
                                <el-input style="width: 200px" v-model="currentQrCodeItemConf.name"></el-input>
                            </div>
                            <div class="content-title">
                                <el-row :span="24" class="title">
                                    <el-col :span="12" class="item-title-font-left">主表字段</el-col>
                                    <el-col :span="6" class="item-title-font-left">只读</el-col>
                                    <el-col :span="6" class="item-title-font">
                                        <el-button type="primary" icon="el-icon-plus" circle
                                                   style="float: right" @click="openSelectContentDialog(true,null)"></el-button>
                                    </el-col>
                                </el-row>

                                <el-row :span="24" class="item-content"  v-if="currentQrCodeItemConf && currentQrCodeItemConf.content && currentQrCodeItemConf.content.parent instanceof Array && currentQrCodeItemConf.content.parent.length >0"
                                        v-for="(item,key) in currentQrCodeItemConf.content.parent" :key="key">
                                    <el-col :span="12" class="item-content-left text-oneLine">{{item.name}}</el-col>
                                    <el-col :span="6" class="item-check">
                                        <el-checkbox v-model="item.readOnly" disabled></el-checkbox>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="child-content" v-if="tableFormConfig instanceof Array && tableFormConfig.length >0"
                                 v-for="(table,key) in tableFormConfig" :key="key">
                                <div class="child-name">
                                    <b>{{table.name}}</b>
                                    <el-button type="primary" icon="el-icon-plus" circle
                                               style="float: right"  @click="openSelectContentDialog(false,table)"></el-button>
                                </div>
                                <el-row :span="24" class="item-content" v-if=" getSubContent(table.key) instanceof Array && getSubContent(table.key).length >0"
                                        v-for="(item,key) in getSubContent(table.key)" :key="key">
                                    <el-col :span="12" class="item-content-left text-oneLine">{{item.name}}</el-col>
                                    <el-col :span="6" class="item-check">
                                        <el-checkbox v-model="item.readOnly" disabled></el-checkbox>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </template>
                    <template >
                        <div style="width: 600px" v-if="active == 'edit'">
                            <div style="margin-bottom: 10px">
                                <span style="margin-right: 10px">名称:</span>
                                <el-input style="width: 200px" v-model="currentQrCodeItemConf.name"></el-input>
                            </div>
                            <div class="content-title">
                                <el-row :span="24" class="title">
                                    <el-col :span="12" class="item-title-font-left">主表字段</el-col>
                                    <el-col :span="4" class="item-title-font">编辑</el-col>
                                    <el-col :span="4" class="item-title-font">只读</el-col>
                                    <el-col :span="4" class="item-title-font">
                                        <el-button type="primary" icon="el-icon-plus" circle
                                                   style="float: right"  @click="openSelectContentDialog(true,null)"></el-button>
                                    </el-col>
                                </el-row>

                                <el-row :span="24" class="item-content" v-if="currentQrCodeItemConf && currentQrCodeItemConf.content && currentQrCodeItemConf.content.parent instanceof Array && currentQrCodeItemConf.content.parent.length >0"
                                        v-for="(item,key) in currentQrCodeItemConf.content.parent" :key="key">
                                    <el-col :span="12" class="item-content-left text-oneLine">{{item.name}}</el-col>
                                    <el-col :span="4" class="item-check">
                                        <el-radio v-model="item.type" label="edit"><span></span></el-radio>
                                    </el-col>
                                    <el-col :span="4" class="item-check">
                                        <el-radio v-model="item.type" label="read"><span></span></el-radio>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="child-content"  v-if="tableFormConfig instanceof Array && tableFormConfig.length >0" v-for="(table,key) in tableFormConfig" :key="key">
                                <div class="child-name">
                                    <b>{{table.name}}</b>
                                </div>
                                <el-form label-width="80px" label-position="left" v-if="getSubTable(table.key)">
                                    <el-form-item label="新增">
                                        <div>
                                            <el-checkbox v-model="getSubTable(table.key).add.isAllow">新增</el-checkbox>
                                            <el-radio-group v-model="getSubTable(table.key).add.type" v-if="getSubTable(table.key).add.isAllow">
                                                <el-radio label="single" >单新增</el-radio>
                                                <el-radio label="multi">多新增</el-radio>
                                            </el-radio-group>
                                            <el-button type="success" @click="openFieldPermissionsDialog(getSubTable(table.key).add,table,'add_field')" v-if="getSubTable(table.key).add.isAllow">字段权限</el-button>
                                        </div>
                                    </el-form-item>
                                </el-form>
                                <el-form label-width="80px" label-position="left"  v-if="getSubTable(table.key)">
                                    <el-form-item label="编辑">
                                        <div>
                                            <el-checkbox  v-model="getSubTable(table.key).edit.isAllow">编辑</el-checkbox>
                                            <el-button type="success" @click="openFieldPermissionsDialog(getSubTable(table.key).edit,table,'edit_field')" v-if="getSubTable(table.key).edit.isAllow">字段权限</el-button>
                                            <el-button type="success" @click="openDataPermissionsDailog(table,getSubTable(table.key).edit)" v-if="getSubTable(table.key).edit.isAllow">数据权限</el-button>
                                        </div>
                                    </el-form-item>
                                </el-form>
                                <el-form label-width="80px" label-position="left"  v-if="getSubTable(table.key)">
                                    <el-form-item label="查看">
                                        <div>
                                            <!-- <el-checkbox  v-model="getSubTable(table.key).query.isAllow">查看</el-checkbox>-->
                                            <el-radio-group  v-model="getSubTable(table.key).query.type">
                                                <el-radio label="0">不可见</el-radio>
                                                <el-radio label="1">可见</el-radio>
                                            </el-radio-group>
                                            <el-button type="success" @click="openFieldPermissionsDialog(getSubTable(table.key).query,table,'query_field')" v-if="getSubTable(table.key).query.type == 1">字段权限</el-button>
                                            <el-button type="success" @click="openDataPermissionsDailog(table,getSubTable(table.key).query)"  v-if="getSubTable(table.key).query.type == 1">数据权限</el-button>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </template>
                </el-main>
                <el-footer>
                    <el-button type="primary" class="save-btn" @click="saveQrCodeConf" :loading="saveLoading">保存</el-button>
                </el-footer>
            </el-container>
        </el-container>
        <el-dialog title="数据权限" :visible.sync="dataPermissionDialogVisible" :append-to-body="true" width="50%" v-if="dataPermissionDialogVisible"
                   custom-class="advanced-set-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <qr-code-data-permissions :formId="formId" :editData="editData" :colsArray="currentTable.colsArray"></qr-code-data-permissions>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dataPermissionDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dataPermissionDialogVisible = false">确 定</el-button>
                  </span>
        </el-dialog>
        <el-dialog title="新增二维码" :visible.sync="addQrCodeDialogVisible" :append-to-body="true" width="30%"
                   custom-class="advanced-set-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form  label-width="80px" style="margin-top: 20px">
                <el-form-item label="名称：">
                    <el-input v-model="name" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                    <el-button @click="addQrCodeDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addQrCodeConf">确 定</el-button>
                  </span>
        </el-dialog>
        <el-dialog title="添加" :visible.sync="addContentDialogVisible" :append-to-body="true" width="30%"
                   custom-class="advanced-set-dialog" :close-on-click-modal="false" :close-on-press-escape="false">

            <div style="padding-top: 20px;padding-bottom: 20px" v-if="refreshSelectTree">
                <el-checkbox v-model="checkAllTree" @change="checkAll" style="margin-left: 24px">全选</el-checkbox>
                <el-tree
                    :data="showSelectCols"
                    show-checkbox
                    default-expand-all
                    node-key="model"
                    ref="tree"
                    :check-strictly="true"
                    highlight-current
                    :default-checked-keys="defaultCheckedKeys"
                    :props="defaultProps">
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span :title="getTreeLabel(node, data)">
                          {{ getTreeLabel(node, data) }}
                        </span>
      </span>
                </el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addContentDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addQrCodeContent">确 定</el-button>
                  </span>
        </el-dialog>

        <el-dialog title="预置值设置" :visible.sync="presetValueDialogVisible" v-if="presetValueDialogVisible" :append-to-body="true" width="50%"
                   custom-class="advanced-set-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <qr-code-preset-value ref="qrCodePresetValue" :formId="formId" :colsArray="colsArray" :tableFormConfig="tableFormConfig" :qrCodeItemConf="currentQrCodeItemConf" :qrCodeType="currentType"></qr-code-preset-value>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="presetValueDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="qrCodePresetValueSave">确 定</el-button>
                  </span>
        </el-dialog>
        <el-dialog title="字段权限" :visible.sync="fieldPermissionsDialogVisible" v-if="fieldPermissionsDialogVisible" :append-to-body="true" width="50%"
                   custom-class="advanced-set-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="main content-title" style="padding: 20px">
                <el-row :span="24" class="title">
                    <el-col :span="8" class="item-title-font-left">表字段</el-col>
                    <el-col :span="2" class="item-title-font"  v-if="fieldType != 'query_field'">编辑</el-col>
                    <el-col :span="2" class="item-title-font"  v-if="fieldType != 'add_field'">只读</el-col>
                    <el-col :span="4" class="item-title-font"  v-if="fieldType == 'add_field'">默认值</el-col>
                    <el-col :span="4" class="item-title-font">
                        <el-button type="primary" icon="el-icon-plus" circle
                                   style="float: right"  @click="openSelectContentDialog(false,currentTable)"></el-button>
                    </el-col>
                </el-row>

                <el-row :span="24" class="item-content" v-if="currentEditData && currentEditData.contents instanceof Array && currentEditData.contents.length"
                        v-for="(item,key) in currentEditData.contents" :key="key" style="margin-bottom: 10px">
                    <el-col :span="8" class="item-content-left text-oneLine">{{item.name}}</el-col>
                    <el-col :span="2" class="item-check">
                        <el-radio v-model="item.type" label="edit"  v-if="fieldType != 'query_field'"><span></span></el-radio>
                    </el-col>
                    <el-col :span="2" class="item-check">
                        <el-radio v-model="item.type" label="read" v-if="fieldType != 'add_field'"><span></span></el-radio>
                    </el-col>
                    <el-col :span="12" class="item-check"  v-if="fieldType == 'add_field'">
                        <div style="width: 200px;display: inline-block">
                            <form-item
                                :formId="formId"
                                :box="boxConfig(currentTable.colsArray,item.key)"
                                v-model="item.value"
                            ></form-item>
                        </div>
                        <el-checkbox v-model="item.currentTime" v-if="boxConfig(currentTable.colsArray,item.key).type === 'year' || boxConfig(currentTable.colsArray,item.key).type === 'month' || boxConfig(currentTable.colsArray,item.key).type === 'year_month' || boxConfig(currentTable.colsArray,item.key).type === 'date' || boxConfig(currentTable.colsArray,item.key).type === 'time' || boxConfig(currentTable.colsArray,item.key).type === 'datetime'">默认当前时间</el-checkbox>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="fieldPermissionsDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="fieldPermissionsDialogVisible = false">确 定</el-button>
                  </span>
        </el-dialog>


    </div>
</template>

<script>
    import QrCodePresetValue from "@/components/qr-code-set/QrCodePresetValue";
    import QrCodeDataPermissions from "@/components/qr-code-set/QrCodeDataPermissions";
    import FormItem from "@/components/qr-code-set/FormItem";
    import QRCode from 'qrcodejs2'
    export default {
        name: "QrCodeSetting",
        components:{
            QrCodePresetValue,
            QrCodeDataPermissions,
            FormItem
        },
        props: {
            formId: {
                type: Number,
                required: true
            },
            formConfig: {type: Object},
        },
        created(){
            let _this = this;
            if (_this.KHUtils.isNull(_this.formConfig)) {
                return false;
            }
            if (!_this.formConfig) {

                return false;
            }
            if (!_this.formConfig.list) {
                return false;
            }
            _this.colsArray = [];
            _this.formConfig.list.forEach(val => {
                if (val.type === 'grid') {
                    loop(val, _this);
                } else {
                    if ("table" === val.type) {
                        _this.tableFormConfig.push(val);      // 子表单独立组件显示
                    }  else {
                        _this.colsArray.push(val);
                    }
                }
            });

            function loop(obj, _this) {
                if (obj.columns) {
                    obj.columns.forEach(cs => {
                        cs.list.forEach(ls => {
                            if ("table" === ls.type) {
                                _this.tableFormConfig.push(ls);      // 子表单独立组件显示
                            }   else {
                                _this.colsArray.push(ls);
                            }
                            if (ls.columns) {
                                loop(ls, _this);
                            }
                        })
                    })
                }
            }
            _this.convertSubTable();

        },
        computed:{
            getSubContent(){
                return function (subKey) {
                    if(this.currentType == "add"){
                        if(this.currentQrCodeItemConf && this.currentQrCodeItemConf.content && this.currentQrCodeItemConf.content.childs instanceof Array &&  this.currentQrCodeItemConf.content.childs.length >0){
                            for (var i = 0;i<this.currentQrCodeItemConf.content.childs.length;i++){
                                let child = this.currentQrCodeItemConf.content.childs[i];
                                if(child.subKey === subKey){
                                    return child.contents;
                                }
                            }
                        }
                    }else if(this.currentType == "query"){
                        if(this.currentQrCodeItemConf && this.currentQrCodeItemConf.content && this.currentQrCodeItemConf.content.childs instanceof Array &&  this.currentQrCodeItemConf.content.childs.length >0){
                            for (var i = 0;i<this.currentQrCodeItemConf.content.childs.length;i++){
                                let child = this.currentQrCodeItemConf.content.childs[i];
                                if(child.subKey === subKey){
                                    return child.contents;
                                }
                            }
                        }

                    }else if(this.currentType == "edit"){

                    }
                    return null;
                }
            },
            getTreeLabel() {
                return function (node, data) {
                    return data.name + '(' + data.model + ')';
                };
            },
            getSubTable(){
                return function (subKey) {
                    if(this.currentQrCodeItemConf && this.currentQrCodeItemConf.content && this.currentQrCodeItemConf.content.childs instanceof Array &&  this.currentQrCodeItemConf.content.childs.length >0){
                        for (var i = 0;i<this.currentQrCodeItemConf.content.childs.length;i++){
                            let child = this.currentQrCodeItemConf.content.childs[i];
                            if(child.subKey === subKey){
                                return child;
                            }
                        }
                    }
                    return null;
                }
            },
            boxConfig() {
                return function (list, key) {
                    if (key) {
                        return list.find((value, index, array) => {
                            return value.model == key;
                        });
                    } else {
                        return {};
                    }
                };
            },
        },
        mounted(){
            this.initQrCodeConf();
        },
        data(){
            return {
                active: "",
                dataPermissionDialogVisible: false,
                //二维码配置信息
                qrCodeConf:{},
                addQrCodeDialogVisible:false,
                currentType:"",
                name:"",
                currentQrCodeItemConf:{},
                colsArray: [], // 所有拉取的控件除子表单控件
                tableFormConfig: [],  // 子表单控件集合
                addContentDialogVisible:false,
                showSelectCols:[],//需要显示选择的控件
                defaultCheckedKeys:[],//默认选中的值
                defaultProps: {children: 'cols', label: 'name'},  //树形结构格式
                contents:[],
                refreshSubTableList:true,
                presetValueDialogVisible:false,
                fieldPermissionsDialogVisible:false,
                currentTable:{},//当前子表单
                currentEditData:{},//编辑--子表单--
                fieldType:"",//编辑中(字段权限类型：新增，编辑，查看)
                refreshSelectTree:true,
                editData:{},//当前的数据权限
                saveLoading:false,
                refreshList:true,
                checkAllTree:false
            }
        },
        methods: {
            qrCodePresetValueSave(){
                let mainFormValidate,tableFromValidate=[]
                if(this.$refs.qrCodePresetValue.$refs.mainForm){
                    this.$refs.qrCodePresetValue.$refs.mainForm.validate((valid) => {
                        if (valid) {
                            mainFormValidate = true;
                        } else {
                            mainFormValidate = false;
                        }
                    })
                }

                if(this.$refs.qrCodePresetValue.$refs.tableFrom && Array.isArray(this.$refs.qrCodePresetValue.$refs.tableFrom)){
                    this.$refs.qrCodePresetValue.$refs.tableFrom.forEach((tableFrom, index, array) => {
                        tableFrom.validate((valid) => {
                            if (valid) {
                                tableFromValidate[index] = true;
                            } else {
                                tableFromValidate[index] = false;
                            }
                        })
                    })
                }


                if(mainFormValidate && !tableFromValidate.includes(false) ){
                    this.presetValueDialogVisible = false
                }else{
                    this.$message({
                        message: '您的填报数据有误，请检查表单',
                        type: 'warning'
                    });
                }



            },
            checkAll(){
                if (this.checkAllTree) { // 全选
                    this.$refs.tree.setCheckedNodes(this.showSelectCols);
                }else {
                    this.$refs.tree.setCheckedKeys([]);
                }

            },
            openDataPermissionsDailog(table,editData){
                this.currentTable = table;
                this.editData = editData;
                this.dataPermissionDialogVisible = true
            },
            //初始化二维码配置
            initQrCodeConf(){
                let _this = this;
                _this.$Get(_this.khConfig.api.queryFormSetByFormId + "/" + _this.formId, null).then(res => {
                    if (res.errCode === 0) {
                        if (res.data && !_this.KHUtils.isNull(res.data.qrCodeConf)) {
                            _this.qrCodeConf = JSON.parse(res.data.qrCodeConf);
                        } else {
                            _this.qrCodeConf = {
                                formId:_this.formId,
                                add:[{
                                    name:"新增",
                                    isDefault:true,
                                    isShow:true,
                                    content:{
                                        parent:[],
                                        childs:[]
                                    }
                                }],
                                query:[{
                                    name:"查询",
                                    isDefault:true,
                                    isShow:true,
                                    content:{
                                        parent:[],
                                        childs:[]
                                    }
                                }],
                                edit:[{
                                    name:"编辑",
                                    isDefault:true,
                                    isShow:true,
                                    content:{
                                        parent:[],
                                        childs:[]
                                    }
                                }]
                            }
                        }


                    }
                })
            },

            openAddQrCodeDialog(type){
                this.name = "";
                this.currentType = type;
                this.addQrCodeDialogVisible = true
            },
            addQrCodeConf(){
                let _this = this;
                let newObj = {
                    name:_this.name,
                    isDefault:false,
                    isShow:true,
                    content:{
                        parent:[],
                        childs:[]
                    }
                }
                if(_this.currentType === 'add'){
                    _this.qrCodeConf.add.push(newObj);
                }else if(_this.currentType === 'query'){
                    _this.qrCodeConf.query.push(newObj);
                }else if(_this.currentType === 'edit'){
                    if(_this.tableFormConfig instanceof Array && _this.tableFormConfig.length >0){
                        _this.tableFormConfig.forEach((table,index) =>{
                            let child ={
                                subKey:table.key,
                                add:{
                                    isAllow:true,
                                    type:"single",
                                    contents:[]
                                },
                                edit:{
                                    isAllow:true,
                                    contents:[],
                                    cond:{
                                        type:"and",
                                        conds:[]
                                    }
                                },
                                query:{
                                    isAllow:true,
                                    type:"0",
                                    contents:[],
                                    cond:{
                                        type:"and",
                                        conds:[]
                                    }
                                }
                            }
                            newObj.content.childs.push(child);
                        })
                    }
                    _this.qrCodeConf.edit.push(newObj);
                }
                _this.addQrCodeDialogVisible = false;
            },
            //设置二维码配置
            setQrCodeConf(item,type){
                let _this = this
                _this.currentQrCodeItemConf = item;
                _this.currentType = type;
                if(_this.currentType == "edit"){
                    _this.initSubFormEdit();
                }
                _this.active = type;

            },
            //编辑情况下，如果新增了子表单需要补充进行
            initSubFormEdit(){
                let _this = this;
                if(_this.tableFormConfig instanceof Array && _this.tableFormConfig.length >0){
                    _this.tableFormConfig.forEach((table,index) =>{
                        let subKey = table.key;
                        if(!_this.isHaveSubForm(subKey,_this.currentQrCodeItemConf.content.childs)){
                            let child ={
                                subKey:table.key,
                                add:{
                                    isAllow:true,
                                    type:"single",
                                    contents:[]
                                },
                                edit:{
                                    isAllow:true,
                                    contents:[],
                                    cond:{
                                        type:"and",
                                        conds:[]
                                    }
                                },
                                query:{
                                    isAllow:true,
                                    type:"0",
                                    contents:[],
                                    cond:{
                                        type:"and",
                                        conds:[]
                                    }
                                }
                            }
                            _this.currentQrCodeItemConf.content.childs.push(child);
                        }

                    })
                }
            },
            isHaveSubForm(subKey,childs){
                let _this = this;
                let isHave = false;
                if(childs instanceof Array && childs.length >0){
                    for(var i = 0;i<childs.length;i++){
                        let child = childs[i];
                        if(child.subKey == subKey){
                            isHave = true;
                            return isHave;
                        }
                    }
                }
                return isHave;
            },
            openSelectContentDialog(isMainForm,table){
                let _this = this;
                _this.showSelectCols = [];
                _this.defaultCheckedKeys = [];
                if(isMainForm){
                    _this.showSelectCols = _this.colsArray;
                }else {
                    _this.showSelectCols = table.colsArray;
                }

                if(_this.currentType == "add"){
                    if(isMainForm){
                        _this.contents = _this.currentQrCodeItemConf.content.parent;
                    }else {
                        let subKey = table.key;
                        _this.convertSubContents(subKey);

                    }
                }else if(_this.currentType == "query"){
                    if(isMainForm){
                        _this.contents = _this.currentQrCodeItemConf.content.parent;
                    }else {
                        let subKey = table.key;
                        if(!_this.KHUtils.isNull(subKey)){
                            _this.convertSubContents(subKey);
                        }


                    }

                }else if(_this.currentType == "edit"){
                    if(isMainForm){
                        _this.contents = _this.currentQrCodeItemConf.content.parent;
                    }else {
                        _this.contents = _this.currentEditData.contents
                    }

                }
                //添加默认勾选
                if(_this.contents instanceof Array && _this.contents.length >0){
                    _this.contents.forEach((item,index)=>{
                        _this.defaultCheckedKeys.push(item.key)
                    })
                }
                this.checkAllTree = false;
                this.addContentDialogVisible = true;
                this.refreshSelectTree = false;
                this.$nextTick(function () {
                    this.refreshSelectTree = true;
                })
            },
            convertSubContents(subKey){
                let _this = this;
                let isExit = false;
                if(_this.currentQrCodeItemConf.content && _this.currentQrCodeItemConf.content.childs && _this.currentQrCodeItemConf.content.childs.length >0){
                    _this.currentQrCodeItemConf.content.childs.forEach((item,index)=>{
                        if(subKey === item.subKey){
                            isExit = true;
                            _this.contents = item.contents;
                        }
                    })
                }
                if(!isExit){
                    let child ={
                        subKey:subKey,
                        contents:[],
                        values:[]
                    }
                    _this.currentQrCodeItemConf.content.childs.push(child);
                    _this.contents = child.contents;
                }
            },
            addQrCodeContent(){
                let nodes =  this.$refs.tree.getCheckedNodes();
                let datas = JSON.parse(JSON.stringify(this.contents))
                this.contents.length = 0;
                if(nodes instanceof Array && nodes.length>0){
                    this.addContentDialogVisible = false;
                    nodes.forEach((node,index)=>{
                        let content = this.findContent(datas,node.model);
                        if(content){
                            this.contents.push(content);
                        }else {
                            let newObj={}
                            if(this.currentType == "add"){
                                newObj.name =node.name;
                                newObj.key =node.model;
                                newObj.preset =true;
                                newObj.readOnly =true;
                                newObj.type = node.type;
                                newObj.value ="";
                            }else if(this.currentType == "query"){
                                newObj.name =node.name;
                                newObj.key =node.model;
                                newObj.type = node.type;
                                newObj.readOnly =true;
                            }else if(this.currentType == "edit"){
                                newObj.name =node.name;
                                newObj.key =node.model;
                                newObj.type = node.type;
                                newObj.type = "edit";
                                if(this.fieldType == "add_field"){
                                    newObj.type = "edit";
                                    newObj.value = "";
                                }else if(this.fieldType == "edit_field"){
                                    newObj.type = "edit";
                                }else if(this.fieldType == "query_field"){
                                    newObj.type = "read";
                                }
                            }
                            this.contents.push(newObj);
                        }

                    })



                }else {
                    this.$message({
                        message: '请选择！',
                        type: 'warning'
                    });
                }
            },
            findContent(contents,key){
                if(contents instanceof Array && contents.length >0){
                    let content = contents.find((content, index) => {
                        return key == content.key

                    });
                    if(content){
                        return content;
                    }

                }
                return null;
            },
            //
            convertSubTable(){
                let _this = this;
                if(_this.tableFormConfig instanceof Array && _this.tableFormConfig.length >0){
                    _this.tableFormConfig.forEach((table,index)=>{
                        table.colsArray = [];
                        if(table.tableColumns instanceof Array && table.tableColumns.length >0){
                            table.tableColumns.forEach((item,key)=>{
                                if (item.type === 'grid') {
                                    loop(item,table);
                                } else {
                                    table.colsArray.push(item);
                                }
                            })
                        }
                    })
                }

                function loop(obj, table) {
                    if (obj.columns) {
                        obj.columns.forEach(cs => {
                            cs.list.forEach(ls => {
                                if ("table" === ls.type) {

                                }   else {
                                    table.colsArray.push(ls);
                                }
                                if (ls.columns) {
                                    loop(ls, table);
                                }
                            })
                        })
                    }
                }
            },
            openPresetValueDialog(){
                this.presetValueDialogVisible = true;
            },
            openFieldPermissionsDialog(editData,table,fieldType){
                this.currentEditData = editData;
                this.currentTable = table;
                this.fieldType = fieldType;
                this.fieldPermissionsDialogVisible = true
            },
            saveQrCodeConf(){
                this.$confirm('是否保存二维码配置信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.saveLoading = false;
                    this.$PostJson(this.khConfig.api.saveQrCodeConf, this.qrCodeConf).then(res => {
                        this.saveLoading = false;
                        this.$emit("closeQrCodeSetDialog");
                        if (res.errCode === 0) {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });

                        } else {

                        }
                    })

                }).catch(() => {

                });
            },
            //删除二维码
            deleteQrCode(list,index){
                this.$confirm('是否确认移除该二维码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    list.splice(index,1);
                }).catch(() => {

                });

            }


        }
    }
</script>

<style lang="scss" scoped>
    .qr-set-container {
        height: 600px;
        .aside {
            width: 200px;
            border-right: 1px solid #EAF1F7;
            padding: 10px;
        }
        .div-title {
            height: 40px;
            line-height: 40px;
            background-color: #409EFF;
            padding-left: 10px;
            padding-right: 10px;
            border-bottom-right-radius: 8px;
            border-top-right-radius: 8px;
            span {
                font-size: 16px;
                color: white;
            }
            .add-btn {
                float: right;
                color: white;
                font-size: 16px;
                margin-top: 11px;
            }
        }
        .div-add-contain {
            height: 150px;
            overflow: hidden;
            overflow-y: scroll;
            .div-add-item {
                height: 35px;
                line-height: 35px;
                div {
                    font-size: 15px;
                }
                .text-oneLine {
                    display: block; /*内联对象需加*/
                    word-break: keep-all; /* 不换行 */
                    white-space: nowrap; /* 不换行 */
                    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
                    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/

                }
                .set-btn {
                    //float: right;
                }
                ::v-deep .el-checkbox {
                    margin-right: 0px;
                    position: relative;
                    bottom: 13px;
                }
            }
            /*滚动条里面小方块*/
            &::-webkit-scrollbar-thumb {
                background-color: #EBEAEF;
                border-radius: 10px;
            }
            /*滚动条整体样式*/
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            /*滚动条里面轨道*/
            &::-webkit-scrollbar-track {
                background: #FFFFFF;
                border-radius: 10px;
            }
        }
        .main {
            .content-title {
                border-bottom: 1px solid #EAF1F7;
                min-height: 100px;
            }
            .child-content {
                min-height: 100px;
                .child-name {
                    font-size: 18px;
                    margin-top: 10px;
                    margin-bottom: 10px;

                }
            }
            .item-title-font-left {
                font-size: 18px;
                color: #409EFF;
                text-align: left;
            }
            .item-title-font {
                font-size: 18px;
                color: #409EFF;

            }
            .title {
                margin-top: 10px;
            }
            .item-content {
                padding-top: 5px;
                padding-bottom: 5px;
                .item-content-left {
                    text-align: left;
                    font-size: 16px;
                }
                .item-check {
                    padding-left: 10px;
                }

            }
            /*滚动条里面小方块*/
            &::-webkit-scrollbar-thumb {
                background-color: #EBEAEF;
                border-radius: 10px;
            }
            /*滚动条整体样式*/
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            /*滚动条里面轨道*/
            &::-webkit-scrollbar-track {
                background: #FFFFFF;
                border-radius: 10px;
            }
        }

        .save-btn {
            float: right;
        }

    }

    .text-oneLine {
        display: block; /*内联对象需加*/
        word-break: keep-all; /* 不换行 */
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
        text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/

    }

    ::v-deep .advanced-set-dialog {
        .el-dialog__body {
            padding: 0px 0px !important;
            background-color: #FFFFFF;
            overflow-y: auto !important;

            /*滚动条里面小方块*/
            &::-webkit-scrollbar-thumb {
                background-color: #EBEAEF;
                border-radius: 10px;
            }
            /*滚动条整体样式*/
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            /*滚动条里面轨道*/
            &::-webkit-scrollbar-track {
                background: #FFFFFF;
                border-radius: 10px;
            }
        }

        .el-dialog__header {
            background-color: #EAF1F7;
            border-bottom: 1px solid #E8E8E8;
            padding-left: 10px !important;
            padding-top: 15px !important;
            padding-bottom: 15px !important;
        }

        .el-dialog__footer {
            padding-top: 5px;
            padding-bottom: 5px;
            background-color: #F8F8FA !important;
        }
    }

    .item-condition{
        background-color: #FAFAFA;
        padding: 20px;
        margin-bottom: 20px;
        .item-condition-title{
            font-size: 16px;
        }
    }
    .center-vertical{
        position: relative;
        top:23%;
        transform:translateY(-43%);
    }
    .center-vertical-bottom{
        position: relative;
        top:23%;
        transform:translateY(-43%);
    }
    .title-label{
        font-size: 16px;
        margin-right: 20px;
    }


</style>

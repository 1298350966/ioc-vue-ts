<template>
    <div>
        <div class="header-row" >
            <span class="header-title">微应用管理</span>
            <el-form :model="queryParams" label-width="68px" :inline="true">
                <el-form-item label="应用名称" prop="appName">
                    <el-input v-model="queryParams.appName"
                            placeholder="请输入应用名称"
                            clearable
                            size="small"/>
                </el-form-item>
                <el-form-item label="功能介绍" prop="introduce">
                    <el-input v-model="queryParams.introduce"
                            placeHolder="请输入功能介绍"
                            clearable
                            size="small"/>
                </el-form-item>
                <!--<el-form-item label="来源" prop="source">
                <el-select v-model="queryParams.source"
                            placeholder="请选择来源"
                            clearable
                            size="small">
                    <el-option v-for="item in sourceOptions" :key="item.value"
                            :label="item.label" :value="item.value"/>
                </el-select>
                </el-form-item>-->
                <el-form-item label="标签" prop="tag">
                    <el-input v-model="queryParams.tag"
                            placeHolder="请选择标签"
                            clearable
                            size="small"></el-input>
                </el-form-item>
                <el-form-item class="opt-button">
                    <el-button type="info" @click="handleQuery">查询</el-button>
                    <el-button type="success" @click="handleQueryReset">重置</el-button>
                    <el-button type="danger" @click="handleDelete">删除</el-button>
                    <el-button type="primary" @click="addMicroApp">新增</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-box">
            <el-table v-loading="loading" ref="appTable" :data="appList" row-key="id" border
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
                <el-table-column label="Logo/应用名称" show-overflow-tooltip align="center" width="250px">
                    <template slot-scope="scope">
                        <div class="logo-column">

                         <!--   <el-image v-if="!KHUtils.isNull(scope.row.iconId)" :src="imgSrc(scope.row.iconId)"
                                      class="avatar"></el-image>
                            <el-image v-else :src="require('@/assets/images/default_app_icon.png')"
                                      class="avatar"></el-image>-->
                            <el-button   type="primary" class="icon" :style="iconStyle(scope.row)">
                                <i :class="iconClassObject(scope.row)" style="color: white;font-size: 20px"></i>
                            </el-button>
                            <span style="margin-left: 15px">{{ scope.row.appName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="功能介绍" prop="introduce" align="center" show-overflow-tooltip/>
                <el-table-column label="标签" class-name="tag-column" align="center">
                    <template slot-scope="scope">
                        {{ KHUtils.isNull(scope.row.tag) ? '' : scope.row.tag.split(',').join('、') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-pagination
            class="pagination"
            background
            :page-size="pageParam.pageSize"
            :current-page.sync="pageParam.pageNum"
            hide-on-single-page
            @current-change="handleCurrentChange"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <el-dialog custom-class="custom-dialog" title="新增" :visible.sync="addOpen" v-if="addOpen" width="50%" top="5vh"
                   append-to-body :close-on-click-modal="false">
            <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="100px" class="form">
                <el-form-item label="图标：" prop="appName">
                    <el-button type="primary" class="icon" :style="iconStyle(addForm)"
                               @click="appIconSetVisible = true">
                        <i :class="iconClassObject(addForm)" style="color: white;font-size: 20px"></i>
                    </el-button>
                </el-form-item>
                <!-- <el-form-item label="logo：" prop="iconId">
                     <el-upload :action="khConfig.host.rest + khConfig.api.fileUpload" :on-remove="handleRemoveLogo"
                                :on-success="uploadLogoCall" list-type="picture-card" :show-file-list="false"
                                :before-upload="beforeUpload">
                         <img v-if="addForm.iconId" :src="imgSrc(addForm.iconId)" class="avatar">
                         <i v-else class="el-icon-plus"></i>
                     </el-upload>
                 </el-form-item>-->
                <el-form-item label="应用名称：" prop="appName">
                    <el-input v-model="addForm.appName" class="w80"></el-input>
                </el-form-item>
                <el-form-item label="功能介绍：" prop="introduce">
                    <el-input v-model="addForm.introduce" class="w80"></el-input>
                </el-form-item>
                <el-form-item label="标签：" prop="tag">
                    <el-select
                        :value="tagValue('add')"
                        @input="handleTagInput($event, 'add')"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请添加标签">
                    </el-select>
                </el-form-item>
                <!--  <el-form-item label="微应用类型：" prop="appType">
                    <el-radio-group v-model="addForm.appType">
                      <el-radio :label="0">独立微应用</el-radio>
                      <el-radio :label="1">组合微应用</el-radio>
                    </el-radio-group>
                  </el-form-item>-->
                <el-form-item label="功能类目：" prop="funcIds" class="list-item">
                    <div class="app-box">
                        <div v-for="item in addForm.func" :key="item.id" class="app">
                            <el-image
                                :src="item.iconId?imgSrc(item.iconId):require('@/assets/images/default_app_icon.png')"
                                class="icon"></el-image>
                            <el-tooltip :content="item.funName" :open-delay="200">
                                <span>{{ item.funName }}</span>
                            </el-tooltip>
                        </div>
                        <el-upload action="" list-type="picture-card" :disabled="true"
                                   @click.native="handleFuncOpen(0)">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-form-item>
                <!--  <el-form-item v-else label="类目组合：" prop="funcIds">
                    <el-upload action="" list-type="picture-card" :disabled="true" @click.native="handleCombAppOpen">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                  </el-form-item>-->
            </el-form>
            <template v-slot:footer>
                <el-button size="small" @click="cancelAdd">取消</el-button>
                <el-button type="primary" size="small" @click="submitAddForm">确定</el-button>
            </template>
        </el-dialog>

        <el-dialog custom-class="custom-dialog" title="修改" :visible.sync="updateOpen" v-if="updateOpen" top="3vh"
                   width="50%" append-to-body :close-on-click-modal="false">
            <el-form ref="updateForm" :model="updateForm" :rules="updateFormRules" label-width="100px" class="form">
                <!-- <el-form-item label="微应用类型：" prop="appType">
                   <el-radio-group v-model="updateForm.appType">
                     <el-radio :label="0">独立微应用</el-radio>
                     <el-radio :label="1">组合微应用</el-radio>
                   </el-radio-group>
                 </el-form-item>-->
                <!--      <el-form-item label="logo：" prop="iconId">
                          <el-upload :action="khConfig.host.rest + khConfig.api.fileUpload"
                                     :on-remove="handleRemoveUpdateLogo"
                                     :on-success="uploadUpdateLogoCall" list-type="picture-card" :show-file-list="false"
                                     :before-upload="beforeUpload">
                              <img v-if="updateForm.iconId" :src="imgSrc(updateForm.iconId)" class="avatar">
                              <i v-else class="el-icon-plus"></i>
                          </el-upload>
                      </el-form-item>-->
                <el-form-item label="图标：" prop="appName">
                    <el-button type="primary" class="icon" :style="iconStyle(updateForm)"
                               @click="appIconSetVisible = true">
                        <i :class="iconClassObject(updateForm)" style="color: white;font-size: 20px"></i>
                    </el-button>
                </el-form-item>
                <el-form-item label="应用名称：" prop="appName">
                    <el-input v-model="updateForm.appName" class="w80"/>
                </el-form-item>
                <el-form-item label="功能介绍：" prop="introduce">
                    <el-input v-model="updateForm.introduce" class="w80"/>
                </el-form-item>
                <!--  <el-form-item label="来源：" prop="source">
                    <el-radio-group v-model="updateForm.source">
                      <el-radio :label="0">表单服务</el-radio>
                      <el-radio :label="1">流程服务</el-radio>
                      <el-radio :label="2">专项服务</el-radio>
                      <el-radio :label="3">第三方服务</el-radio>
                    </el-radio-group>
                  </el-form-item>-->
                <el-form-item label="标签：" prop="tag">
                    <el-select
                        :value="tagValue('update')"
                        @input="handleTagInput($event, 'update')"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请添加标签">
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="路由：" prop="route">
                   <el-input class="w80"></el-input>
                 </el-form-item>-->
                <el-form-item label="功能类目：" prop="funcIds">

                    <div class="app-box">
                        <div v-for="item in updateForm.func" :key="item.id" class="app">
                            <el-image
                                :src="item.iconId?imgSrc(item.iconId):require('@/assets/images/default_app_icon.png')"
                                class="icon"></el-image>
                            <el-tooltip :content="item.funName" :open-delay="200">
                                <span>{{ item.funName }}</span>
                            </el-tooltip>
                        </div>
                        <el-upload action="" list-type="picture-card" :disabled="true"
                                   @click.native="handleFuncOpen(1)">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-form-item>
                <!--<el-form-item v-else label="类目组合：" prop="funcIds">
                  <el-upload action="" list-type="picture-card" :disabled="true" @click.native="handleCombAppOpen">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>-->
            </el-form>
            <template v-slot:footer>
                <el-button size="small" @click="cancelUpdate">取消</el-button>
                <el-button type="primary" size="small" @click="submitUpdateForm">确定</el-button>
            </template>
        </el-dialog>

        <!-- <el-dialog custom-class="custom-dialog" title="选择独立微应用" :visible.sync="combAppOpen" v-if="combAppOpen" top="5vh"
                    width="60%" append-to-body :close-on-click-modal="false">
           <div class="table-box">
             <el-input prefix-icon="el-icon-search" placeHolder="输入微应用名称搜索" v-model="combSearch" class="search" clearable @change="handleCombSearch"></el-input>
             <el-table v-loading="combLoading" :data="combAppList" row-key="id" border
                       @selection-change="handleCombAppSelectionChange">
               <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
               <el-table-column label="Logo/应用名称" show-overflow-tooltip align="center" width="250px">
                 <template slot-scope="scope">
                   <div class="logo-column">
                     <img :src="imgSrc(scope.row.iconId)" class="avatar">
                     <span>{{ scope.row.appName }}</span>
                   </div>
                 </template>
               </el-table-column>
               <el-table-column label="功能介绍" prop="introduce" align="center" show-overflow-tooltip/>
               <el-table-column label="标签" class-name="comb-tag-column" align="center">
                 <template slot-scope="scope">
                   {{ scope.row.tag.split(',').join('、') }}
                 </template>
               </el-table-column>
             </el-table>
           </div>
           <el-pagination
               class="pagination"
               background
               :page-size="combPageParam.pageSize"
               :current-page.sync="combPageParam.pageNum"
               hide-on-single-page
               @current-change="handleCombCurrentChange"
               layout="prev, pager, next, jumper"
               :total="combTotal">
           </el-pagination>
           <div class="has-select-box">
             <span class="has-select">已选项：</span>
             <img v-for="item in combAppSelect" :key="item.id" :src="imgSrc(item.iconId)" class="pic"/>
           </div>
           <div slot="footer" class="comb-footer">
             <el-button size="small" @click="closeCombAppDialog">取消</el-button>
             <el-button type="primary" size="small" @click="saveCombApp">确定</el-button>
           </div>
         </el-dialog>-->

        <el-dialog custom-class="custom-dialog" title="选择功能" :visible.sync="funcAppOpen" v-if="funcAppOpen" top="5vh">
            <el-input prefix-icon="el-icon-search" placeHolder="输入功能名称搜索" v-model="funcSearch" class="search" clearable
                      @change="handleCombSearch">
                <el-button slot="appdend" icon="el-icon-search" @click="handleCombSearch"></el-button>
            </el-input>
            <el-table class="table" ref="funTable" :data="funList" row-key="id" border
                      @selection-change="handleFuncSelectionChange">
                <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
                <el-table-column label="图标" align="center" width="250px">
                    <template slot-scope="scope">
                        <div class="logo-column">
                            <!--  <img :src="imgSrc(scope.row.iconId)" class="avatar">-->
                            <el-image
                                :src="scope.row.iconId?imgSrc(scope.row.iconId):require('@/assets/images/default_app_icon.png')"
                                class="avatar"></el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="功能名称" prop="funName" align="center"/>
                <el-table-column label="标签" class-name="tag-column" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.tag.split(',').join('、') }}
                    </template>
                </el-table-column>
                <el-table-column label="类型" prop="type" align="center"/>
            </el-table>
            <el-pagination
                class="pagination"
                background
                :page-size="funcPageParam.pageSize"
                :current-page.sync="funcPageParam.pageNum"
                hide-on-single-page
                @current-change="handleFuncCurrentChange"
                layout="prev, pager, next, jumper"
                :total="funcTotal">
            </el-pagination>
            <div class="has-select-box">
                <span class="has-select">已选项：</span>
                <div v-for="item in funcSelect" :key="item.id" class="app">
                    <el-image :src="item.iconId?imgSrc(item.iconId):require('@/assets/images/default_app_icon.png')"
                              class="avatar" style="margin-bottom: 10px"></el-image>
                    <el-tooltip :content="item.funName" :open-delay="200">
                        <span>{{ item.funName }}</span>
                    </el-tooltip>
                </div>

            </div>
            <template v-slot:footer>
                <el-button size="small" @click="closeFuncAddDialog">取消</el-button>
                <el-button type="primary" size="small" @click="saveFunc">确定</el-button>
            </template>
        </el-dialog>

        <el-dialog custom-class="custom-dialog" title="图标设置" :visible.sync="appIconSetVisible" v-if="appIconSetVisible"
                   top="5vh" width="30%">
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6"></el-col>
                <el-col :span="6"><el-button type="primary" class="icon" :style="iconStyle(appIconObj)">
                    <i :class="iconClassObject(appIconObj)" style="color: white;font-size: 20px"></i>
                </el-button></el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <el-row :gutter="12" style="margin-bottom: 10px" class="icon-content">
                <template v-for="appIcon in MicroAppIcons.appIcons">
                    <el-col :span="3">
                        <i :class="iconClassObject(appIcon)" style="font-size: 25px;margin-left: 20px"
                           @click="selectIcon(appIcon)"></i>
                    </el-col>
                </template>
            </el-row>

            <el-row style="padding: 10px;border-top: 1px solid #EAF1F7;">
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
            </el-row>
            <template v-slot:footer>
                <el-button size="small" @click="appIconSetVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="setAppIcon">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
            this.getAppList();
        },

        computed: {
            tagValue() {
                return function (type) {
                    let tagArray = [];
                    if (type === 'add') {
                        this.addForm.tag.split(',').forEach(item => {
                            if (item) {
                                tagArray.push(item);
                            }
                        });
                    } else {
                        this.updateForm.tag = this.updateForm.tag ? this.updateForm.tag : '';
                        this.updateForm.tag.split(',').forEach(item => {
                            if (item) {
                                tagArray.push(item);
                            }
                        });
                    }
                    return tagArray;
                };
            },
            imgSrc() {
                return function (fileId) {
                    return window.location.origin + this.khConfig.api['fileDownload'] + '/' + fileId;
                };
            },
            iconStyle(){
                return function (data) {
                    let styleObj = {};
                    styleObj.backgroundColor = data.iconBgColor;
                    styleObj.borderColor = data.iconBgColor;
                    return styleObj;
                }

            },
            iconClassObject(){
                return function (appIcon) {
                    let classObject = {};
                    classObject.icon = true;
                    classObject.iconfont = true;
                    classObject[appIcon.iconName] = true;
                    return classObject;
                }

            }
        },

        data() {
            return {
                removeTag: '',
                appList: [],
                total: 0,
                queryParams: {},
                sourceOptions: [
                    {label: "表单服务", value: 0},
                    {label: "流程服务", value: 1},
                    {label: "专项服务", value: 2},
                    {label: "第三方服务", value: 3},
                ],
                loading: true,
                combLoading: true,
                pageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                combPageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                funcPageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                funcTotal: 0,
                funcSearch: '',
                addOpen: false,
                updateOpen: false,
                funcAppOpen: false,
                addForm: {
                    appType: 0,
                    tag: '',
                    appName: "",
                    introduce: "",
                    func: []
                },
                updateForm: {},
                updateFormRules: {},
                addFormRules: {},
                selectedRowIds: [],
                combAppOpen: false,
                combAppList: [],
                combTotal: 0,
                combAppSelect: [],
                funcSelect: [],
                combSearch: '',
                funList: [],
                isAdd: false,
                appIconSetVisible: false,
                color: '#E6A23C',
                icon: 'iconguanliyuancaozuo',
                appIconObj: {
                    iconName: '',
                    iconBgColor: ''
                }
            };
        },

        methods: {
            selectIcon(appIcon){
                this.appIconObj.iconName = appIcon.iconName;
            },
            slectBgColor(color){
                this.appIconObj.iconBgColor = color;
            },
            setAppIcon(){
                this.appIconSetVisible = false;
                if (this.isAdd) {
                    this.$set(this.addForm, 'iconName', this.appIconObj.iconName);
                    this.$set(this.addForm, 'iconBgColor', this.appIconObj.iconBgColor);
                } else {
                    this.$set(this.updateForm, 'iconName', this.appIconObj.iconName);
                    this.$set(this.updateForm, 'iconBgColor', this.appIconObj.iconBgColor);

                }
            },
            //新增微应用
            addMicroApp(){
                this.addOpen = true;
                this.isAdd = true;
                this.addForm = {
                    appType: 0,
                    tag: '',
                    appName: "",
                    introduce: "",
                    func: []
                }
            },
            getAppList() {
                this.loading = true;
                let param = {
                    ...this.pageParam,
                    ...this.queryParams
                };
                this.$Get(this.khConfig.api['listMicroApp'], param).then(res => {
                    this.total = res.totalCount;
                    this.appList = res.datas;
                    this.loading = false;
                });
            },
            handleQuery() {
                this.pageParam.pageNum = 1;
                this.getAppList();
                this.$refs['funTable'].clearSelection();
            },
            cancelAdd() {
                this.addForm = this.$options.data().addForm;
                this.addOpen = false;
            },
            submitAddForm() {
                this.addForm.funIds = this.addForm.func.map(v => {
                    return v.id;
                }).join(',');
                delete this.addForm.func;
                this.$Post(this.khConfig.api['addMicroApp'], this.KHUtils.transformRequest(this.addForm)).then(res => {
                    this.pageParam.pageNum = 1;
                    this.getAppList();
                    this.$message({
                        type: 'success',
                        message: '添加微应用成功'
                    });
                });
                this.cancelAdd();
            },
            handleUpdate(id) {
                this.updateForm = {};
                this.isAdd = false;
                const getMicroApp = new Promise((resolve, reject) => {
                    this.$Get(this.khConfig.api['getMicroApp'], {id: id}).then(res => {
                        let microApp = res.microApp;
                        this.$set(this.updateForm, 'id', microApp.id);
                        this.$set(this.updateForm, 'iconId', microApp.iconId);
                        this.$set(this.updateForm, 'appName', microApp.appName);
                        this.$set(this.updateForm, 'introduce', microApp.introduce);
                        this.$set(this.updateForm, 'tag', microApp.tag);
                        this.$set(this.updateForm, 'iconName', microApp.iconName);
                        this.$set(this.updateForm, 'iconBgColor', microApp.iconBgColor);
                        resolve();
                    });
                });
                const listMicroAppFunctionByAppId = new Promise((resolve, reject) => {
                    this.$Get(this.khConfig.api['listMicroAppFunctionByAppId'], {appId: id}).then(res => {
                        this.$set(this.updateForm, 'func', res.datas);
                        resolve();
                    });
                });
                Promise.all([getMicroApp, listMicroAppFunctionByAppId]).then(() => {
                    this.updateOpen = true;
                });
            },
            cancelUpdate() {
                this.updateForm = this.$options.data().updateForm;
                this.updateOpen = false;
            },
            submitUpdateForm() {
                console.log(this.updateForm);
                if (this.updateForm.func instanceof Array && this.updateForm.func.length > 0) {
                    let strIds = this.updateForm.func.map(function (obj, index) {
                        return obj.id
                    }).join(",");
                    this.updateForm.funIds = strIds;
                }
                this.$Post(this.khConfig.api['updateMicroApp'], this.KHUtils.transformRequest(this.updateForm)).then(res => {
                    this.$message({
                        type: 'success',
                        message: '更新成功'
                    });
                    this.getAppList();
                    this.cancelUpdate();
                });
            },
            handleTagInput(val, type) {
                type === 'add' ? this.addForm.tag = val.join(',') : this.updateForm.tag = val.join(',');
            },
            getOrgList(id, pathName) {
                this.$Get(this.khConfig.api['listTenantOrg'], {orgId: id}).then(res => {

                    if (res.list.length > 0) {

                    } else {
                        this.$message({
                            type: 'warning',
                            message: '已经到最后一级了'
                        });
                    }
                });
            },
            handleClickRole() {
                this.$Get(this.khConfig.api.listRole).then(res => {

                });
            },
            handleQueryReset() {
                this.queryParams = this.$options.data().queryParams;
                this.pageParam.pageNum = 1;
                this.getAppList();
            },
            handleCurrentChange(pageNum) {
                console.log(this.pageParam.pageNum);
                this.getAppList();
            },
            handleCombCurrentChange() {
                this.getCombAppList();
            },
            handleSelectionChange(selection) {
                this.selectedRowIds = selection.map(item => {
                    return item.id;
                });
            },
            handleDelete() {
                if (this.selectedRowIds.length > 0) {
                    this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let param = {
                            ids: this.selectedRowIds.join(',')
                        };
                        this.$Post(this.khConfig.api['deleteMicroApp'], this.KHUtils.transformRequest(param)).then(res => {
                            this.$message({type: 'success', message: '删除成功'});
                            this.pageParam.pageNum = 1;
                            this.$refs['appTable'].clearSelection();
                            this.getAppList();
                        });
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请选择要删除的项'
                    });
                }
            },
            handleRemoveLogo() {
                this.addForm.iconId = '';
            },
            uploadLogoCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    this.$set(this.addForm, 'iconId', response.datas[0].fileId);
                    console.log(this.addForm.iconId);
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            handleRemoveUpdateLogo() {
                this.updateForm.iconId = '';
            },
            uploadUpdateLogoCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    this.$set(this.updateForm, 'iconId', response.datas[0].fileId);
                    console.log(this.addForm.iconId);
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            beforeUpload(file) {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    this.$message.error('只能上传jpg/png文件');
                    return false;
                }
                const limitSize = file.size / 1024 / 1024 < 5;
                if (!limitSize) {
                    this.$message.error('上传文件大小不能超过 5M');
                    return false;
                }
            },
            handleCombAppOpen() {
                this.combAppOpen = true;
                this.getCombAppList();
            },
            getCombAppList() {
                this.combLoading = true;
                let param = {
                    ...this.combPageParam,
                    appName: this.combSearch,
                    appType: 0
                };
                this.$Get(this.khConfig.api['listMicroApp'], param).then(res => {
                    this.combTotal = res.totalCount;
                    this.combAppList = res.datas;
                    this.combLoading = false;
                });
            },
            handleCombAppSelectionChange(list) {
                this.combAppSelect = list;
            },
            closeCombAppDialog() {
                this.combAppOpen = false;
            },
            closeFuncAddDialog() {
                this.funcAppOpen = false;
                this.funcSelect = this.$options.data().funcSelect;
            },
            saveFunc() {
                if (this.isAdd) {
                    for (const item of this.funcSelect) {
                        if (!this.addForm.func.some(v => v.id === item.id)) {
                            this.addForm.func.push(item);
                        }
                    }
                } else {
                    for (const item of this.funcSelect) {
                        if (!this.updateForm.func.some(v => v.id === item.id)) {
                            this.updateForm.func.push(item);
                        }
                    }
                }

                this.closeFuncAddDialog();
            },
            saveCombApp() {
                this.closeCombAppDialog();
            },
            handleFuncOpen(value) {
                if (value == 0) {
                    this.isAdd = true;
                } else if (value == 1) {
                    this.isAdd = false;
                }
                this.getAppFunctionList();
                this.funcAppOpen = true;
            },
            getAppFunctionList() {
                let param = {
                    ...this.funcPageParam,
                    funName:this.funcSearch
                };
                this.loading = true;
                this.$Get(this.khConfig.api['listMicroAppFunction'], param).then(res => {
                    this.funList = res.datas;
                    this.funcTotal = res.totalCount;
                    this.loading = false;
                });
            },
            handleFuncSelectionChange(list) {
                this.funcSelect = list;
            },
            handleCombSearch() {
                // this.getCombAppList();
                this.getAppFunctionList();
            },
            handleFuncCurrentChange() {
                this.getAppFunctionList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/microApp/micro-app.scss";

//    ::v-deep .opt-button {
//         .el-form-item__content {
//             .el-button {
//                 margin: 0px;
//                 padding: 7px 15px;
//             }

//             .el-button:nth-of-type(1) {
//                 margin-bottom: 5px;
//             }

//             .el-button:nth-of-type(2) {
//                 margin-bottom: 5px;
//             }

//             width: 120px;
//         }

//         float: right;
//     }

    .avatar {
        width: 45px;
        height: 45px;
        display: inline-block;
    }

    .pic {
        width: 60px;
        height: 60px;
        display: inline-block;
        margin-right: 15px;
    }

   ::v-deep .form {
        .el-upload {
            width: 60px;
            height: 60px;
            display: flex;
            border: none;
            flex-direction: column;
            justify-content: center;
        }

        .el-icon-close:before {
            font-size: 12px;
        }

        .el-radio-group {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }

   ::v-deep .pagination {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 0px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 5px;

        .btn-next {
            margin-right: 0px;
        }
    }

   ::v-deep .table-box {
        .el-table th {
            display: table-cell !important;
        }
        .logo-column {
            display: flex;
            flex-direction: row;
            align-items: center;

            span {
                //margin-left: 10px;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }

    .search {
        width: 30%;
        margin-bottom: 10px;
    }

    .comb-footer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .has-select {
        font-size: 25px;
        font-weight: bold;
        color: #000000;
        margin-right: 30px;
        margin-bottom: auto;
        margin-top: 15px;
    }

    .has-select-box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 5px;
    }

    .app-box {
        display: flex;
        flex-flow: row wrap;
        padding: 0px 10px;
    }

    .icon {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        // margin-bottom: 10px;
    }

    .app {
        display: flex;
        cursor: pointer;
        flex-direction: column;
        align-items: flex-start;
        font-size: 13px;
        color: #53575A;
        margin-right: 25px;
        margin-bottom: 10px;

        span {
            display: inline-block;
            max-width: 70px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .icon-content {
        max-height: 200px;
        overflow-y: auto;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

</style>

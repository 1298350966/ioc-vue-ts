<template>
    <el-col :span="24" style="padding: 8px  10px 8px 70px ">
        <el-row>
            <div class="forms" style="margin-left: -60px">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="企业名称:">
                        <el-input v-model="queryParam.companyName" style="width: 140px"></el-input>
                    </el-form-item>
                    <el-form-item label="组织机构代码:" style="margin-left:15px;">
                        <el-input v-model="queryParam.companyCode" style="width: 140px"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:" style="margin-left:15px;">
                        <el-select v-model="queryParam.type" placeholder="请选择" style="width: 100px" value="">
                            <el-option label="全部" value="99" key="99"></el-option>
                            <el-option label="审核通过" value="1" key="1"></el-option>
                            <el-option label="审核未通过" value="2" key="2"></el-option>
                            <el-option label="未审核" value="0" key="0"></el-option>
                            <el-option label="作废" value="3" key="3"></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item style="width: 240px">
                        <el-button type="primary" icon="search" @click="query">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-row style="margin-bottom: 10px ;margin-left: -60px">
                <el-button @click="handleAdd">新增</el-button>
            </el-row>
            <!--列表-->
            <el-row style="margin-bottom: 10px;margin-left: -60px">
                <el-col :span="24">
                    <el-table
                        :data="tableData"
                        highlight-current-row
                        border
                        stripe
                        v-loading="listLoading"
                        style="width: 98%;text-align: center"
                        @row-click="handleEdit"
                    >
                        
                        <el-table-column prop="companyName" label="企业名称" width="120">
                        </el-table-column>
                        <el-table-column prop="companyCode" label="组织机构代码">
                        </el-table-column>
                        <el-table-column prop="administrativeAreaName" label="行政区域" width="120">
                        </el-table-column>
                        <el-table-column prop="address" label="地址">
                        </el-table-column>
                        <el-table-column prop="industryName" label="行业名称">
                        </el-table-column>
                        <el-table-column prop="industyType" label="行业类别">
                        </el-table-column>
                        <el-table-column prop="economicTypeName" label="经济名称">
                        </el-table-column>
                        <el-table-column prop="createTime" label="申请时间">
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="100">
                            <template slot-scope="scope">
                                <el-tag
                                    type="success"
                                    disable-transitions>{{statusName(scope.row.status)}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    v-show="buttonShow(scope.row.status,'check')"
                                    type="success"
                                    @click.stop="checkCompany( scope.row,'1')">通过
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="warning"
                                    v-show="buttonShow(scope.row.status,'unCheck')"
                                    @click.stop="checkCompany( scope.row,'2')">拒绝
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    v-show="buttonShow(scope.row.status,'user')"
                                    @click.stop="openCompanyUser( scope.row)">用户
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    v-show="buttonShow(scope.row.status,'delete')"
                                    @click.stop="deleteCompany( scope.row)">作废
                                </el-button>
                            
                            </template>
                        </el-table-column>
                    </el-table>
                    <p style="width: 96%;margin: 0 auto">
                        <el-pagination
                            style="float: right"
                            @current-change="handleCurrentChange"
                            :page-size="10"
                            layout="total, prev, pager, next"
                            :total="totalPage">
                        </el-pagination>
                    </p>
                </el-col>
            </el-row>
            <!--编辑界面-->
            <el-dialog :title="formTitle" :visible.sync="editFormVisible" class="custom-company-dia">
                <el-form :model="editForm" label-width="130px" :rules="editFormRules" ref="editForm">
                    <el-row>
                        <el-form-item label="企业名称" prop="companyName">
                            <el-input v-model="editForm.companyName" placeholder="请输入企业名称"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="详细地址" prop="administrativeAreaName">
                                <el-input v-model="editForm.administrativeAreaName" @focus="displayTree"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="address">
                                <el-input v-model="editForm.address" placeholder="请输入详细地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="所属行业" prop="industryName">
                            <el-input v-model="editForm.industryName" placeholder="请选择行业" @focus="openIndusty"
                                      clearable></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="行业类别" prop="industyType">
                            <el-input v-model="editForm.industyType" placeholder="请输入行业类别"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="国民经济行业类型" prop="economicTypeName">
                            <el-input v-model="editForm.economicTypeName" placeholder="请输入国民经济行业类型"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="组织机构代码" prop="companyCode">
                            <el-input v-model="editForm.companyCode" placeholder="请输入组织机构代码"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                    </el-button>
                </div>
            </el-dialog>
            <!--增加企业信息-->
            <el-dialog title="增加企业用户" :visible.sync="addCompanyInfoVisible" class="custom-company-dia">
                <el-form :model="companyUserInfo.companyInfo" label-width="130px" :rules="companyUserInfoRules"
                         ref="companyUserInfo">
                    <el-row>
                        <el-form-item label="企业名称" prop="companyName">
                            <el-input v-model="companyUserInfo.companyInfo.companyName"
                                      placeholder="请输入企业名称"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="详细地址" prop="administrativeAreaName">
                                <el-input v-model="companyUserInfo.companyInfo.administrativeAreaName"
                                          @focus="openAddCompanyArea"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="address">
                                <el-input v-model="companyUserInfo.companyInfo.address"
                                          placeholder="请输入详细地址" @focus="openGis"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="纬度">
                                <el-input v-model="companyUserInfo.companyInfo.lat" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="经度">
                                <el-input v-model="companyUserInfo.companyInfo.lnt" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="所属行业" prop="industryName">
                            <el-input v-model="companyUserInfo.companyInfo.industryName" placeholder="请选择行业"
                                      @focus="openAddCompanyIndusty" clearable></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="行业类别" prop="industyType">
                            <el-input v-model="companyUserInfo.companyInfo.industyType" placeholder="请选择行业"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="国民经济行业类型" prop="economicTypeName">
                            <el-input v-model="companyUserInfo.companyInfo.economicTypeName"
                                      placeholder="请输入国民经济行业类型"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="组织机构代码" prop="companyCode">
                            <el-input v-model="companyUserInfo.companyInfo.companyCode"
                                      placeholder="请输入组织机构代码"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-form :model="companyUserInfo.user" label-width="130px" :rules="companyUserInfoRules"
                             ref="companyUserInfo">
                        <!--<el-row>
                          <el-form-item label="用户名" prop="userName">
                            <el-input v-model="companyUserInfo.user.userName" placeholder="请输入用户名"></el-input>
                          </el-form-item>
                        </el-row>-->
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="密码" prop="password">
                                    <el-input type="password" autocomplete="off" v-model="companyUserInfo.user.password"
                                              placeholder="请输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="确认密码" prop="password1">
                                    <el-input type="password" autocomplete="off"
                                              v-model="companyUserInfo.user.password1" placeholder="请重新输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="联系人" prop="realName">
                                    <el-input v-model="companyUserInfo.user.realName" placeholder="请输入联系人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="性别" prop="sex">
                                    <template>
                                        <el-radio v-model="companyUserInfo.user.sex" label="0">男</el-radio>
                                        <el-radio v-model="companyUserInfo.user.sex" label="1">女</el-radio>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="职务" prop="jobs">
                                    <el-input v-model="companyUserInfo.user.jobs" placeholder="请输入职务"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item>
                                    示例：安全部长、安全科长、安全主管、安全员等。
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="手机号码" prop="phone">
                                    <el-input v-model="companyUserInfo.user.phone" placeholder="请输入手机号码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item>
                                    必须填写有效手机号码，以后将作为接收系统预警提醒消息使用
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="办公电话" prop="officePhone">
                                <el-input v-model="companyUserInfo.user.officePhone" placeholder="请输入办公电话"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="Email" prop="email">
                                <el-input v-model="companyUserInfo.user.email" placeholder="请输入邮箱"
                                          type="email"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="saveCompanyUserInfo" :loading="saveCompanyUserInfoLoading">
                        保存
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="行政区域" :visible.sync="administrativeVisible" class="custom-company-dia">
                <el-row>
                    <el-col>
                        <el-tree
                            :data="dicCatalogData"
                            :props="dicCatalogProps"
                            node-key="id"
                            accordion
                            highlight-current
                            @current-change="selectDicCatalog"
                            default-expand-all
                            :expand-on-click-node="false">
                        </el-tree>
                    </el-col>
                </el-row>
            </el-dialog>
            <el-dialog title="监管类型" :visible.sync="industyVisible" class="custom-company-dia">
                <el-row>
                    <el-col>
                        <el-tree
                            :data="dicIndustyData"
                            :props="dicCatalogProps"
                            node-key="id"
                            accordion
                            highlight-current
                            @current-change="selectDicIndusty"
                            default-expand-all
                            :expand-on-click-node="false">
                        </el-tree>
                    </el-col>
                </el-row>
            </el-dialog>
            <!--用户信息dialog-->
            <el-dialog title="用户信息" :visible.sync="companyUserVisible" class="custom-company-dia">
                <el-row style="margin-bottom: 20px">
                    <el-button @click="addCompanyUser">新增</el-button>
                </el-row>
                <el-row style="margin-bottom: 10px">
                    <el-col :span="24">
                        <el-table
                            :data="companyUserData"
                            highlight-current-row
                            border
                            stripe
                            v-loading="companyUserListLoading"
                            style="width: 98%;text-align: center"
                            @row-click="companyUserEdit"
                        >
                            
                            <el-table-column prop="userName" label="用户名" width="120">
                            </el-table-column>
                            <el-table-column prop="realName" label="联系人">
                            </el-table-column>
                            <el-table-column prop="sex" label="性别" width="120">
                                <template slot-scope="scope">
                                    {{sexName(scope.row.sex)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="jobs" label="职务">
                            </el-table-column>
                            <el-table-column prop="phone" label="手机">
                            </el-table-column>
                            <el-table-column prop="officePhone" label="办公电话">
                            </el-table-column>
                            <el-table-column prop="email" label="邮箱">
                            </el-table-column>
                            <el-table-column label="操作" width="200">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click.stop="resetPwd( scope.row)">重置密码
                                    </el-button>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click.stop="deleteCompanyUser( scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    
                    </el-col>
                </el-row>
            </el-dialog>
            <!--新增用户-->
            <el-dialog title="新增用户" :visible.sync="addUserVisible" class="custom-company-dia">
                <el-form :model="addUser" label-width="130px" :rules="addUserRules" ref="addUser">
                    <el-row>
                        <el-form-item label="账号" prop="userName">
                            <el-input v-model="addUser.userName" placeholder="请输入账号"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="密码" prop="password">
                                    <el-input type="password" autocomplete="off" v-model="addUser.password"
                                              placeholder="请输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="确认密码" prop="password1">
                                    <el-input type="password" autocomplete="off" v-model="addUser.password1"
                                              placeholder="请重新输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="realName">
                                <el-input v-model="addUser.realName" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <template>
                                    <el-radio v-model="addUser.sex" label="0">男</el-radio>
                                    <el-radio v-model="addUser.sex" label="1">女</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="职务" prop="jobs">
                            <el-input v-model="addUser.jobs" placeholder="请输入职务"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="addUser.phone" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="办公电话" prop="officePhone">
                            <el-input v-model="addUser.officePhone" placeholder="请输入办公电话"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="Email" prop="email">
                            <el-input v-model="addUser.email" placeholder="请输入邮箱地址"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="addUserSubmit" :loading="addUserLoadding">确认
                    </el-button>
                </div>
            </el-dialog>
            <!--编辑企业用户-->
            <el-dialog title="修改用户信息" :visible.sync="editUserVisible" class="custom-company-dia">
                <el-form :model="editUser" label-width="130px" :rules="editUserRules" ref="editUser">
                    <el-row>
                        <el-form-item label="账号" prop="userName">
                            <el-input v-model="editUser.userName" placeholder="请输入账号" :disabled="true"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="realName">
                                <el-input v-model="editUser.realName" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <template>
                                    <el-radio v-model="editUser.sex" label="0">男</el-radio>
                                    <el-radio v-model="editUser.sex" label="1">女</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="职务" prop="jobs">
                            <el-input v-model="editUser.jobs" placeholder="请输入职务"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="editUser.phone" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="办公电话" prop="officePhone">
                            <el-input v-model="editUser.officePhone" placeholder="请输入办公电话"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="Email" prop="email">
                            <el-input v-model="editUser.email" placeholder="请输入邮箱地址"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="editUserSubmit" :loading="editUserLoading">保存
                    </el-button>
                </div>
            </el-dialog>
            <!--修改密码-->
            <el-dialog title="修改密码" :visible.sync="pwdVisible" :close-on-click-modal="closeOnClickModal"
                       class="custom-company-dia">
                <el-form :model="pwdForm" label-width="120px" :rules="pwdRules" ref="pwdForm">
                    <el-row>
                        <el-col :span="24">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="用户名" prop="username">
                                        <el-input v-model="pwdForm.username" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <!--                     <el-col :span="12">
                                                         <el-form-item label="旧密码" prop="password">
                                                             <el-input v-model="pwdForm.password" type="password"></el-input>
                                                         </el-form-item>
                                                     </el-col>-->
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="新密码" prop="newPassword">
                                        <el-input v-model="pwdForm.newPassword" type="password"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="确认新密码" prop="surePassword">
                                        <el-input v-model="pwdForm.surePassword" type="password"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="updatePwd()" :loading="pwdLoading">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="地图定位"
                       :visible.sync="gisVisible"
                       :close-on-click-modal="closeOnClickModal"
                       :close-on-press-escape="closeOnClickModal"
                       width="60%"
                       append-to-body
                       @close="handlerGisClose"
                       class="custom-company-dia"
            >
                <gao-de-gis :from-parent-gis-obj="editGisObj"
                            :gis-init-obj="gisInitObj"
                            @recGisMsg="recGisMsg"
                            :child-resp="notifyChild"></gao-de-gis>
            </el-dialog>
        </el-row>
    </el-col>
</template>

<script>
    import {JSEncrypt} from 'jsencrypt';
    import GaoDeGis from '@/components/gis/GaoDeGis';
    
    export default {
        name: "CompanyManager",
        components: {
            GaoDeGis
        },
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pwdForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                gisVisible: false,
                editGisObj: {},
                gisInitObj: {
                    gisInitCity: 13,
                    gisInitLat: 28.683016,
                    gisInitLnt: 115.857963
                },
                notifyChild: 0,
                listLoading: false,
                editLoading: false,
                closeOnClickModal: false,
                tableData: [],
                totalPage: 0,
                queryParam: {
                    pageSize: 10,
                    pageNum: 1,
                    companyName: "",
                    companyCode: "",
                    type: "99"
                },
                checkParam: {
                    checkStatus: 0
                },
                editFormRules: {
                    companyName: [
                        {required: true, message: '请输入企业名称', trigger: 'blur'}
                    ],
                    administrativeAreaName: [
                        {required: true, message: '请输入行政区域名称', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'}
                    ],
                    industryName: [
                        {required: true, message: '请输入所属行业名称', trigger: 'blur'}
                    ],
                    industyType: [
                        {required: true, message: '请输入行业类别', trigger: 'blur'}
                    ],
                    companyCode: [
                        {required: true, message: '请输入组织机构代码', trigger: 'blur'}
                    ]
                },
                editFormVisible: false,
                formTitle: "编辑",
                editForm: {},
                addCompanyInfoVisible: false,
                saveCompanyUserInfoLoading: false,
                companyUserInfo: {
                    companyInfo: {
                        companyName: "",
                        administrativeAreaCode: 0,
                        administrativeAreaName: "",
                        address: "",
                        industryCode: 0,
                        industryName: "",
                        industyType: "",
                        economicTypeCode: 0,
                        economicTypeName: "",
                        companyCode: ""
                    },
                    user: {
                        userName: "",
                        password: "",
                        password1: "",
                        realName: "",
                        sex: "0",
                        jobs: "",
                        phone: "",
                        officePhone: "",
                        email: ""
                    }
                },
                paramInfo: {
                    companyInfo: {
                        companyName: "",
                        administrativeAreaCode: 0,
                        administrativeAreaName: "",
                        address: "",
                        industryCode: 0,
                        industryName: "",
                        industyType: "",
                        economicTypeCode: 0,
                        economicTypeName: "",
                        companyCode: ""
                    },
                    user: {
                        userName: "",
                        ps: "",
                        ps1: "",
                        realName: "",
                        sex: "0",
                        jobs: "",
                        phone: "",
                        officePhone: "",
                        email: ""
                    }
                },
                companyUserInfoRules: {
                    companyName: [
                        {required: true, message: '请输入企业名称', trigger: 'blur'}
                    ],
                    administrativeAreaName: [
                        {required: true, message: '请输入行政区域名称', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'}
                    ],
                    industryName: [
                        {required: true, message: '请输入所属行业名称', trigger: 'blur'}
                    ],
                    industyType: [
                        {required: true, message: '请输入行业类别', trigger: 'blur'}
                    ],
                    companyCode: [
                        {required: true, message: '请输入组织机构代码', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    password1: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'blur'}
                    ],
                    jobs: [
                        {required: true, message: '请输入职务', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ]
                },
                dicCatalogData: [],
                display: 'none',
                dicCatalogProps: {
                    label: 'name',
                    children: 'children'
                },
                industyVisible: false,
                dicIndustyData: [],
                dicIndustyProps: {
                    label: 'name',
                    children: 'children'
                },
                openAddDialog: false,
                administrativeVisible: false,
                companyUserVisible: false,
                companyUserData: [],
                companyUserListLoading: false,
                addUser: {},
                addUserParam: {},
                addUserVisible: false,
                companyId: 0,
                addUserLoadding: false,
                addUserRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    password1: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'blur'}
                    ],
                    jobs: [
                        {required: true, message: '请输入职务', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ]
                },
                /*企业用户编辑*/
                editUser: {},
                editUserVisible: false,
                editUserLoading: false,
                editUserRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'blur'}
                    ],
                    jobs: [
                        {required: true, message: '请输入职务', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ]
                },
                /*修改密码*/
                pwdForm: {
                    username: '',
                    password: '',
                    newPassword: '',
                    surePassword: '',
                    id: ''
                },
                pwdLoading: false,
                pwdVisible: false,
                pwdRules: {
                    /*         password: [
                     {required: true, message: '请输入旧密码', trigger: 'blur'},
                     {validator: checkPasswordRight, trigger: 'blur'}
                     ],*/
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        /*  {validator: validateNewPassword, trigger: 'blur'}*/
                    ],
                    surePassword: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                }
                
                
            }
        },
        mounted() {
            this.queryCompanyInfo()
        },
        methods: {
            query() {
                let _this = this;
                _this.queryParam.pageNum = 1;
                _this.queryCompanyInfo();
            },
            // 密码明文加密
            encryptedPwd(pwd) {
                let _this = this;
                if (_this.KHUtils.isInvalidValue(pwd)) {
                    return false;
                }
                let encryptor = new JSEncrypt();
                encryptor.setPublicKey(_this.khConfig.host.publicKeyStr);
                return encryptor.encrypt(pwd);
            },
            queryCompanyInfo() {
                this.listLoading = true;
                this.$Get(this.khConfig.api.queryCompanyInfoCondition, this.queryParam).then(res => {
                    this.tableData = res.datas;
                    this.totalPage = res.totalCount;
                    this.listLoading = false;
                });
            },
            filterTag(value, row) {
                return row.status === value;
            },
            //企业审核
            checkCompany(value, status) {
                this.checkParam.checkStatus = status;
                var title;
                if (status == "1") {
                    title = "确认审核通过该企业？"
                } else if (status == "2") {
                    title = "确认不审核通过该企业？"
                }
                this.$confirm(title, '提示', {}).then(() => {
                    this.$Get(this.khConfig.api.checkCompany + "/" + value.id, this.checkParam)
                        .then(res => {
                            if (res.errCode === 0) {
                                this.$notify({
                                    title: '成功',
                                    message: '操作成功',
                                    type: 'success'
                                });
                            } else {
                                this.$notify({
                                    title: '操作失败',
                                    message: '操作失败',
                                    type: 'error'
                                });
                            }
                            this.queryCompanyInfo();
                        })
                }).catch((e) => {
                    console.log(e)
                });
                
            },
            //企业作废
            deleteCompany(value) {
                this.$confirm("确认是否作废该企业", '提示', {}).then(() => {
                    this.$Get(this.khConfig.api.deleteCompanyInfo + "/" + value.id)
                        .then(res => {
                            if (res.errCode === 0) {
                                this.$notify({
                                    title: '操作成功',
                                    message: '作废企业成功',
                                    type: 'success'
                                });
                            } else {
                                this.$notify({
                                    title: '操作失败',
                                    message: '作废企业失败',
                                    type: 'error'
                                });
                            }
                            this.queryCompanyInfo();
                        })
                }).catch((e) => {
                    console.log(e)
                });
            },
            // 显示编辑页面
            handleEdit(row) {
                this.editFormVisible = true;
                this.formTitle = '编辑';
                this.editForm = row;
            },
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            this.$Get(this.khConfig.api.updateCompanyInfo, this.editForm)
                                .then(res => {
                                    this.editLoading = false;
                                    if (res.errCode === 0) {
                                        this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    this.queryCompanyInfo();
                                    this.editFormVisible = false;
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            handleAdd() {
                this.addCompanyInfoVisible = true;
                this.companyUserInfo = {
                    companyInfo: {
                        companyName: "",
                        administrativeAreaCode: 0,
                        administrativeAreaName: "",
                        address: "",
                        industryCode: 0,
                        industryName: "",
                        industyType: "",
                        economicTypeCode: 0,
                        economicTypeName: "",
                        companyCode: ""
                    },
                    user: {
                        userName: "",
                        password: "",
                        password1: "",
                        realName: "",
                        sex: "0",
                        jobs: "",
                        phone: "",
                        officePhone: "",
                        email: ""
                    }
                }
                
                
            },
            saveCompanyUserInfo() {
                this.$refs.companyUserInfo.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            if (this.companyUserInfo.user.password != this.companyUserInfo.user.password1) {
                                this.$notify({
                                    title: '错误',
                                    message: '两次密码不一致请重新输入！',
                                    type: 'error'
                                });
                            } else {
                                this.saveCompanyUserInfoLoading = true;
                                var pwd = this.companyUserInfo.user.password;
                                this.companyUserInfo.user.password = this.encryptedPwd(pwd);
                                this.companyUserInfo.user.password1 = this.encryptedPwd(pwd);
                                this.paramInfo.companyInfo.companyName = this.companyUserInfo.companyInfo.companyName;
                                this.paramInfo.companyInfo.administrativeAreaCode = this.companyUserInfo.companyInfo.administrativeAreaCode;
                                this.paramInfo.companyInfo.administrativeAreaName = this.companyUserInfo.companyInfo.administrativeAreaName;
                                this.paramInfo.companyInfo.address = this.companyUserInfo.companyInfo.address;
                                this.paramInfo.companyInfo.lat = this.companyUserInfo.companyInfo.lat;
                                this.paramInfo.companyInfo.lnt = this.companyUserInfo.companyInfo.lnt;
                                this.paramInfo.companyInfo.industryCode = this.companyUserInfo.companyInfo.industryCode;
                                this.paramInfo.companyInfo.industryName = this.companyUserInfo.companyInfo.industryName;
                                this.paramInfo.companyInfo.industyType = this.companyUserInfo.companyInfo.industyType;
                                this.paramInfo.companyInfo.economicTypeCode = this.companyUserInfo.companyInfo.economicTypeCode;
                                this.paramInfo.companyInfo.economicTypeName = this.companyUserInfo.companyInfo.economicTypeName;
                                this.paramInfo.companyInfo.companyCode = this.companyUserInfo.companyInfo.companyCode;
                                this.paramInfo.user.userName = this.companyUserInfo.user.userName;
                                this.paramInfo.user.ps = this.companyUserInfo.user.password;
                                this.paramInfo.user.ps1 = this.companyUserInfo.user.password1;
                                this.paramInfo.user.realName = this.companyUserInfo.user.realName;
                                this.paramInfo.user.sex = this.companyUserInfo.user.sex;
                                this.paramInfo.user.jobs = this.companyUserInfo.user.jobs;
                                this.paramInfo.user.phone = this.companyUserInfo.user.phone;
                                this.paramInfo.user.officePhone = this.companyUserInfo.user.officePhone;
                                this.paramInfo.user.email = this.companyUserInfo.user.email;
                                this.$PostJson(this.khConfig.api.companyRegistered, this.paramInfo)
                                    .then(res => {
                                        this.saveCompanyUserInfoLoading = false;
                                        if (res.errCode === 0) {
                                            this.queryCompanyInfo();
                                            this.$notify({
                                                title: '成功',
                                                message: '操作成功',
                                                type: 'success'
                                            });
                                        } else {
                                            this.$notify({
                                                title: '失败',
                                                message: '操作失败',
                                                type: 'error'
                                            });
                                        }
                                        this.addCompanyInfoVisible = false;
                                    })
                            }
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
                
                
            },// 分页查询
            handleCurrentChange(val) {
                this.queryParam.pageNum = val;
                this.queryCompanyInfo();
            },
            
            //获取行政区域数据字典
            getAdministrativeDic() {
                let _this = this;
                _this.dicCatalogData = [];
                _this.$Get(_this.khConfig.api.getAdministrativeDic)
                    .then(res => {
                        if (res.children != null && res.children.length > 0) {
                            _this.dicCatalogData = res.children;
                        }
                    })
            },
            //获取所属行业数据字典
            getIndustryDic() {
                let _this = this;
                _this.dicIndustyData = [];
                _this.$Get(_this.khConfig.api.getIndustryDic)
                    .then(res => {
                        if (res.children != null && res.children.length > 0) {
                            _this.dicIndustyData = res.children;
                        }
                    })
            },
            // 是否展开字典类目树
            displayTree() {
                this.openAddDialog = false;
                this.getAdministrativeDic();
                this.administrativeVisible = true;
                /*if (this.display === 'none') {
                 this.display = 'block'
                 } else if (this.display === 'block') {
                 this.display = 'none'
                 }*/
            },
            openIndusty() {
                this.openAddDialog = false;
                this.getIndustryDic();
                this.industyVisible = true;
            },
            openAddCompanyArea() {
                this.openAddDialog = true;
                this.getAdministrativeDic();
                this.administrativeVisible = true;
                
            },
            openAddCompanyIndusty() {
                this.openAddDialog = true;
                this.getIndustryDic();
                this.industyVisible = true;
            },
            // 选择上级
            selectDicCatalog(data, node, self) {
                if (this.openAddDialog == true) {
                    this.companyUserInfo.companyInfo.administrativeAreaCode = data.id;
                    this.companyUserInfo.companyInfo.administrativeAreaName = data.name;
                    this.administrativeVisible = false;
                } else {
                    this.editForm.administrativeAreaCode = data.id;
                    this.editForm.administrativeAreaName = data.name;
                    this.administrativeVisible = false;
                }
                
                this.display = 'none';
            },
            selectDicIndusty(data, node, self) {
                if (this.openAddDialog == true) {
                    this.companyUserInfo.companyInfo.industryCode = data.id;
                    this.companyUserInfo.companyInfo.industryName = data.name;
                    this.industyVisible = false;
                } else {
                    this.editForm.industryCode = data.id;
                    this.editForm.industryName = data.name;
                    this.industyVisible = false;
                }
                
            },
            //打开企业用户dialog
            openCompanyUser(value) {
                this.companyUserVisible = true;
                this.companyId = value.id;
                this.queryCurrentCompanyUsers(this.companyId)
            },
            queryCurrentCompanyUsers(id) {
                this.companyUserListLoading = true;
                this.$Get(this.khConfig.api.queryAllUsersByCompanyId + "/" + id).then(res => {
                    this.companyUserData = res.datas;
                    this.companyUserListLoading = false;
                });
            },
            //企业用户编辑
            companyUserEdit(row) {
                this.editUserVisible = true;
                this.editUser = row;
            },
            //新增企业用户
            addCompanyUser() {
                this.addUserVisible = true;
                this.addUser = {};
            },
            addUserSubmit() {
                this.addUser.companyId = this.companyId;
                this.$refs.addUser.validate((valid) => {
                    if (valid) {
                        if (this.addUser.password != this.addUser.password1) {
                            this.$notify({
                                title: '错误',
                                message: '两次密码不一致请重新输入！',
                                type: 'error'
                            });
                        } else {
                            this.addUserLoadding = true;
                            var pwd = this.addUser.password;
                            this.addUser.password = this.encryptedPwd(pwd);
                            this.addUser.password1 = this.encryptedPwd(pwd);
                            this.addUserParam.companyId = this.addUser.companyId;
                            this.addUserParam.userName = this.addUser.userName;
                            this.addUserParam.ps = this.addUser.password;
                            this.addUserParam.ps1 = this.addUser.password1;
                            this.addUserParam.realName = this.addUser.realName;
                            this.addUserParam.sex = this.addUser.sex;
                            this.addUserParam.jobs = this.addUser.jobs;
                            this.addUserParam.phone = this.addUser.phone;
                            this.addUserParam.officePhone = this.addUser.officePhone;
                            this.addUserParam.email = this.addUser.email;
                            this.$Get(this.khConfig.api.addCompanyUser, this.addUserParam)
                                .then(res => {
                                    this.addUserLoadding = false;
                                    if (res.errCode === 0) {
                                        this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    this.queryCurrentCompanyUsers(this.companyId);
                                    this.addUserVisible = false;
                                })
                        }
                        
                    }
                });
            },
            //修改企业用户信息
            editUserSubmit() {
                this.$refs.editUser.validate((valid) => {
                    if (valid) {
                        this.editUserLoading = true;
                        this.$Get(this.khConfig.api.updateCompanyUserInfo, this.editUser)
                            .then(res => {
                                this.editUserLoading = false;
                                if (res.errCode === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                }
                                this.queryCurrentCompanyUsers(this.companyId);
                                this.editUserVisible = false;
                            })
                    }
                });
            },
            //删除用户
            deleteCompanyUser(row) {
                
                let _this = this;
                _this.$confirm('确认删除' + row.userName + '用户吗？', '提示', {}).then(() => {
                    setTimeout(function () {
                        let param = {
                            ids: row.userId
                        };
                        _this.$Get(_this.khConfig.api.deleteCompanyUser, param)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    _this.queryCurrentCompanyUsers(_this.companyId);
                                }
                            })
                    }, 1000);
                }).catch((e) => {
                    console.log(e)
                });
                
                
            },
            /*修改密码*/
            changePwd(row) {
                console.log(JSON.stringify(row))
                this.pwdVisible = true;
                this.pwdForm.username = row.userName;
                this.pwdForm.id = row.userId;
                this.pwdForm.password = "";
                this.pwdForm.newPassword = "";
                this.pwdForm.surePassword = "";
                
            },
            // 修改密码
            updatePwd() {
                let _this = this;
                _this.$refs.pwdForm.validate((valid) => {
                    if (valid) {
                        _this.pwdLoading = true;
                        setTimeout(function () {
                            _this.pwdLoading = false;
                            let paramArray = [];
                            paramArray.push("username=" + _this.pwdForm.username);
                            paramArray.push("password=" + _this.encryptedPwd(_this.pwdForm.newPassword));
                            paramArray.push("id=" + _this.pwdForm.id);
                            paramArray = paramArray.join("&");
                            _this.$Post(_this.khConfig.api.updatePwd, paramArray)
                                .then(res => {
                                    if (res.errCode === 0) {
                                        _this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    _this.pwdVisible = false;
                                })
                        }, 1000);
                    }
                });
            },
            // 重置密码
            resetPwd(row) {
                let _this = this;
                _this.$confirm('确认重置' + row.userName + '的密码吗？', '提示', {}).then(() => {
                    setTimeout(function () {
                        let paramArray = [];
                        paramArray.push("username=" + row.userName);
                        // paramArray.push("password=kh123456");
                        paramArray.push("id=" + row.userId);
                        paramArray = paramArray.join("&");
                        _this.$Post(_this.khConfig.api.resetPwd, paramArray)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.$notify({
                                        title: '成功',
                                        message: '重置密码成功,初始密码为kh123456,请尽快修改密码！！！',
                                        type: 'success',
                                        duration: 0
                                    });
                                }
                            })
                    }, 1000);
                }).catch((e) => {
                    console.log(e)
                });
            },
            //打开gis定位
            openGis() {
                this.gisVisible = true;
            },
            //返回定位信息
            recGisMsg(obj) {
                this.companyUserInfo.companyInfo.lat = obj.lat;
                this.companyUserInfo.companyInfo.lnt = obj.lnt;
                this.companyUserInfo.companyInfo.address = obj.address;
                this.gisVisible = false;
                
                
            },
            // 关闭GIs窗口通知子组件返回数据给父组件
            handlerGisClose() {
                this.notifyChild++;
            },
            
        },
        computed: {
            statusName: function () {
                return function (value) {
                    var name;
                    switch (value) {
                        case "0":
                            name = "未审核";
                            break;
                        case  "1":
                            name = "审核通过";
                            break;
                        case  "2":
                            name = "审核不通过";
                            break;
                        case "3":
                            name = "已作废";
                            break;
                    }
                    return name;
                }
            },
            buttonShow: function () {
                return function (value, type) {
                    var isshow = false;
                    switch (type) {
                        case "check":
                            if (value == "0") {
                                isshow = true;
                            }
                            break;
                        case "unCheck":
                            if (value == "0") {
                                isshow = true;
                            }
                            break;
                        case "delete":
                        case "user":
                            if (value == "1") {
                                isshow = true;
                            }
                            break;
                    }
                    return isshow;
                    
                }
            },
            sexName: function () {
                return function (value) {
                    var name;
                    switch (value) {
                        case "0":
                            name = "男";
                            break;
                        case  "1":
                            name = "女";
                            break;
                    }
                    return name;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-company-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }
</style>

<template>
    <el-row class="process-manage">
        <!--任务管理-->
        <el-row class="header">
            <span class="header-title">任务管理</span>
        </el-row>
        <!--待办任务/未读消息-->
        <el-row type="flex"  class="process-manage-top">
            <div class="roundedRectangle" @click="listTask('toDo')">
                <p>{{taskToDoNum}}</p>
                <span>待办审批</span>
            </div>

            <div class="roundedRectangle" @click="listSelfMsg(0)">
                <p>{{unReadMsgCount}}</p>
                <span>未读消息</span>
            </div>
            <div class="icon-box" @click="listTask('launched')">
                <p class="iconfont">&#xe605;</p>
                <span>我发起的</span>
            </div>
            <div class="icon-box" @click="listTask('done')">
                <p class="iconfont">&#xe61c;</p>
                <span>我审批的</span>
            </div>

            <div class="icon-box" @click="listSelfMsg(1)">
                <p class="iconfont">&#xe617;</p>
                <span>抄送我的</span>
            </div>
        </el-row>
        <!--待办任务列表信息-->
        <el-dialog title="待办审批" :visible.sync="toDotaskVisible" :close-on-click-modal="false">
            <el-table
                :data="taskData"
                tooltip-effect="dark"
                border
                style="width: 100%"
                empty-text="暂无数据"
                @row-click="beforeApprovalToDo"
                v-loading="taskLoading"
            >
                <el-table-column
                    prop="businessName"
                    label="流程业务名称"/>
                <el-table-column prop="taskCreateTime" label="开始时间" :formatter="formatTaskTime" width="180"/>
            </el-table>
            <p>
                <el-pagination
                    layout="prev, pager, next"
                    :current-page="queryTaskToDoParam.pageNum"
                    @current-change="handleTaskToDoCurrentChange"
                    :total="totalPage">
                </el-pagination>
            </p>
        </el-dialog>
        <!--我发起的列表信息-->
        <el-dialog title="我发起的" :visible.sync="launchedTaskVisible" :close-on-click-modal="false">
            <el-table
                :data="taskData"
                tooltip-effect="dark"
                border
                style="width: 100%"
                empty-text="暂无数据"
                @row-click="beforeApprovalLaunched"
                v-loading="taskLoading">
                <el-table-column
                    prop="businessName"
                    label="流程业务名称"/>
                <el-table-column prop="startTime" label="开始时间" :formatter="formatTaskTime" width="180"/>
                <el-table-column prop="endTime" label="完成时间" :formatter="formatTaskTime" width="180"/>
                <el-table-column label="审批状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.approveStatus==='0'" type="primary">审批中</el-tag>
                        <el-tag v-if="scope.row.approveStatus==='1'" type="success">审批通过</el-tag>
                        <el-tag v-if="scope.row.approveStatus==='2'" type="danger">审批不通过</el-tag>
                        <el-tag v-if="scope.row.approveStatus==='3'" type="info">发起人已撤销</el-tag>
                        <el-tag v-if="scope.row.approveStatus===''||scope.row.approveStatus===null" type="warning">
                            未知状态
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <p>
                <el-pagination
                    layout="prev, pager, next"
                    :current-page="queryTaskLaunchedParam.pageNum"
                    @current-change="handleTaskLaunchedCurrentChange"
                    :total="totalPage">
                </el-pagination>
            </p>
        </el-dialog>
        <!--我审批的列表信息-->
        <el-dialog title="我审批的" :visible.sync="doneTaskVisible" :close-on-click-modal="false">
            <el-table
                :data="taskData"
                tooltip-effect="dark"
                border
                style="width: 100%"
                empty-text="暂无数据"
                @row-click="beforeApprovalDone"
                v-loading="taskLoading">
                <el-table-column
                    prop="businessName"
                    label="流程业务名称"/>
                <el-table-column prop="startTime" label="开始时间" :formatter="formatTaskTime" width="180"/>
                <el-table-column prop="endTime" label="完成时间" :formatter="formatTaskTime" width="180"/>
                <el-table-column label="审批状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.approveStatus==='0'" type="primary">审批中</el-tag>
                        <el-tag v-if="scope.row.approveStatus==='1'" type="success">审批通过</el-tag>
                        <el-tag v-if="scope.row.approveStatus==='2'" type="danger">审批不通过</el-tag>
                        <el-tag v-if="scope.row.approveStatus==='3'" type="info">发起人已撤销</el-tag>
                        <el-tag v-if="scope.row.approveStatus===''||scope.row.approveStatus===null" type="warning">
                            未知状态
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <p>
                <el-pagination
                    layout="prev, pager, next"
                    :current-page="queryTaskBeDoneParam.pageNum"
                    @current-change="handleTaskBeDoneCurrentChange"
                    :total="totalPage">
                </el-pagination>
            </p>
        </el-dialog>
        <!--消息列表-->
        <el-dialog :title="msgTitle" :visible.sync="msgVisible" :close-on-click-modal="false">
            <el-table
                :data="msgTableData"
                tooltip-effect="dark"
                border
                style="width: 100%"
                empty-text="暂无数据"
                v-loading="msgLoading"
                @row-click="beforeApproveMsg"
            >
                <el-table-column
                    prop="msgName"
                    label="消息名称"/>
                <el-table-column
                    prop="createTime"
                    label="开始时间"
                    :formatter="formatTaskTime"
                    width="180"
                />
                <el-table-column
                    v-if="msgParam.statusList === 1"
                    prop="readTime"
                    label="完成时间"
                    :formatter="formatTaskTime"
                    width="180"
                />
                <el-table-column label="消息类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.bigType===1 && scope.row.smallType===1" type="primary">抄送</el-tag>
                        <el-tag v-if="scope.row.bigType===1 && scope.row.smallType===2" type="danger">催办</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status===0" type="danger">未读</el-tag>
                        <el-tag v-if="scope.row.status===1" type="success">已读</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <p>
                <el-pagination
                    layout="prev, pager, next"
                    :current-page="msgParam.pageNum"
                    @current-change="handleMsgCurrentChange"
                    :total="msgTotalCount">
                </el-pagination>
            </p>
        </el-dialog>
        <!--填写发起审批时-->
        <el-dialog :title="approvalTitle" :visible.sync="approvalInitiateVisible" :close-on-click-modal="false"
                   id="initiate"
                   width="80%">
            <!--表单为可编辑状态-->
            <form-build-launched
                :data="formConfig"
                :value="dataModels"
                ref="buildForm"
                :formId="row.formId"
                v-if="launchedHackReset">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-launched>
            <!--子表单-->
            <template v-for="item in tableFormConfig">
                <batch-table v-if="launchedHackReset" :item="item"  :formId="row.formId"></batch-table>
            </template>
            <!-- 发起审批显示 -->
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="initiateApproval" :loading="approvalInitiateLoading">提交
                </el-button>
            </div>
        </el-dialog>
        <!--待办审批列表点击行查看-->
        <el-dialog :title="approvalTitle" :visible.sync="approvalToDoVisible" :close-on-click-modal="false" width="80%"
                   id="toDo">
            <!--填写的申请-->
            <form-build-process
                :data="formConfig"
                :value="dataModels"
                ref="buildForm"
                v-if="approvalToDoHackReset">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-process>
            <template v-for="item in tableFormConfig" v-if="parentBusinessId !== 0">
                <!--是否含有子表单-->
                <batch-table-disable v-if="approvalToDoHackReset" :item="item" :data-config="formConfig.config"
                                     :form-id="parentFormId"
                                     :parent-id="parentBusinessId"></batch-table-disable>
            </template>
            <!--审批项-->
            <form-build-launched
                :data="currentApprovalFormConfig"
                :value="currentApprovalDataModel"
                ref="currentApprovalBuildForm"
                v-if="currentApprovalHackReset">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-launched>
            <!--审批状态-->
            <div style="margin: 0 0 20px 36px;">
                <el-tag v-if="approveStatus==='0'" type="primary">审批中</el-tag>
                <el-tag v-if="approveStatus==='1'" type="success">审批通过</el-tag>
                <el-tag v-if="approveStatus==='2'" type="danger">审批不通过</el-tag>
                <el-tag v-if="approveStatus==='3'" type="info">发起人已撤销</el-tag>
                <el-tag v-if="approveStatus===''|| approveStatus===null" type="warning">
                    未知状态
                </el-tag>
            </div>
            <!--审批记录-->
            <div class="block" style="margin-top:10px">
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in timeLineList"
                        size="large"
                        :icon="activity.icon"
                        :type="activity.type"
                        :key="index"
                        :timestamp="activity.remark">
                        <span v-html="activity.content"></span>
                        <form-build-process
                            v-if="activity.tempHackSet"
                            :data="activity.tempFormConfig"
                            :value="activity.tempDataModel"
                            ref="activityBuildForm">
                            <template v-slot:blank="scope">
                                宽度：
                                <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                                高度：
                                <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                            </template>
                        </form-build-process>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="agreeApproval('toDo')" :loading="agreeLoading">同意</el-button>
                <el-button type="danger" @click.native="disagreeApproval('toDo')" :loading="disagreeLoading">不同意
                </el-button>
            </div>
        </el-dialog>
        <!--我发起的列表点击行查看-->
        <el-dialog :title="approvalTitle" :visible.sync="approvalLaunchedVisible" :close-on-click-modal="false"
                   id="launched"
                   width="80%">
            <form-build-process
                :data="formConfig"
                :value="dataModels"
                ref="buildForm"
                v-if="approvalLaunchedHackReset">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-process>
            <template v-for="item in tableFormConfig" v-if="parentBusinessId !== 0">
                <!--是否含有子表单-->
                <batch-table-disable :item="item" :data-config="formConfig.config" :form-id="parentFormId"
                                     :parent-id="parentBusinessId"></batch-table-disable>
            </template>
            <!--审批状态-->
            <div style="margin: 0 0 20px 36px;">
                <el-tag v-if="approveStatus==='0'" type="primary">审批中</el-tag>
                <el-tag v-if="approveStatus==='1'" type="success">审批通过</el-tag>
                <el-tag v-if="approveStatus==='2'" type="danger">审批不通过</el-tag>
                <el-tag v-if="approveStatus==='3'" type="info">发起人已撤销</el-tag>
                <el-tag v-if="approveStatus===''|| approveStatus===null" type="warning">
                    未知状态
                </el-tag>
            </div>
            <!--审批记录-->
            <div class="block" style="margin-top:10px">
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in timeLineList"
                        size="large"
                        :icon="activity.icon"
                        :type="activity.type"
                        :key="index"
                        :timestamp="activity.remark">
                        <span v-html="activity.content"></span>
                        <form-build-process
                            v-if="activity.tempHackSet"
                            :data="activity.tempFormConfig"
                            :value="activity.tempDataModel"
                            ref="activityBuildForm">
                            <template v-slot:blank="scope">
                                宽度：
                                <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                                高度：
                                <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                            </template>
                        </form-build-process>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <!-- 我发起并且审批中才显示 -->
            <div slot="footer" class="dialog-footer" v-if="approveStatus==='0'">
                <el-button type="primary" @click.native="remindProcess" :loading="remindLoading">催办</el-button>
                <el-button type="info" @click.native="cancelProcess" :loading="cancelLoading">撤销</el-button>
            </div>
            <!-- 审批通过显示 -->
            <div slot="footer" class="dialog-footer" v-if="approvalPass">
                <p style="text-align: center; font-size: 14px;color: #777777;">
                    <i class="iconfont">&#xe64a;</i>
                    {{approvalTimeCost}}
                </p>
            </div>
        </el-dialog>
        <!--我审批的列表点击行查看-->
        <el-dialog :title="approvalTitle" :visible.sync="approvalDoneVisible" :close-on-click-modal="false" width="80%"
                   id="done">
            <form-build-process
                :data="formConfig"
                :value="dataModels"
                ref="buildForm"
                v-if="approvalDoneHackReset">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-process>
            <template v-for="item in tableFormConfig" v-if="parentBusinessId !== 0">
                <!--是否含有子表单-->
                <batch-table-disable v-if="approvalDoneHackReset" :item="item" :data-config="formConfig.config"
                                     :form-id="parentFormId"
                                     :parent-id="parentBusinessId"></batch-table-disable>
            </template>
            <!--审批状态-->
            <div style="margin: 0 0 20px 36px;">
                <el-tag v-if="approveStatus==='0'" type="primary">审批中</el-tag>
                <el-tag v-if="approveStatus==='1'" type="success">审批通过</el-tag>
                <el-tag v-if="approveStatus==='2'" type="danger">审批不通过</el-tag>
                <el-tag v-if="approveStatus==='3'" type="info">发起人已撤销</el-tag>
                <el-tag v-if="approveStatus===''|| approveStatus===null" type="warning">
                    未知状态
                </el-tag>
            </div>
            <!--审批记录-->
            <div class="block" style="margin-top:10px">
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in timeLineList"
                        size="large"
                        :icon="activity.icon"
                        :type="activity.type"
                        :key="index"
                        :timestamp="activity.remark">
                        <span v-html="activity.content"></span>
                        <form-build-process
                            v-if="activity.tempHackSet"
                            :data="activity.tempFormConfig"
                            :value="activity.tempDataModel"
                            ref="activityBuildForm">
                            <template v-slot:blank="scope">
                                宽度：
                                <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                                高度：
                                <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                            </template>
                        </form-build-process>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <!-- 审批通过显示 -->
            <div slot="footer" class="dialog-footer" v-if="approvalPass">
                <p style="text-align: center; font-size: 14px;color: #777777;">
                    <i class="iconfont">&#xe64a;</i>
                    {{approvalTimeCost}}
                </p>
            </div>
        </el-dialog>
        <!--消息列表点击行查看-->
        <el-dialog :title="approvalTitle" :visible.sync="approvalMsgVisible" :close-on-click-modal="false" width="80%"
                   id="msg">
            <form-build-process
                :data="formConfig"
                :value="dataModels"
                :formId="formId"
                ref="buildForm"
                v-if="approvalMsgHackReset">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-process>
            <template v-for="item in tableFormConfig" v-if="parentBusinessId !== 0">
                <!--是否含有子表单-->
                <batch-table-disable v-if="approvalMsgHackReset" :item="item" :data-config="formConfig.config"
                                     :form-id="parentFormId"
                                     :parent-id="parentBusinessId"></batch-table-disable>
            </template>
            <!--催办显示审批意见填写-->
            <div v-if="bigType === 1 && smallType === 2 && approveStatus==='0' && currentUserApproval">
                <!--审批项-->
                <form-build-launched
                    :data="currentApprovalFormConfigMsg"
                    :value="currentApprovalDataModelMsg"
                    ref="currentApprovalBuildFormMsg"
                    v-if="currentApprovalHackResetMsg">
                    <template v-slot:blank="scope">
                        宽度：
                        <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                        高度：
                        <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                    </template>
                </form-build-launched>
            </div>
            <!--审批状态-->
            <div style="margin: 0 0 20px 36px;">
                <el-tag v-if="approveStatus==='0'" type="primary">审批中</el-tag>
                <el-tag v-if="approveStatus==='1'" type="success">审批通过</el-tag>
                <el-tag v-if="approveStatus==='2'" type="danger">审批不通过</el-tag>
                <el-tag v-if="approveStatus==='3'" type="info">发起人已撤销</el-tag>
                <el-tag v-if="approveStatus===''|| approveStatus===null" type="warning">
                    未知状态
                </el-tag>
            </div>
            <!--审批记录-->
            <div class="block" style="margin-top:10px">
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in timeLineList"
                        size="large"
                        :icon="activity.icon"
                        :type="activity.type"
                        :key="index"
                        :timestamp="activity.remark">
                        <span v-html="activity.content"></span>
                        <form-build-process
                            v-if="activity.tempHackSet"
                            :data="activity.tempFormConfig"
                            :value="activity.tempDataModel"
                            ref="activityBuildForm">
                            <template v-slot:blank="scope">
                                宽度：
                                <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                                高度：
                                <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                            </template>
                        </form-build-process>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <!--待审批状态并且状态在审批中或者催办消息类型大类为1小类为2并且状态在审批中,是当前自己的任务显示同意、不同意按钮-->
            <div slot="footer" class="dialog-footer"
                 v-if="bigType === 1 && smallType === 2 && approveStatus==='0' && currentUserApproval">
                <el-button type="primary" @click.native="agreeApproval('msg')" :loading="agreeLoading">同意</el-button>
                <el-button type="danger" @click.native="disagreeApproval('msg')" :loading="disagreeLoading">不同意
                </el-button>
            </div>
            <!-- 审批通过显示 -->
            <div slot="footer" class="dialog-footer" v-if="approvalPass">
                <p style="text-align: center; font-size: 14px;color: #777777;">
                    <i class="iconfont">&#xe64a;</i>
                    {{approvalTimeCost}}
                </p>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import FormBuildLaunched from "@/components/form-build/process/RestructureFormBuildLaunched";
    import FormBuildProcess from "@/components/form-build/process/RestructureFormBuildProcess";
    import FormBuildItemTd from "@/components/form-build/table/RestructureFormBuildTd";
    import BatchTable from "@/components/table/BatchTable";
    import BatchTableDisable from "@/components/table/BatchTableDisable";

    export default {
        name: "TaskManagement",
        // list: 流程表单列表点击发去申请,触发当前表单的动作处理
        // row: 流程表单基本信息
        props: ['list', 'row'],
        components: {
            FormBuildLaunched,
            FormBuildProcess,
            FormBuildItemTd,
            BatchTable,
            BatchTableDisable
        },
        watch: {
            list() {
                this.showApproval(this.row);
            }
        },
        data() {
            return {
                parentFormId: 0,  // 父表单ID
                parentBusinessId: 0, // 父表单的业务ID
                tableFormConfig: [],// 子表单的配置集合
                // 表单配置信息
                formConfig: "",
                dataModels: {},
                formId: "",
                // 任务列表
                toDotaskVisible: false, // 待办任务Dialog
                launchedTaskVisible: false,// 我发起的Dialog
                doneTaskVisible: false, // 我审批的Dialog
                queryTaskToDoParam: {pageNum: 1},// 待办分页查询参数
                queryTaskBeDoneParam: {pageNum: 1},// 我审批的分页查询参数
                queryTaskLaunchedParam: {pageNum: 1},// 我发起的分页查询参数
                totalPage: 1,
                taskData: [],
                taskLoading: false,
                taskToDoNum: 0,    // 待办任务数量
                taskBeDoneNum: 0,  // 已办任务数量
                currentTaskFlag: '',
                // 填写发起审批
                launchedHackReset: false,
                approvalInitiateVisible: false, // 发起审批Dialog
                approvalInitiateLoading: false, // 提交状态
                // 我发起的列表点击行查看
                approvalLaunchedVisible: false,
                remindLoading: false, // 催办状态
                cancelLoading: false, // 撤销状态
                approvalLaunchedHackReset: false,
                // 待办审批列表点击行查看
                approvalToDoVisible: false,
                approvalToDoHackReset: false,
                // 我审批的列表点击行查看
                approvalDoneVisible: false,
                approvalDoneHackReset: false,
                // 消息相关的参数 大类 1 流程消息;小类 1 流程抄送消息;2 流程催办信息
                bigType: 0,   // 消息大类
                smallType: 0, // 消息小类
                msgTitle: "",
                unReadMsgCount: 0,
                msgVisible: false,
                msgTableData: [],
                msgLoading: false,
                msgParam: {pageNum: 1, pageSize: 10, statusList: 0},// 0 未读;1已读
                msgTotalCount: 0,
                approvalMsgHackReset: false,
                approvalMsgVisible: false,
                // 审批记录
                approvalTimeCost: "",    // 耗时计算
                timeLineList: [],        // 时间线
                agreeLoading: false,
                disagreeLoading: false,
                approvalParam: {taskId: '', businessId: ''}, // 提交审批意见参数
                approvalPass: false,                // 当为true时为审批是已经通过
                approvalInitiate: false,            // 当为true时为发起审批状态
                approvalTitle: "",
                approveStatus: "",                 // 当前审批状态
                currentProcess: {},                // 当前审批的流程
                currentUserApproval: false,          // 是否为当前用户审批
                // 动态审批填报项
                currentApprovalFormConfig: {list: [], config: {}},
                currentApprovalDataModel: {},
                currentApprovalHackReset: false,
                currentApprovalFormConfigMsg: {list: [], config: {}},
                currentApprovalHackResetMsg: false,
                currentApprovalDataModelMsg: {}
            };
        },
        mounted() {
            this.queryTaskToDoNum();
            this.queryUnReadMsgNum();
        },
        methods: {
            // 初始话表单样式
            initAddEditFormStyle(dialogId) {
                let _this = this;
                setTimeout(() => {
                    if (!_this.KHUtils.isNull(_this.formConfig.config.backgroundColor)) {
                        var addEditDialog = document.getElementById(dialogId);
                        if (addEditDialog !== null) {
                            var elDialog = addEditDialog.getElementsByClassName(" el-dialog");
                            for (var i = 0; i < elDialog.length; i++) {
                                if (elDialog[i]._prevClass === 'el-dialog') {
                                    elDialog[i].setAttribute("style", "background-color:" + _this.formConfig.config.backgroundColor + ";margin-top: 15vh;width:80%");
                                }
                            }
                            var elDialogTitle = addEditDialog.getElementsByClassName(" el-dialog__title");
                            for (var i = 0; i < elDialogTitle.length; i++) {
                                if (elDialogTitle[i]._prevClass === 'el-dialog__title') {
                                    elDialogTitle[i].setAttribute("style", "color:" + _this.formConfig.config.widgetTitleFontColor + ";line-height: 24px;font-size: 18px");
                                }
                            }
                        }
                        // 保存按钮
                        var elButtonPrimary = addEditDialog.getElementsByClassName(" el-button--primary");
                        let btnWidgetBackgroundColor = _this.formConfig.config.btnWidgetBackgroundColor;
                        let btnWidgetFontColor = _this.formConfig.config.btnWidgetFontColor;
                        for (var i = 0; i < elButtonPrimary.length; i++) {
                            if (elButtonPrimary[i].textContent === '提交') {
                                elButtonPrimary[i].setAttribute("style", "background-color:" + btnWidgetBackgroundColor + ";border-color:" + btnWidgetBackgroundColor + ";color:" + btnWidgetFontColor + ";float:right");
                            } else if (elButtonPrimary[i].textContent === _this.approvalTitle) {
                                elButtonPrimary[i].setAttribute("style", "background-color:" + btnWidgetBackgroundColor + ";border-color:" + btnWidgetBackgroundColor + ";color:" + btnWidgetFontColor);
                            }
                        }
                    }
                }, 100);
            },
            // 待办,我发起的,我审批的列表数据查询
            listTask(flag) {
                let _this = this;
                _this.taskData = [];
                if (_this.KHUtils.isNull(flag) && !_this.KHUtils.isNull(_this.currentTaskFlag)) {
                    flag = _this.currentTaskFlag;
                } else {
                    _this.currentTaskFlag = flag;
                }
                let url = "";
                let param = {};
                switch (flag) {
                    case "toDo":
                        _this.toDotaskVisible = true;
                        url = _this.khConfig.api.toDoTaskList;      // 待办
                        param = _this.queryTaskToDoParam;
                        break;
                    case "done":
                        _this.doneTaskVisible = true;
                        param = _this.queryTaskBeDoneParam;
                        url = _this.khConfig.api.doneTaskList;     // 我审批的
                        break;
                    case "launched":
                        _this.launchedTaskVisible = true;
                        param = _this.queryTaskLaunchedParam;
                        url = _this.khConfig.api.startProcessList;  // 我发起的
                        break;
                    default:
                }
                _this.taskLoading = true;
                _this.$Get(url, param).then(res => {
                    if (res.errCode === 0) {
                        if ("toDo" === flag) {
                            _this.taskData = res.taskVos;
                        } else {
                            _this.taskData = res.processVos;
                        }
                        _this.totalPage = res.totalCount;
                    }
                    _this.taskLoading = false;
                });
            },
            // 格式化任务开始时间,完成时间
            formatTaskTime(row, column) {
                let key = column.property;
                if (key.indexOf('taskCreateTime') > -1 || key.indexOf('createTime') > -1
                    || key.indexOf('endTime') > -1 || key.indexOf('readTime') > -1 || key.indexOf('startTime') > -1) {
                    let val = row[key];
                    if (val != null && val !== '' && val.indexOf(".") > -1) {
                        return val.split('.')[0];
                    }
                } else {
                    return row[key];
                }
            },
            // 查询待办任务数量
            queryTaskToDoNum() {
                this.$Get(this.khConfig.api.taskToDo).then(res => {
                    if (res.errCode === 0) {
                        this.taskToDoNum = 0;
                        if (!this.KHUtils.isNull(res.totalCount)) {
                            this.taskToDoNum = res.totalCount;
                        }
                    }
                });
            },
            // 待办任务列表分页查询
            handleTaskToDoCurrentChange(val) {
                this.queryTaskToDoParam.pageNum = val;
                this.listTask("");
            },
            // 我发起的分页查询
            handleTaskLaunchedCurrentChange(val) {
                this.queryTaskLaunchedParam.pageNum = val;
                this.listTask("");
            },
            // 我审批的分页查询
            handleTaskBeDoneCurrentChange(val) {
                this.queryTaskBeDoneParam.pageNum = val;
                this.listTask("");
            },
            // 打开发起审批填写页面
            showApproval(row) {
                if (row.flag === 1) {
                    this.$notify.error({
                        title: '错误',
                        message: "表单已停用,请联系管理员"
                    });
                    return false;
                }
                this.approvalTitle = row.formName;
                this.formConfig = JSON.parse(row.formMeta);
                if (this.KHUtils.isNull(this.formConfig)) {
                    this.$notify.warning({
                        title: '警告',
                        message: "表单ID(" + row.formId + "): 暂未进行相关的表单设计"
                    });
                    return false;
                }
                this.tableFormConfig = [];
                for (let i = 0, n = this.formConfig.list.length; i < n; i++) {
                    let obj = this.formConfig.list[i];
                    if ("table" === obj.type) {
                        obj.tableData = [];
                        this.tableFormConfig.push(obj);      // 子表单独立组件显示
                    }
                }

                this.approvalInitiateVisible = true;
                this.launchedHackReset = false;
                this.dataModels = row;
                this.initAddEditFormStyle("initiate");
                // 重新渲染子组件
                this.$nextTick(() => {
                    this.launchedHackReset = true
                });
            },
            // 发起审批
            initiateApproval() {
                let _this = this;
                _this.$refs.buildForm.getData().then(data => {
                    _this.$confirm('确认发起审批吗？', '提示', {}).then(() => {
                        let param = {parent: {}, child: []}; // 提交参数
                        _this.approvalInitiateLoading = true;
                        _this.KHForm.formatDynCols(data, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.processFormConfig(_this.formConfig));
                        // 父参数的处理
                        param.parent = data;
                        // 如果含有子表单
                        if (_this.tableFormConfig instanceof Array && _this.tableFormConfig.length > 0) {
                            _this.tableFormConfig.forEach(t => {
                                let allCols = [];
                                if (t.tableColumns && t.tableColumns.length > 0) {
                                    t.tableColumns.forEach(obj => {
                                        allCols.push(obj);
                                    })
                                }
                                let subChild = {};
                                subChild.subKey = t.key;
                                subChild.subDatas = [];
                                if (t.tableData instanceof Array && t.tableData.length > 0) {
                                    t.tableData.forEach(td => {
                                        _this.KHForm.formatDynCols(td, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, allCols);
                                        //过滤为null的数据
                                        let newObj = {};
                                        Object.keys(td).forEach(function (key) {
                                            if(td[key] != null){
                                                newObj[key] = td[key];
                                            }
                                        });
                                        subChild.subDatas.push(newObj);
                                    })
                                    param.child.push(subChild);
                                }
                            })
                        }
                        _this.$PostJson(_this.khConfig.api.startFormFlow + "/" + _this.dataModels.formId, param).then(res => {
                            _this.approvalInitiateLoading = false;
                            _this.approvalInitiateVisible = false;
                            if (res.errCode === 0) {
                                _this.$notify({
                                    title: '成功',
                                    message: '发起审批成功',
                                    type: 'success'
                                });
                                _this.queryTaskToDoNum();
                            }
                        })
                    })
                }).catch((e) => {
                    console.log(e);
                })
            },
            // 发起审批列表点击行查看
            beforeApprovalLaunched(row) {
                this.processApprove(row, 'launched');
            },
            // 待办审批列表点击行查看
            beforeApprovalToDo(row) {
                this.processApprove(row, 'toDo');
            },
            // 我审批的列表点击行查看
            beforeApprovalDone(row) {
                this.processApprove(row, 'done');
            },
            // 消息列表点击行查看
            beforeApproveMsg(row) {
                this.processApprove(row, 'msg');
            },
            // 审批记录查看前的处理
            processApprove(row, flag) {
                if (flag === 'msg') {
                    // 消息列表入口,查看审批
                    if (!this.KHUtils.isNull(row.bigType) && !this.KHUtils.isNull(row.smallType)) {
                        // 大类 1 流程消息;小类 1  流程抄送消息
                        this.bigType = row.bigType;
                        this.smallType = row.smallType;
                        row = this.KHUtils.isNull(row.params) ? {} : JSON.parse(row.params);
                    }
                }
                this.currentProcess = row;
                // 标识审批是否已经通过的状态
                this.approvalPass = row.approveStatus === '1';
                // 当前状态
                this.approveStatus = row.approveStatus;
                if (this.KHUtils.isNull(row.processInstanceId)) {
                    this.$notify.error({
                        title: '错误',
                        message: '流程实例ID为空'
                    });
                    return false;
                }
                if (this.KHUtils.isNull(row.processInstanceId)) {
                    this.$notify.error({
                        title: '错误',
                        message: '流程定义ID为空'
                    });
                    return false;
                }
                switch (flag) {
                    case 'launched':
                        this.approvalLaunchedVisible = true;
                        break;
                    case 'toDo':
                        this.approvalToDoVisible = true;
                        break;
                    case 'done':
                        this.approvalDoneVisible = true;
                        break;
                    case 'msg':
                        this.approvalMsgVisible = true;
                        break;
                    default:
                }
                this.initAddEditFormStyle(flag);
                this.approvalParam = {};
                // 查询表单配置信息
                this.$Get(this.khConfig.api.getFlowConfByPdId, {processDefinitionId: row.processDefinitionId}).then(res => {
                    if (res.errCode === 0) {
                        if (!res.formConf) {
                            console.log("processDefinitionId 流程定义不存在:" + row.processDefinitionId)
                            return false;
                        }
                        if (!this.KHUtils.isNull(res.formConf.formMeta)) {
                            this.approvalTitle = res.formConf.formName;
                            this.formConfig = JSON.parse(res.formConf.formMeta);
                            this.tableFormConfig = [];
                            for (let i = 0, n = this.formConfig.list.length; i < n; i++) {
                                let obj = this.formConfig.list[i];
                                if ("table" === obj.type) {
                                    obj.tableData = [];
                                    this.tableFormConfig.push(obj);      // 子表单独立组件显示
                                }
                            }
                            //console.log("tableFormConfig :" + JSON.stringify(this.tableFormConfig));
                            this.formId = res.formConf.formId;
                            this.timeLineList = [];
                            // 查询表单业务数据
                            this.$Get(this.khConfig.api.queryFormDataByPid, {processInstanceId: row.processInstanceId}).then(res => {
                                if (!this.KHUtils.isNull(res.data)) {
                                    let tempRow = this.KHUtils.clone(res.data);
                                    if (this.tableFormConfig.length > 0) {
                                        this.parentFormId = this.formId;
                                        this.parentBusinessId = res.data.id;
                                    }
                                    this.KHForm.ReversalDynCols(tempRow, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.processFormConfig(this.formConfig));
                                    // 审批记录发起人处理
                                    let newObj = {};
                                    let tempTm = "";
                                    newObj.remark = res.data.realName;
                                    if (!this.KHUtils.isNull(res.data.createTime)) {
                                        let t = res.data.createTime;
                                        tempTm = t.substring(5, 7) + "." + t.substring(8, 10) + "  " + t.substring(11, 16);
                                    }
                                    newObj.icon = "el-icon-position";
                                    newObj.type = "primary";
                                    newObj.content = "发起审批";
                                    newObj.content = newObj.content + '<p style="color:#909399;font-size: 10px;position: relative;top: -25px;left: 108px">' + tempTm + '</p>';
                                    newObj.tempFormConfig = {list: [], config: {}};
                                    newObj.tempDataModel = {};
                                    newObj.tempHackSet = false;
                                    this.timeLineList.push(newObj);
                                    // 提交审批时使用
                                    this.approvalParam.businessId = res.data.id;
                                    this.approvalParam.taskId = row.taskId;
                                    this.dataModels = tempRow;
                                    switch (flag) {
                                        case 'launched':
                                            this.approvalLaunchedHackReset = false;
                                            // 重新渲染子组件
                                            this.$nextTick(() => {
                                                this.approvalLaunchedHackReset = true;
                                            });
                                            break;
                                        case 'toDo':
                                            this.approvalToDoHackReset = false;
                                            // 重新渲染子组件
                                            this.$nextTick(() => {
                                                this.approvalToDoHackReset = true;
                                            });
                                            break;
                                        case 'done':
                                            this.approvalDoneHackReset = false;
                                            // 重新渲染子组件
                                            this.$nextTick(() => {
                                                this.approvalDoneHackReset = true;
                                            });
                                            break;
                                        case 'msg':
                                            this.approvalMsgHackReset = false;
                                            // 重新渲染子组件
                                            this.$nextTick(() => {
                                                this.approvalMsgHackReset = true;
                                            });
                                            break;
                                        default:
                                    }
                                    // 查询流程审批记录
                                    this.$Get(this.khConfig.api.queryApproveDetails + "/" + row.processInstanceId).then(res => {
                                        let flowTableConf = {};   // 审批填报项的配置信息
                                        if (!this.KHUtils.isNull(this.formConfig)) {
                                            if (this.formConfig.list) {
                                                this.formConfig.list.forEach(fc => {
                                                    if (fc.type === 'flow_table') {
                                                        flowTableConf = this.KHUtils.clone(fc);
                                                    }
                                                })
                                            }
                                        }
                                        // 已审批完的流程信息
                                        if (!this.KHUtils.isNull(res.list)) {
                                            for (let i = 0, n = res.list.length; i < n; i++) {
                                                let obj = res.list[i];
                                                // 时间格式化
                                                if (this.KHUtils.isNull(obj.approveTime)) {
                                                    continue;
                                                }
                                                let newObj = {};
                                                let tempTm = "";
                                                // 2019-10-14 15:49:09.328
                                                let t = obj.approveTime;
                                                tempTm = t.substring(5, 7) + "." + t.substring(8, 10) + "  " + t.substring(11, 16);
                                                if ("fill" === obj.type) {
                                                    // 用户填单
                                                    newObj.icon = "el-icon-edit-outline";
                                                    newObj.type = "primary";
                                                    newObj.content = "用户填单";
                                                    if (!this.KHUtils.isNull(obj.realName)) {
                                                        newObj.remark = obj.realName;
                                                    } else {
                                                        newObj.remark = obj.userName;
                                                    }
                                                } else if ("comment" === obj.type) {
                                                    // status: 0 同意;1 不同意;2 驳回
                                                    if (!this.KHUtils.isNull(obj.status)) {
                                                        switch (obj.status) {
                                                            case 0:
                                                                newObj.icon = "el-icon-finished";
                                                                newObj.type = "success";
                                                                newObj.content = "(已同意)";
                                                                newObj.remark = obj.remark;
                                                                break;
                                                            case 1:
                                                                newObj.icon = "el-icon-close";
                                                                newObj.type = "danger";
                                                                newObj.content = "(不同意)";
                                                                newObj.remark = obj.remark;
                                                                break;
                                                            case 2:
                                                                newObj.content = "(已驳回)";
                                                                newObj.remark = obj.remark;
                                                                break;
                                                            default:
                                                                newObj.content = "";
                                                        }
                                                    }
                                                }
                                                newObj.content = obj.realName + newObj.content + '<p style="color:#909399;font-size: 10px;position: relative;top: -25px;left: 108px">' + tempTm + '</p>';
                                                // 已填写的审批项处理
                                                newObj.tempFormConfig = {list: [], config: {}};
                                                newObj.tempDataModel = {};
                                                newObj.tempHackSet = false;
                                                if (obj.approveItems) {
                                                    if (!this.KHUtils.isNull(flowTableConf)) {
                                                        obj.approveItems.forEach(ai => {
                                                            if (flowTableConf.tableColumns && flowTableConf.tableColumns.length > 0) {
                                                                flowTableConf.tableColumns.forEach(tc => {
                                                                    if (ai.itemModel === tc.model) {
                                                                        let cloneTc = this.KHUtils.clone(tc);
                                                                        newObj.tempFormConfig.list.push(cloneTc);
                                                                        if(ai.itemValue instanceof Object){
                                                                            let itemValue = ai.itemValue;
                                                                            if(cloneTc.type == "gis_select"){
                                                                                newObj.tempDataModel[cloneTc.modelExt.lat] = itemValue.latValue;
                                                                                newObj.tempDataModel[cloneTc.modelExt.lnt] = itemValue.lntValue;
                                                                                newObj.tempDataModel[cloneTc.modelExt.address] = itemValue.addressValue;
                                                                            }else if(cloneTc.type == "region_select"){
                                                                                newObj.tempDataModel[cloneTc.modelExt.provinceCode] = itemValue.provinceCodeValue;
                                                                                newObj.tempDataModel[cloneTc.modelExt.cityCode] = itemValue.cityCodeValue;
                                                                                newObj.tempDataModel[cloneTc.modelExt.areaCode] = itemValue.areaCodeValue;
                                                                            }else {
                                                                                newObj.tempDataModel[cloneTc.model] = itemValue.modelValue;
                                                                                newObj.tempDataModel[cloneTc.label_model] = itemValue.labelValue;
                                                                            }
                                                                        }else {
                                                                            newObj.tempDataModel[ai.itemModel] = ai.itemValue;
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        })
                                                        newObj.tempFormConfig.config = this.formConfig.config;
                                                        this.KHForm.ReversalDynCols(newObj.tempDataModel, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.processFormConfig(newObj.tempFormConfig));
                                                    }
                                                }
                                                this.timeLineList.push(newObj);
                                            }
                                            this.timeLineList.forEach(tl => {
                                                if (tl.tempFormConfig.list.length > 0) {
                                                    tl.tempHackSet = false;
                                                    this.$nextTick(() => {
                                                        tl.tempHackSet = true;
                                                    });
                                                }
                                            })
                                        }
                                        // 催办消息是否是当前用户审批任务的处理
                                        if (!this.KHUtils.isNull(res.approveStatus)) {
                                            // 标识审批是否已经通过的状态
                                            this.approvalPass = res.approveStatus === '1';
                                            // 当前状态
                                            this.approveStatus = res.approveStatus;
                                        }
                                        if (!this.KHUtils.isNull(res.currentTaskId)) {
                                            this.currentUserApproval = this.approvalParam.taskId === res.currentTaskId;
                                            // 查询当前最新的taskId
                                            this.approvalParam.taskId = res.currentTaskId;
                                        } else {
                                            this.currentUserApproval = true;
                                        }
                                        // 待审批完的流程信息
                                        if (!this.KHUtils.isNull(res.waitList)) {
                                            if (res.waitList.length > 0) {
                                                // 动态审批填报项处理,默认第一个为当前审批人的审批填报项处理
                                                if (this.currentUserApproval) {
                                                    let firstWaitObj = res.waitList[0];
                                                    if (firstWaitObj.approveItems) {
                                                        this.currentApprovalFormConfig = {list: [], config: {}};
                                                        if (!this.KHUtils.isNull(flowTableConf)) {
                                                            firstWaitObj.approveItems.forEach(ai => {
                                                                if (flowTableConf.tableColumns && flowTableConf.tableColumns.length > 0) {
                                                                    flowTableConf.tableColumns.forEach(tc => {
                                                                        if (ai.itemModel === tc.model) {
                                                                            this.currentApprovalFormConfig.list.push(tc);
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                            this.currentApprovalFormConfig.config = this.formConfig.config;
                                                        }
                                                    }
                                                }
                                                if (flag === 'msg') {
                                                    this.currentApprovalFormConfigMsg = this.KHUtils.clone(this.currentApprovalFormConfig);
                                                    if (this.currentApprovalFormConfigMsg.list.length > 0) {
                                                        this.currentApprovalHackResetMsg = false;
                                                        this.$nextTick(() => {
                                                            this.currentApprovalHackResetMsg = true;
                                                        });
                                                    }
                                                } else if (flag === 'toDo') {
                                                    if (this.currentApprovalFormConfig.list.length > 0) {
                                                        this.currentApprovalHackReset = false;
                                                        this.$nextTick(() => {
                                                            this.currentApprovalHackReset = true;
                                                        });
                                                    }
                                                }
                                                for (let i = 0, n = res.waitList.length; i < n; i++) {
                                                    let obj = res.waitList[i];
                                                    let newObj = {};
                                                    if (0 === obj.taskType) {
                                                        // 用户任务
                                                        newObj.icon = "el-icon-chat-line-square";
                                                        newObj.type = "warning";
                                                        newObj.content = "待审批";
                                                        // 审批类型：0 普通审批；1 会签；2 或签；3 依次审批
                                                        let approveType = obj.approveType;
                                                        if(approveType===1){
                                                            newObj.content = newObj.content + "&nbsp; <span style=\"font-size:10px;background-color: #e7faf0;border-color: #d0f5e0;color: #13ce66;\">&nbsp;会签（须所有审批人同意）&nbsp;</span>";
                                                        }else if(approveType===2){
                                                            newObj.content = newObj.content + "&nbsp; <span style=\"font-size:10px;background-color: #e7faf0;border-color: #d0f5e0;color: #13ce66;\">&nbsp;或签（一名审批人同意或不同意即可）&nbsp;</span>";
                                                        }else if(approveType===3){
                                                            newObj.content = newObj.content + "&nbsp; <span style=\"font-size:10px;background-color: #e7faf0;border-color: #d0f5e0;color: #13ce66;\">&nbsp;依次审批&nbsp;</span>";
                                                        }
                                                    } else if (1 === obj.taskType) {
                                                        // 抄送任务
                                                        newObj.icon = "el-icon-bell";
                                                        newObj.type = "warning";
                                                        newObj.content = "待抄送";
                                                    }
                                                    newObj.content = newObj.content + '<p style="color:#909399;font-size: 10px;position: relative;top: -25px;left: 108px">&nbsp;&nbsp;</p>';
                                                    if (!this.KHUtils.isNull(obj.userList)) {
                                                        let remark = "";
                                                        obj.userList.forEach(user => {
                                                            remark += user.realName + "  ";
                                                        });
                                                        newObj.remark = remark;
                                                    }
                                                    this.timeLineList.push(newObj);
                                                }
                                            }
                                        }
                                        // 审批通过计算审批耗时
                                        if (this.approveStatus === '1') {
                                            if (this.KHUtils.isNull(row.endTime)) {
                                                row.endTime = res.list[res.list.length - 1].approveTime;
                                            }
                                            this.calApprovalCost(row.endTime, row.startTime)
                                        }
                                    });
                                } else {
                                    this.$notify.error({
                                        title: '错误',
                                        message: '流程实例不存在'
                                    });
                                }
                            });
                        } else {
                            this.$notify.error({
                                title: '错误',
                                message: '表单配置不存在'
                            });
                        }
                    }
                });
            },
            // 审批耗时计算
            calApprovalCost(endTime, startTime) {
                // 计算耗时
                if (this.KHUtils.isNull(endTime)) {
                    return false;
                }
                let ms = new Date(endTime).getTime() - new Date(startTime).getTime();
                if (ms > 0) {
                    // 计算出相差天数
                    let days = Math.floor(ms / (24 * 3600 * 1000));
                    // 计算出小时数
                    let lv1 = ms % (24 * 3600 * 1000);   // 计算天数后剩余的毫秒数
                    let hours = Math.floor(lv1 / (3600 * 1000));
                    // 计算相差分钟数
                    let lv2 = lv1 % (3600 * 1000);       // 计算小时数后剩余的毫秒数
                    let minutes = Math.floor(lv2 / (60 * 1000));
                    // 计算相差秒数
                    let lv3 = lv2 % (60 * 1000);         // 计算分钟数后剩余的毫秒数
                    let seconds = Math.round(lv3 / 1000);
                    this.approvalTimeCost = "共耗时 " + days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒";
                }
            },
            // 催办
            remindProcess() {
                this.$confirm('确认催办吗？', '提示', {}).then(() => {
                    this.remindLoading = true;
                    this.$Get(this.khConfig.api.processRemind + "/" + this.currentProcess.processInstanceId)
                        .then(res => {
                            if (res.errCode === 0) {
                                this.$notify({
                                    title: '成功',
                                    message: '催办成功',
                                    type: 'success'
                                });
                            }
                            this.remindLoading = false;
                            this.approvalLaunchedVisible = false;
                        })
                }).catch((e) => {
                    console.log(e)
                    this.remindLoading = false;
                });
            },
            // 撤销
            cancelProcess() {
                this.$confirm('确认撤销当前申请吗？', '提示', {}).then(() => {
                    this.cancelLoading = true;
                    this.$Get(this.khConfig.api.processCancel + "/" + this.currentProcess.processInstanceId)
                        .then(res => {
                            if (res.errCode === 0) {
                                this.$notify({
                                    title: '成功',
                                    message: '撤销成功',
                                    type: 'success'
                                });
                            }
                            this.cancelLoading = false;
                            this.approvalLaunchedVisible = false;
                        })
                }).catch((e) => {
                    console.log(e)
                    this.cancelLoading = false;
                    this.approvalLaunchedVisible = false;
                });
            },
            // 审批同意
            agreeApproval(flag) {
                if (flag === 'msg') {
                    this.$refs.currentApprovalBuildFormMsg.getData().then(data => {
                        this.$confirm('确认同意吗？', '提示', {}).then(() => {
                            this.KHForm.formatDynCols(data, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.processFormConfig(this.currentApprovalFormConfig));
                            this.agreeLoading = true;
                            data.taskId = this.approvalParam.taskId;
                            data.businessId = this.approvalParam.businessId;
                            data.formId = this.formId;
                            let paramArray = [];
                            Object.keys(data).forEach(function (key) {
                                if(data[key] != null && data[key]){
                                    paramArray.push(key + "=" + data[key]);
                                }
                            });
                            paramArray = paramArray.join("&");
                            this.$Post(this.khConfig.api.approveTask + "/" + this.approvalParam.taskId, paramArray).then(res => {
                                this.agreeLoading = false;
                                if (res.errCode === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '审批成功',
                                        type: 'success'
                                    });
                                    this.queryUnReadMsgNum();
                                    this.queryTaskToDoNum();
                                    this.listSelfMsg(0);
                                    this.approvalMsgVisible = false;
                                }
                                this.disagreeLoading = false;
                            });
                        }).catch((e) => {
                            console.log(e);
                            // this.approvalToDoVisible = false;
                            // this.approvalMsgVisible = false;
                            this.disagreeLoading = false;
                        });
                    }).catch((e) => {
                        console.log(e)
                    })
                } else {
                    this.$refs.currentApprovalBuildForm.getData().then(data => {
                        this.$confirm('确认同意吗？', '提示', {}).then(() => {
                            this.KHForm.formatDynCols(data, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.processFormConfig(this.currentApprovalFormConfig));
                            this.agreeLoading = true;
                            data.taskId = this.approvalParam.taskId;
                            data.businessId = this.approvalParam.businessId;
                            data.formId = this.formId;
                            let paramArray = [];
                            Object.keys(data).forEach(function (key) {
                                if(data[key] != null && data[key]){
                                    paramArray.push(key + "=" + data[key]);
                                }
                            });
                            paramArray = paramArray.join("&");
                            this.$Post(this.khConfig.api.approveTask + "/" + this.approvalParam.taskId, paramArray).then(res => {
                                this.agreeLoading = false;
                                if (res.errCode === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '审批成功',
                                        type: 'success'
                                    });
                                    this.queryTaskToDoNum();
                                    this.listTask('toDo');
                                    this.approvalToDoVisible = false;
                                }
                                this.disagreeLoading = false;
                            });
                        }).catch((e) => {
                            console.log(e);
                            this.disagreeLoading = false;
                        });
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            },
            // 审批不同意
            disagreeApproval(flag) {
                if (flag === 'msg') {
                    this.$refs.currentApprovalBuildFormMsg.getData().then(data => {
                        this.$confirm('确认不同意吗？', '提示', {}).then(() => {
                            this.KHForm.formatDynCols(data, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.processFormConfig(this.currentApprovalFormConfig));
                            data.taskId = this.approvalParam.taskId;
                            data.businessId = this.approvalParam.businessId;
                            data.formId = this.formId;
                            this.disagreeLoading = true;
                            let paramArray = [];
                            Object.keys(data).forEach(function (key) {
                                if(data[key] != null && data[key]){
                                    paramArray.push(key + "=" + data[key]);
                                }
                            });
                            paramArray = paramArray.join("&");
                            this.$Post(this.khConfig.api.disapproveTask + "/" + this.approvalParam.taskId, paramArray).then(res => {
                                if (res.errCode === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '审批成功',
                                        type: 'success'
                                    });
                                    this.queryUnReadMsgNum();
                                    this.queryTaskToDoNum();
                                    this.listSelfMsg(0);
                                    this.approvalMsgVisible = false;
                                }
                                this.disagreeLoading = false;
                            });
                        }).catch((e) => {
                            console.log(e);
                            this.disagreeLoading = false;
                        });
                    }).catch((e) => {
                        console.log(e)
                    })
                } else {
                    this.$refs.currentApprovalBuildForm.getData().then(data => {
                        this.$confirm('确认不同意吗？', '提示', {}).then(() => {
                            this.KHForm.formatDynCols(data, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.processFormConfig(this.currentApprovalFormConfig));
                            data.taskId = this.approvalParam.taskId;
                            data.businessId = this.approvalParam.businessId;
                            data.formId = this.formId;
                            this.disagreeLoading = true;
                            let paramArray = [];
                            Object.keys(data).forEach(function (key) {
                                if(data[key] != null && data[key]){
                                    paramArray.push(key + "=" + data[key]);
                                }
                            });
                            paramArray = paramArray.join("&");
                            this.$Post(this.khConfig.api.disapproveTask + "/" + this.approvalParam.taskId, paramArray).then(res => {
                                if (res.errCode === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '审批成功',
                                        type: 'success'
                                    });
                                    this.listTask('toDo');
                                    this.approvalToDoVisible = false;
                                }
                                this.disagreeLoading = false;
                            });
                        }).catch((e) => {
                            console.log(e);
                            this.disagreeLoading = false;
                        });
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            },
            // 查询未读消息的数量
            queryUnReadMsgNum() {
                let param = {
                    bigType:1
                }
                this.$Get(this.khConfig.api.unReadMsgCount,param).then(res => {
                    if (res.errCode === 0) {
                        this.unReadMsgCount = 0;
                        if (!this.KHUtils.isNull(res.totalCount)) {
                            this.unReadMsgCount = res.totalCount;
                        }
                    }
                });
            },
            // 查询未读消息/抄送我的
            listSelfMsg(status) {
                this.msgTitle = status === 0 ? "未读消息" : "抄送我的";
                this.msgVisible = true;
                this.msgLoading = true;
                // 0 未读;1已读
                this.msgParam.statusList = status;
                this.msgParam.bigType = 1;
                this.msgTableData = [];
                this.$Get(this.khConfig.api.listSelfMsg, this.msgParam).then(res => {
                    if (res.msgs != null) {
                        this.msgTableData = res.msgs;
                        this.msgTotalCount = res.totalCount;
                        // 如果查询未读状态的列表,默认更新当前页的消息为已读状态
                        if (0 === status) {
                            if (res.msgs.length > 0) {
                                let paramArray = [];
                                res.msgs.forEach(obj => {
                                    if (!this.KHUtils.isInvalidValue(obj.msgId)) {
                                        paramArray.push("idList=" + obj.msgId);
                                    }
                                });
                                paramArray = paramArray.join("&");
                                this.$Post(this.khConfig.api.updateMsgStatus, paramArray).then(res => {
                                    if (res.errCode === 0) {
                                        this.queryUnReadMsgNum();
                                    }
                                });
                            }
                        }
                    } else {
                        this.msgTableData = [];
                    }
                    this.msgLoading = false;
                });
            },
            // 消息分页查询
            handleMsgCurrentChange(val) {
                this.msgParam.pageNum = val;
                this.listSelfMsg(this.msgParam.statusList);
            },
            // 表单配置处理
            processFormConfig(formConfig) {
                let tempDynCols = [];
                if (formConfig.list) {
                    for (let i = 0, n = formConfig.list.length; i < n; i++) {
                        let obj = formConfig.list[i];
                        if ("grid" === obj.type) {
                            loopAll(obj, tempDynCols, this);

                            function loopAll(obj, arr, _this) {
                                let columns = obj.columns;
                                for (let j = 0, m = columns.length; j < m; j++) {
                                    let colObj = columns[j];
                                    colObj.list.forEach(lsObj => {
                                        arr.push(lsObj);
                                        if ("grid" === lsObj.type) {
                                            loop(obj, _this);
                                        }
                                    })
                                }
                            }
                        } else {
                            tempDynCols.push(obj);
                        }
                    }
                }
                return tempDynCols;
            }
        }
    }
</script>
<style lang="scss" scoped>
  @import "@/assets/style/form-global.scss";
    .header {
        display: flex;
        flex-flow: row nowrap;
        padding-left: 10px;

        .header-title {
            font-weight: bolder;
            color: #3A3B3F;
            position: relative;
            margin-right: auto;
            margin-top: 5px;
            margin-bottom: 18px;
            &::before {
                content: '';
                display: block;
                height: 17px;
                border-right: 3px solid #3581FB;
                position: absolute;
                left: -10px;
            }
        }
    }
    .process-manage ::v-deep .custom-dialog {
        height: 80%;

        .el-dialog__body {
            height: calc(100% - 54px);
            padding: 10px 10px;
            /*            overflow: auto;*/

            .custom-box {
                height: calc(100% - 46px);
                /*overflow: hidden;*/
            }
        }

        .el-dialog__footer {
            border-top: 1px solid #eee;
            background-color: #fff;
        }
    }
</style>

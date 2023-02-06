<template>
    <div style="width: 100%;margin: 0 auto; ">
        <el-row style="padding-left: 10px;padding-right: 0">
            <el-row :gutter="20"
                    style="margin-right: 0;border-bottom: 1px solid #CCC;border-left:1px solid #CCC;border-right: 1px solid #CCC;">
                <el-col :span="12" style="padding: 0;">
                    <h3 style="background:#EFEFEF;padding:5px 0;">
                        <p style="padding-left:5px">数据同步</p>
                    </h3>
                    <div style="width:60%;height: 600px;">
                        <el-tree
                            :data="sysData"
                            :props="sysProps"
                            node-key="id"
                            accordion
                            highlight-current
                            default-expand-all
                            @node-click="switchSys"
                            v-loading="dataSynLoading"
                            :expand-on-click-node="false">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="12" style="padding: 0;">
                    <div style="height: 655px;border-left:4px solid #DDDDDD;">
                        <h3 style="padding:5px 0;background:#EFEFEF">
                            <p style="padding-left:5px">{{currentSys.sysName}}&nbsp;&nbsp;</p>
                        </h3>
                        <div style="overflow: auto;">
                            <el-tree
                                :data="interData"
                                show-checkbox
                                node-key="id"
                                ref="tree"
                                :default-checked-keys="checkedArray"
                                :props="interProps"
                                default-expand-all
                                highlight-current
                                accordion
                                style="width:60%;height: 585px;"
                                :expand-on-click-node="false"
                                check-strictly
                                v-loading="dataSynLoading"
                            >
                            </el-tree>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row style="text-align: center;margin-top:40px">
                <el-button @click="saveSysRelInter" type="primary" :loading="saveLoading">保存</el-button>
                <el-button>取消</el-button>
            </el-row>
        </el-row>
    </div>
</template>

<script type="es6">
    export default {
        data() {
            return {
                dataSynLoading: false,
                saveLoading: false,
                currentSys: {
                    sysName: '',
                    id: ''
                },
                sysData: [],
                interData: [],
                sysProps: {
                    label: 'sysName',
                    children: 'children'
                },
                interProps: {
                    label: 'interName',
                    children: 'children'
                },
                checkedArray: []
            }
        },
        mounted() {
            let _this = this;
            _this.listSys()
        },
        methods: {
            // 查询开启需要数据同步的子系统
            listSys() {
                let _this = this;
                // 查询已开启需要单点登录的子系统信息
                _this.$Get(_this.khConfig.api.listSys, {syn: '0'}).then(res => {
                    if (res.list != null && res.list.length > 0) {
                        _this.sysData = res.list;
                        if (_this.KHUtils.isNull(_this.currentSys.id)) {
                            _this.currentSys = res.list[0];
                        }
                    }
                    // 查询子系统所拥有的数据同步接口权限
                    _this.listInterBySysId();
                });
            },
            // 根据子系统ID查询接口权限
            listInterBySysId() {
                let _this = this;
                let param = {
                    sysId: _this.currentSys.id
                };
                _this.dataSynLoading = true;
                _this.$Get(_this.khConfig.api.listInter, param)
                    .then(res => {
                        _this.interData = res.list;
                        _this.checkedArray = [];
                        if (res.sysRelInterList != null && res.sysRelInterList.length > 0) {
                            for (let item of res.sysRelInterList) {
                                _this.checkedArray.push(item.interId);
                            }
                        }
                        _this.dataSynLoading = false;
                    })
            },
            // 切换不同角色组查询功能权限
            switchSys(data, node, self) {
                let _this = this;
                _this.currentSys = data;
                _this.listSys();
            },
            // 保存角色与菜单的关联关系
            saveSysRelInter() {
                let _this = this;
                let checkedId = "";
                for (let item of _this.$refs.tree.getCheckedKeys()) {
                    checkedId += item.toString() + ",";
                }
                _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                    _this.saveLoading = true;
                    let param = {
                        sysId: _this.currentSys.id
                    };
                    if (checkedId != null && checkedId !== '') {
                        param.interIds = checkedId;
                    }
                    _this.$Get(_this.khConfig.api.addSysRelInter, param).then(res => {
                        if (res.errCode === 0) {
                            _this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            _this.listSys();
                        }
                        _this.saveLoading = false;
                    })
                }).catch((e) => {
                    console.log(e)
                });
            }
        }
    }
</script>
<style scoped>
    h3 {
        margin: 0;
    }
    
    h3 p {
        display: inline-block;
        margin: 0;
        padding: 0;
    }
</style>

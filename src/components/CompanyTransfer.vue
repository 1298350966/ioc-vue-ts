<template>
    <div>
        <div class="block">
            <el-transfer
                filterable
                :titles="['请选择', '已选择']"
                :filter-method="filterCompanyName"
                :props="{ key: 'id',  label: 'companyName'}"
                filter-placeholder="请输入企业名称"
                v-model="targetOptions"
                :data="companyOptions"
                class="transfer-container">
            </el-transfer>
            <div slot="footer" class="dialog-footer" style="position: relative;left: 48%;padding:20px">
                <el-button type="primary" @click.native="saveCompanyPermission">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                companyOptions: [],
                targetOptions: [],
            }
        },
        props:{
            selectCompany: {
                type: Array,
                default: [],
            },
        },
        created(){
            this.initCompany();
        },
        methods:{
            initCompany(){
                let _this = this;
                // 查询已审核的企业
                _this.companyOptions = [];
                _this.$Get(this.khConfig.api.queryAllCheckCompanyInfo, {pageSize: 100000000, pageNum: 1}).then(res => {
                    if (res.errCode === 0) {
                        // 初始化企业选择的数据源
                        if (res.datas) {
                            if (!_this.KHUtils.isNull(res.datas)) {
                                _this.companyOptions = res.datas;
                            }
                        }
                        // 初始化已选择的企业
                        _this.targetOptions = [];
                        if (_this.selectCompany.length > 0) {
                            _this.selectCompany.forEach(obj => {
                                _this.targetOptions.push(parseInt(obj.id));
                            })
                        }
                    }
                });
            },
            saveCompanyPermission(){
                let _this = this;
                let companys = [];
                if (_this.companyOptions.length > 0) {
                    _this.companyOptions.forEach(rs => {
                        let flag = false;
                        _this.targetOptions.forEach(id => {
                            if (id === rs.id) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            let newObj = {};
                            newObj.id = parseInt(rs.id);
                            newObj.name = rs.companyName;
                            newObj.type = 9;
                            companys.push(newObj);
                        }
                    });
                }
                _this.$emit('getSelectCompany',companys);
            },
            // 搜索企业
            filterCompanyName(query, item) {
                return item.companyName.indexOf(query) > -1;
            },
        }
    }
</script>

<style lang="scss" scoped>
.transfer-container.el-transfer{
    display: flex;
    justify-content: center;
    align-items: center;

    :deep(.el-transfer-panel){
        width:35%;
        height: 460px;

        .el-transfer-panel__body{
            height: calc(100% - 60px);
            
            .el-transfer-panel__list.is-filterable{
                height: calc(100% - 32px);
            }
        }
    }
}
</style>

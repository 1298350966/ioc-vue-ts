<template>
    <div>
        <el-form ref="buildForm"
                 label-suffix=":"
                 :size="this.KHUtils.isNull(data) ? 'small' : data.config.size"
                 :model="models"
                 :label-position="this.KHUtils.isNull(data) ?'right' :data.config.labelPosition"
                 :label-width="this.KHUtils.isNull(data) ? '100px' :data.config.labelWidth + 'px'">
            <template v-for="item in data.list">
                <template v-if="item.type === 'grid'">
                    <el-row
                        :key="item.model"
                        type="flex"
                        :gutter="15"
                        :justify="item.options.justify"
                        :align="item.options.align">
                        <el-col v-if="item.type === 'grid'" v-for="(col, colIndex) in item.columns" :key="colIndex"
                                :style="{width:col.span}">
                            <template v-for="colItem in col.list">
                                <form-build-item-cond :key="colItem.model" :models.sync="models"
                                                      :box="colItem"
                                                      :remote="remote"
                                                      :notify-reset="notifyReset"
                                                      @resetCond="resetCond"
                                                      @queryByCond="queryByCond"></form-build-item-cond>
                            </template>
                        </el-col>
                    </el-row>
                </template>
                <template v-else>
                    <form-build-item-cond :key="item.model" :models.sync="models" :box="item" :remote="remote"
                                          @queryByCond="queryByCond"></form-build-item-cond>
                </template>
            </template>
        </el-form>
    </div>
</template>

<script>
    import FormBuildItemCond from '@/components/form-build/cond/FormBuildItemCond';
    
    export default {
        name: 'FormBuildCond', // 查询条件渲染
        components: {
            FormBuildItemCond
        },
        // data: 表单配置; (必填)
        // value: 表单填写的值{input_01:1,text_01:"111"}; (必填)
        // remote: 下拉框、单选框等远程获取数据的方法名称 (非必填)
        props: ['data', 'value', 'remote'],
        
        watch: {
            value: {
                deep: true,
                handler(value) {
                    this.models = {...this.models, ...value};
                }
            }
        },
        
        created() {
            this.buildModule(this.data.list);
        },
        
        data() {
            return {
                models: {},
                notifyReset: 0
            }
        },
        
        mounted() {
        },
        
        methods: {
            // 查询
            queryByCond(flag) {
                this.$emit('queryByCond', flag);
            },
            // 重置
            resetCond(flag) {
                this.$emit('resetCond', flag);
            },
            // 初始化表单模型
            buildModule(buildList) {
                let _this = this;
                if (this.KHUtils.isNull(buildList)) {
                    return false;
                }
                for (let i = 0; i < buildList.length; i++) {
                    if (buildList[i].type === 'grid') {
                        buildList[i].columns.forEach(item => {
                            _this.buildModule(item.list)
                        })
                    } else {
                        if (_this.value && Object.keys(_this.value).indexOf(buildList[i].model) >= 0) {
                            _this.models[buildList[i].model] = _this.value[buildList[i].model]
                        } else {
                            if (buildList[i].type === 'blank') {
                                _this.$set(_this.models, buildList[i].model, buildList[i].options.defaultType === 'String' ? '' : (buildList[i].options.defaultType === 'Object' ? {} : []))
                            } else {
                                if (buildList[i].type === 'table') {
                                    _this.models[buildList[i].model] = [];
                                } else {
                                    _this.models[buildList[i].model] = buildList[i].options.defaultValue;
                                }
                            }
                        }
                    }
                }
            },
            // 获取表单填写数据
            getData() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.$refs.buildForm.validate(valid => {
                        if (valid) {
                            resolve(_this.models);
                        } else {
                            reject(new Error('表单数据校验失败').message);
                        }
                    })
                })
            },
            // 重置表单
            reset() {
                let _this = this;
                _this.$refs.buildForm.resetFields();
                _this.notifyReset++;
            },
        }
    }
</script>
<style lang="scss" scoped>
</style>

<template>
    <div>
        <el-form ref="buildForm"
                 :label-suffix="data.config.labelSuffix ? data.config.labelSuffix:''"
                 :size="this.KHUtils.isNull(data) ? 'small' : data.config.size"
                 :model="models" :rules="rules"
                 :label-position="this.KHUtils.isNull(data) ?'right' :data.config.labelPosition"
                 :label-width="this.KHUtils.isNull(data) ? '100px' :data.config.labelWidth + 'px'">
            <template v-for="item in data.list">
                <template v-if="item.type === 'grid' || item.type === 'table' || item.type === 'flow_table'">
                    <el-row
                        :key="item.model"
                        type="flex"
                        :gutter="item.options.gutter ? item.options.gutter : 0"
                        :justify="item.options.justify"
                        :align="item.options.align">
                        <el-col v-if="item.type === 'grid'" v-for="(col, colIndex) in item.columns" :key="colIndex"
                                :span="col.span">
                            <template v-for="colItem in col.list">
                                <form-build-item
                                    v-if="colItem.show
                                     && (addOrEdit ? (Object.keys(colItem.options).indexOf('showFields') < 0 || !colItem.options.showFields) :  (Object.keys(colItem.options).indexOf('editShowFields') < 0 || !colItem.options.editShowFields))"
                                    :key="colItem.model" :models.sync="models"
                                    :rules="rules" :box="colItem"
                                    :form-id="formId"
                                    :addOrEdit="addOrEdit"
                                    :remote="remote"
                                    @func="getMsgFormSon"></form-build-item>
                            </template>
                        </el-col>
                    </el-row>
                </template>
                <template v-else>
                    <form-build-item
                        v-if="item.show
                        && (addOrEdit ? (Object.keys(item.options).indexOf('showFields') < 0 || !item.options.showFields) :  (Object.keys(item.options).indexOf('editShowFields') < 0 || !item.options.editShowFields))"
                        :key="item.model" :models.sync="models" :rules="rules" :box="item"
                        :form-id="formId"
                        :addOrEdit="addOrEdit"
                        :remote="remote"
                        @func="getMsgFormSon"></form-build-item>
                </template>
            </template>
        </el-form>
    </div>
</template>

<script>
    import FormBuildItem from '@/components/form-build/RestructureFormBuildItem';

    export default {
        name: 'SingleTableFormBuild',
        components: {
            FormBuildItem
        },
        // data: 表单配置; (必填)
        // value: 表单填写的值{input_01:1,text_01:"111"}; (必填)
        // addOrEdit: 区分当前表单新增Or编辑,true:新增; (必填),主要是图片、附件上传
        // remote: 下拉框、单选框等远程获取数据的方法名称 (非必填)
        // props: ['data', 'value', 'addOrEdit', 'remote'],
        props: {
            "data": {type: Object, required: true},// data: 被选中控件的配置
            "value": {type: Object, required: true},// value: 表单填写的值{input_01:1,text_01:"111"}; (必填)
            "addOrEdit": {type: Boolean, required: true},// addOrEdit: 区分当前表单新增Or编辑,true:新增; (必填),主要是图片、附件上传
            "remote": {type: Object, required: false},// remote: 下拉框、单选框等远程获取数据的方法名称 (非必填)
            "formId": {type: Number, required: false},// formId: 表单ID,预览时不需要传递
        },

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
                rules: {},
                relatedList: [], //  所有被控制的控件key集合
                defaultRelatedList: [], //  默认选中对应展示的控件集合,
            }
        },

        mounted() {
            // 下拉框、单选框等相互控制的处理
            let radios = [];
            let radiosRelatedList = [];
            this.relatedList = [];
            this.defaultRelatedList = [];
            if (!this.KHUtils.isNull(this.data.list)) {
                this.data.list.forEach(item => {
                    this.$set(item, 'show', true);
                    if (item.type === 'radio' || item.type === 'select') {
                        radios.push(item);
                    } else if (item.type === 'grid') {
                        // 栅格特殊处理
                        loop(item);

                        function loop(obj) {
                            if (obj.columns) {
                                obj.columns.forEach(cs => {
                                    cs.list.forEach(ls => {
                                        if (ls.type === 'radio' || ls.type === 'select') {
                                            radios.push(ls);
                                        }
                                        ls.show = true;
                                        if (ls.columns) {
                                            loop(ls);
                                        }
                                    })
                                })
                            }
                        }
                    } else if (item.type === 'table') {
                        if (item.tableColumns && item.tableColumns.length > 0) {
                            item.tableColumns.forEach(obj => {
                                this.$set(obj, 'show', true);
                            })
                        }
                    }
                });
            }
            radios.forEach(item => {
                item.options.options.forEach(val => {
                    if (!this.KHUtils.isNull(val.relatedList)) {
                        radiosRelatedList.push(...val.relatedList);
                    }
                })
            });

            radiosRelatedList.forEach(key => {
                for (let i = 0; i < radios.length; i++) {
                    if (key === radios[i].key) {
                        radios.splice(i, 1);
                        i++;
                    }
                }
            });
            radios.forEach(item => {
                item.options.options.forEach(val => {
                    if (!this.KHUtils.isNull(val.relatedList)) {
                        if (val.value === this.value[item.model]) {
                            this.defaultRelatedList.push(...val.relatedList);
                        } else if (item.options.defaultValue === val.value) {
                            this.defaultRelatedList.push(...val.relatedList);
                        } else {
                            this.relatedList.push(...val.relatedList);
                        }
                    }
                });
                Array.from(new Set(this.relatedList));
                Array.from(new Set(this.defaultRelatedList));
                this.loopQuery(this.defaultRelatedList, true);
                this.loopQuery(this.relatedList, false);
            });
            this.switchControl(this.relatedList, false);
            this.switchControl(this.defaultRelatedList, true);
        },

        methods: {
            // 循环查找应该显示和不显示的控件的key集合
            loopQuery(list, type) {
                if (!this.KHUtils.isNull(list)) {
                    list.forEach(key => {
                        for (let i = 0; i < this.data.list.length; i++) {
                            if (this.data.list[i].key === key && (this.data.list[i].type === 'radio' || this.data.list[i].type === 'select')) {
                                let arr = [];
                                let defaultArr = [];
                                this.data.list[i].options.options.forEach(item => {
                                    if (!this.KHUtils.isNull(item.relatedList)) {
                                        if (type) {
                                            if (item.value === this.data.list[i].options.defaultValue) {
                                                defaultArr.push(...item.relatedList);
                                            } else {
                                                arr.push(...item.relatedList);
                                            }
                                        } else {
                                            arr.push(...item.relatedList);
                                        }
                                    }
                                });
                                Array.from(new Set(defaultArr));
                                Array.from(new Set(arr));
                                this.relatedList.push(...arr);
                                this.loopQuery(arr, false);
                                if (type) {
                                    this.defaultRelatedList.push(...defaultArr);
                                    this.loopQuery(defaultArr, true);
                                }
                                break;
                            }
                        }
                    })
                }
            },
            // 显示隐藏被控件
            switchControl(keys, isShow) {
                if (Array.isArray(keys)) {
                    keys.forEach((key) => {
                        for (let i = 0, j = this.data.list.length; i < j; i++) {
                            if (key === this.data.list[i].key) {
                                this.data.list[i].show = isShow;
                                break;
                            }
                            // 栅格特殊处理
                            if (this.data.list[i].type === 'grid') {
                                loop(this.data.list[i]);
                            }

                            function loop(obj) {
                                if (obj.columns) {
                                    obj.columns.forEach(cs => {
                                        cs.list.forEach(ls => {
                                            if (key === ls.key) {
                                                ls.show = isShow;
                                            }
                                            if (ls.columns) {
                                                loop(ls);
                                            }
                                        })
                                    })
                                }
                            }
                        }
                    })
                }
            },
            // 从子组件中获取下拉框等选择的值
            getMsgFormSon(buildObj) {
                let _this = this;
                let data = buildObj.data;
                let buildList = _this.data.list;
                if (buildList.length <= 1) return;
                this.relatedList = [];                          //  存取所有的该单选|下拉框的relatedList
                this.defaultRelatedList = [];                   //  单选框|下拉框选中的值对应的relatedList
                const options = buildObj.options.options;
                for (let i = 0; i < options.length; i++) {
                    if (!this.KHUtils.isNull(options[i].relatedList)) {
                        if (options[i].value === data) {
                            this.defaultRelatedList = options[i].relatedList;
                        } else {
                            this.relatedList.push(...options[i].relatedList);
                        }
                    }
                }
                Array.from(new Set(this.relatedList));
                Array.from(new Set(this.defaultRelatedList));
                this.loopQuery(this.defaultRelatedList, true);
                this.loopQuery(this.relatedList, false);
                this.switchControl(this.relatedList, false);
                this.switchControl(this.defaultRelatedList, true);
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
                        // 表单校验处理
                        if (_this.rules[buildList[i].model]) {
                            _this.rules[buildList[i].model] = [..._this.rules[buildList[i].model], ...buildList[i].rules.map(item => {
                                if (item.pattern) {
                                    return {...item, pattern: eval(item.pattern)}
                                } else {
                                    return {...item}
                                }
                            })]
                        } else {
                            if(buildList[i].rules instanceof Array && buildList[i].rules.length >0){
                                _this.rules[buildList[i].model] = [...buildList[i].rules.map(item => {
                                    if (item.pattern) {
                                        return {...item, pattern: eval(item.pattern)}
                                    } else {
                                        return {...item}
                                    }
                                })]
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
            },
        }
    }
</script>
<style lang="scss" scoped>
</style>

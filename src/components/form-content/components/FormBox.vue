<template>
    <section class="full-content">
        <div v-if="data.list.length === 0" class="form-empty">从左侧拖拽来添加字段</div>
        <el-form class="full-height" :size="data.config.size" label-suffix=":"
                 :label-position="data.config.labelPosition"
                 :label-width="data.config.labelWidth + 'px'">
            <draggable class="widget-form-list-box"
                       v-model="data.list"
                       v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                       @add="formItemAdd">
                <transition-group name="fade" tag="div" class="widget-form-list">
                    <template v-for="(element, index) in data.list">
                        <template
                            v-if="element.type === 'grid' || element.type === 'table' ||  element.type === 'flow_table'">
                            <el-row
                                v-if="element"
                                :key="index"
                                class="widget-col widget-view"
                                type="flex"
                                :class="{active: selectFormItem.key === element.key}"
                                :gutter="element.options.gutter ? element.options.gutter : 0"
                                :justify="element.options.justify"
                                :align="element.options.align"
                                @click.native="selectingFormItem(index)">
                                <el-col v-if="element.type === 'grid'"
                                        v-for="(col, colIndex) in element.columns"
                                        :key="colIndex"
                                        :span="col.span ? col.span : 0">
                                    <draggable
                                        v-model="col.list"
                                        :no-transition-on-drag="true"
                                        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                                        @add="formItemColAdd($event, element, colIndex)">
                                        <transition-group
                                            name="fade"
                                            tag="div"
                                            class="widget-col-list">
                                            <form-box-item
                                                v-for="(el, i) in col.list"
                                                :key="el.model"
                                                :element="el"
                                                :select.sync="selectFormItem"
                                                :controlled-arr="controlledArr"
                                                :index="i"
                                                :data="col"
                                                :notifyLoadMapping="notifyLoadMapping"
                                                @changeNum="changeNum"
                                                @loadFormMapping="loadFormMapping"
                                                @onFormItemList="$emit('onFormItemList',data.list)"
                                            >
                                            </form-box-item>
                                        </transition-group>
                                    </draggable>
                                </el-col>
                                <div class="widget-table-wrapper"
                                     v-if="element.type === 'table' || element.type === 'flow_table'">
                                    <el-form-item class="widget-view" :label="element.name"></el-form-item>
                                    <div class="widget-table-content">
                                        <div class="table-empty" v-if="element.tableColumns.length === 0">从左侧拖拽来添加字段
                                        </div>
                                        <div class="widget-table-col" style="width: calc(645px);">
                                            <template>
                                                <draggable
                                                    v-model="element.tableColumns"
                                                    :no-transition-on-drag="true"
                                                    v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                                                    @add="formTdAdd($event, element)">
                                                    <transition-group
                                                        name="fade"
                                                        tag="div"
                                                        style="min-height: 100px;border: 1px dashed #ccc;background: #fff;height: 160px;overflow:auto">
                                                        <template v-for="(el, i) in element.tableColumns">
                                                            <template
                                                                v-if="el.type === 'grid' || el.type === 'table' || el.type === 'flow_table' ">
                                                            </template>
                                                            <template v-else>
                                                                <form-box-item
                                                                    :key="el.key"
                                                                    v-if="el.key"
                                                                    :element="el"
                                                                    :select.sync="selectFormItem"
                                                                    :controlled-arr="controlledArr"
                                                                    :index="i"
                                                                    :data="element"
                                                                    :notifyLoadMapping="notifyLoadMapping"
                                                                    @changeNum="changeNum"
                                                                    @loadFormMapping="loadFormMapping"
                                                                    @onFormItemList="$emit('onFormItemList',$event)"
                                                                >
                                                                </form-box-item>
                                                            </template>
                                                        </template>
                                                    </transition-group>
                                                </draggable>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div class="widget-view-action widget-col-action"
                                     v-if="selectFormItem.model === element.model">
                                    <i class="iconfont icon-trash" @click.stop="boxDelete(index)"></i>
                                </div>
                                <div class="widget-view-drag widget-col-drag"
                                     v-if="selectFormItem.model === element.model">
                                    <i class="iconfont icon-drag drag-widget"></i>
                                </div>
                            </el-row>
                        </template>
                        <template v-else>
                            <form-box-item
                                v-if="element && element.key && element.model && element.model.indexOf('business_state_') == -1"
                                :key="element.key"
                                :element="element"
                                :select.sync="selectFormItem"
                                :controlled-arr="controlledArr"
                                :index="index"
                                :data="data"
                                :notifyLoadMapping="notifyLoadMapping"
                                @changeNum="changeNum"
                                @loadFormMapping="loadFormMapping"
                                @onFormItemList="$emit('onFormItemList',$event)"
                            >
                            </form-box-item>
                        </template>
                    </template>
                </transition-group>
            </draggable>
        </el-form>
    </section>
</template>

<script>
    import Draggable from 'vuedraggable'
    import FormBoxItem from '@/components/form-content/components/FormBoxItem'

    export default {
        name: "FormBox",
        components: {
            Draggable,
            FormBoxItem
        },
        // data: 表单配置(必填)
        // select: 当前选中的控件(必填)
        // controlled: 被相互控制的集合(非必填)
        // clearAllFlag: FormContent点击清空,触发当前页面的动作处理(必填)
        props: ['data', 'select', 'controlled', "clearAllFlag"],
        data() {
            return {
                notifyLoadMapping: -1,
                tableData: [{}],
                showTable: false,
                selectFormItem: this.select,
                controlledArr: this.controlled,
                numArray: [],
                themeMeta: null
            }
        },
        watch: {
            select(val) {
                this.selectFormItem = val
            },
            selectFormItem: {
                handler(val) {
                    this.$emit('update:select', val);
                },
                deep: true
            },
            controlled(newValue) {
                this.controlledArr = [...newValue];
            },
            clearAllFlag() {
                this.numArray = [];  // 清除控件命名的数组
            }
        },
        mounted() {
            let _this = this;
            _this.numArray = [];
            let typeList = [];
            if (!_this.KHUtils.isNull(_this.data.list)) {
                _this.data.list.forEach((obj) => {
                    // 栅格
                    if (obj.type === 'grid') {
                        obj.columns.forEach(colObj => {
                            colObj.list.forEach(lsObj => {
                                typeList.push(lsObj.type);
                            })
                        })
                    } else if (obj.type === 'table' || obj.type === 'flow_table') {
                        typeList.push(obj.type);
                        if (obj.tableColumns) {
                            obj.tableColumns.forEach(tc => {
                                typeList.push(tc.type);
                            })
                        }
                    } else {
                        typeList.push(obj.type);
                    }
                });
                typeList.forEach((type, index) => {
                    let newObj = {};
                    if (index === 0) {
                        newObj.type = type;
                        newObj.num = "";
                        _this.numArray.push(newObj)
                    } else {
                        let flag = false;
                        _this.numArray.forEach(numObj => {
                            if (type === numObj.type) {
                                flag = true;
                                // 类型相同,加1处理
                                if (null === numObj.num) {
                                    // 删除直至清空后,初始化num为""
                                    numObj.num = "";
                                } else {
                                    numObj.num = numObj.num === "" ? 1 : numObj.num + 1;
                                }
                            }
                        });
                        if (!flag) {
                            newObj.type = type;
                            newObj.num = "";
                            _this.numArray.push(newObj);
                        }
                    }
                })
            }
            document.body.ondrop = function (event) {
                let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                if (isFirefox) {
                    event.preventDefault();
                    event.stopPropagation()
                }
            }
            _this.queryApplyTheme();
        },
        methods: {

            // 查询当前是否有应用主题
            queryApplyTheme() {
                let _this = this;
                if (!_this.data.config) {
                    return false;
                }
                if (_this.KHUtils.isNull(_this.data.config.themeId)) {
                    return false;
                }
                _this.$Get(_this.khConfig.api.queryThemeMeta + "/" + _this.data.config.themeId).then(res => {
                    if (res.errCode === 0) {
                        let themeMeta = JSON.parse(res.themeMeta);
                        if (!_this.KHUtils.isNull(themeMeta)) {
                            _this.themeMeta = themeMeta;
                        }
                    }
                });
            },
            applyTheme() {
                let _this = this;
                if (_this.KHUtils.isNull(_this.themeMeta) || !_this.themeMeta[_this.selectFormItem.type]) {
                    return false;
                }
                if (_this.selectFormItem.type !== 'switch' && _this.selectFormItem.type !== 'radio' && _this.selectFormItem.type !== 'checkbox' && _this.selectFormItem.type !== 'signature' && _this.selectFormItem.type !== 'image_upload' && _this.selectFormItem.type !== 'file_upload') {
                    _this.selectFormItem.widgetBackgroundColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetBackgroundColor) ? null : _this.themeMeta[_this.selectFormItem.type].widgetBackgroundColor;
                    _this.selectFormItem.widgetFontColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetFontColor) ? null : _this.themeMeta[_this.selectFormItem.type].widgetFontColor;
                    _this.selectFormItem.widgetIconColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetIconColor) ? null : _this.themeMeta[_this.selectFormItem.type].widgetIconColor;
                    _this.selectFormItem.widgetIconBackgroundColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetIconBackgroundColor) ? null : _this.themeMeta[_this.selectFormItem.type].widgetIconBackgroundColor;
                    _this.selectFormItem.widgetTitleFontSize = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetTitleFontSize) ? null : _this.themeMeta[_this.selectFormItem.type].widgetTitleFontSize;
                    _this.selectFormItem.widgetTitleFontColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetTitleFontColor) ? null : _this.themeMeta[_this.selectFormItem.type].widgetTitleFontColor;
                    _this.selectFormItem.widgetBorderSize = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetBorderSize) ? null : _this.themeMeta[_this.selectFormItem.type].widgetBorderSize;
                    _this.selectFormItem.widgetBorderColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetBorderColor) ? null : _this.themeMeta[_this.selectFormItem.type].widgetBorderColor;
                } else if (_this.selectFormItem.type === 'signature' ||  _this.selectFormItem.type === 'image_upload' || _this.selectFormItem.type === 'file_upload') {
                     _this.selectFormItem.btnWidgetBackgroundColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].btnWidgetBackgroundColor) ? null : _this.themeMeta[_this.selectFormItem.type].btnWidgetBackgroundColor;
                    _this.selectFormItem.btnWidgetFontColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].btnWidgetFontColor) ? null : _this.themeMeta[_this.selectFormItem.type].btnWidgetFontColor;
                    _this.selectFormItem.uploadTipFontColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].uploadTipFontColor) ? null : _this.themeMeta[_this.selectFormItem.type].uploadTipFontColor;
                } else if (_this.selectFormItem.type === 'switch') {
                    _this.selectFormItem.widgetActiveColor = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetActiveColor) ? null : _this.themeMeta[_this.selectFormItem.type].widgetActiveColor;
                    _this.selectFormItem.widgetInActiveColorr = _this.KHUtils.isNull(_this.themeMeta[_this.selectFormItem.type].widgetInActiveColorr) ? null : _this.themeMeta[_this.selectFormItem.type].widgetInActiveColorr;
                }
            },
            // 子组件中控件删除,通知FormContent父组件刷新dynCols
            loadFormMapping(tmpArray) {
                let _this = this;
                if (tmpArray instanceof Array && tmpArray.length > 0) {
                    this.$emit("loadFormMapping", tmpArray);
                } else {
                    // 栅格特殊化处理
                    let tmpArray = [];
                    let tempConfig = _this.data;
                    for (let i = 0, n = tempConfig.list.length; i < n; i++) {
                        let obj = tempConfig.list[i];
                        if ("grid" === obj.type) {
                            loop(obj, tmpArray, _this);

                            function loop(obj, arr, _this) {
                                let columns = obj.columns;
                                for (let j = 0, m = columns.length; j < m; j++) {
                                    let colObj = columns[j];
                                    colObj.list.forEach(lsObj => {
                                        if (lsObj.type !== 'data_select' && lsObj.type !== 'm_data_select'
                                            && lsObj.type !== 'org_select' && lsObj.type !== 'm_org_select'
                                            && lsObj.type !== 'user_select' && lsObj.type !== 'm_user_select'
                                            && lsObj.type !== 'company_select' && lsObj.type !== 'm_company_select'
                                            && lsObj.type !== 'role_select' && lsObj.type !== 'm_role_select'
                                            && lsObj.type !== 'dic_select' && lsObj.type !== 'm_dic_select'
                                            && lsObj.type !== 'gis_select' && lsObj.type !== 'region_select') {
                                            arr.push(lsObj);
                                        }
                                        if ("grid" === lsObj.type) {
                                            loop(obj, _this);
                                        }
                                    })
                                }
                            }
                        } else if ("table" !== obj.type) {
                            if (obj.type !== 'data_select' && obj.type !== 'm_data_select'
                                &&  obj.type !== 'org_select' && obj.type !== 'm_org_select'
                                && obj.type !== 'user_select' && obj.type !== 'm_user_select'
                                && obj.type !== 'company_select' && obj.type !== 'm_company_select'
                                && obj.type !== 'role_select' && obj.type !== 'm_role_select'
                                && obj.type !== 'dic_select' && obj.type !== 'gis_select' && obj.type !== 'region_select') {
                                tmpArray.push(obj);
                            }
                        }
                    }
                    this.$emit("loadFormMapping", tmpArray);
                }
            },
            // 子组件点击删除控件后的对组件命名的调整
            changeNum(delBoxType, type) {
                let _this = this;
                if (_this.numArray.length === 0) {
                    return false;
                }
                let changeNumIndex = 0;
                let flag = false;
                _this.numArray.forEach((numObj, i) => {
                    if (numObj.type === delBoxType) {
                        flag = true;
                        changeNumIndex = i;
                    }
                });
                if (flag) {
                    if ("delete" === type) {
                        // 删除,如果删除直到清空某个类型的控件,则将其num置为null
                        if (_this.numArray[changeNumIndex].num < 1 || _this.KHUtils.isNull(_this.numArray[changeNumIndex].num)) {
                            _this.numArray.splice(changeNumIndex, 1);
                        } else if (_this.numArray[changeNumIndex].num > 2) {
                            _this.numArray[changeNumIndex].num = this.numArray[changeNumIndex].num - 1;
                        } else if (_this.numArray[changeNumIndex].num === 1) {
                            _this.numArray[changeNumIndex].num = "";
                        }
                    } else {
                        // 复制
                        _this.numArray[changeNumIndex].num = _this.KHUtils.isNull(_this.numArray[changeNumIndex].num)
                            ? 1 : _this.numArray[changeNumIndex].num + 1;
                    }
                }
            },
            // 控件选中状态
            selectingFormItem(index) {
                let _this = this;
                _this.selectFormItem = _this.data.list[index];
            },
            // 控件添加
            formItemAdd(evt) {
                this.$emit('onFormItemList', this.data.list);
                for (var i = 0; i < this.data.list.length; i++) {
                   if(this.data.list[i] && this.data.list[i].type == "select" && this.data.list[i].model && this.data.list[i].model.startsWith("business_state")){
                       let business_state = this.data.list[i]
                       this.$delete(this.data.list,i)
                       this.data.list.push(business_state)
                   }
                }
                let _this = this;
                let currentObj = {};
                const newIndex = evt.newIndex;
                let tempSelectItem = _this.data.list[newIndex];
                let dataType = _this.data.list[newIndex].type;
                if (_this.KHUtils.isNull(tempSelectItem.model)) {
                    // 判断当前控件是否能够继续添加
                    _this.numArray.forEach(numObj => {
                        if (numObj.type === dataType) {
                            currentObj = numObj;
                        }
                    });
                    if (currentObj.type === 'flow_table' || currentObj.type === 'gis_select' || currentObj.type === 'region_select') {
                        if (_this.KHUtils.isNull(currentObj.num)) {
                            // 限制只允许添加一个子表单
                            _this.$notify({
                                title: '警告',
                                message: '该类控件不允许添加超过1个',
                                type: 'warning'
                            });
                            _this.data.list.splice(newIndex, 1);
                            return false;
                        }
                    }
                    // 如果可以继续添加,则对当前控件数据处理
                    currentObj = {};
                    let flag = false;
                    _this.numArray.forEach(numObj => {
                        if (numObj.type === dataType) {
                            if (null === numObj.num) {
                                // 删除直至清空后,初始化num为""
                                numObj.num = "";
                            } else {
                                numObj.num = numObj.num === "" ? 1 : numObj.num + 1;
                            }
                            currentObj = numObj;
                            flag = true;
                        }
                    });
                    if (!flag) {
                        let newObj = {};
                        newObj.type = dataType;
                        newObj.num = "";
                        currentObj = newObj;
                        _this.numArray.push(newObj);
                    }
                }

                // 为拖拽到容器的元素添加唯一 key
                let key = _this.KHUtils.isNull(tempSelectItem.key) ? Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999) : tempSelectItem.key;
                let model = _this.KHUtils.isNull(tempSelectItem.model) ? dataType + '_' + key : tempSelectItem.model;
                let name = _this.KHUtils.isNull(tempSelectItem.model) ? tempSelectItem.name + currentObj.num : tempSelectItem.name;
               _this.$set(_this.data.list, newIndex, {
                    ..._this.data.list[newIndex],
                    options: {
                        ..._this.data.list[newIndex].options,
                        // remoteCall: 'func_' + key
                    },
                    //  绑定键值
                    model: model,
                    //rules: [],
                    name: name,
                    key,
                });
                if (_this.KHUtils.isNull(tempSelectItem.model)) {
                    let tempData = _this.KHUtils.clone(_this.data.list[newIndex]);
                    // 数据选择控件特殊处理
                    if (  dataType === 'data_select' || dataType === 'm_data_select' || dataType === 'org_select' || dataType === 'm_org_select'  || dataType === 'user_select'  || dataType === 'm_user_select'  || dataType === 'company_select' || dataType === 'm_company_select' || dataType === 'role_select' || dataType === 'm_role_select' || dataType === 'dic_select' || dataType === 'm_dic_select')  {
                        tempData.options.maps.key = "";
                        tempData.options.maps.name = "";
                        tempData.options.maps.title = "";
                        tempData.options.maps.mapping = [];
                        tempData.options.maps.condFilters = [];
                        tempData.key_name = "";
                        tempData.label_name = "";
                        tempData.label_model = "";
                        if (tempData.options.maps.source) {
                            tempData.options.maps.source.datasource = "";
                            tempData.options.maps.source.table = "";
                            tempData.options.maps.source.columns = [];
                        }
                        _this.data.list[newIndex] = tempData;
                    }
                        if(dataType === 'm_data_ref'){
                            tempData.options.dsConf = {
                                    formId: "",
                                    subKey: "",
                                    mapping: {
                                        key:"id",
                                        value:"",
                                    },
                                    columns: [],
                                    condFilters: [],
                                    defaultSelect:false
                                }
                                _this.data.list[newIndex] = tempData;
                        }


                }
                // 下拉选择、单选等控件特殊处理
                if (dataType === 'radio' || dataType === 'checkbox' || dataType === 'select' || dataType === 'multiple_select') {
                    _this.$set(_this.data.list, newIndex, {
                        ..._this.data.list[newIndex],
                        options: {
                            ..._this.data.list[newIndex].options,
                            options: _this.data.list[newIndex].options.options.map(item => ({
                                ...item
                            }))
                        }
                    })
                }
                // 栅格控件特殊处理
                if (dataType === 'grid') {
                    _this.$set(_this.data.list, newIndex, {
                        ..._this.data.list[newIndex],
                        columns: _this.data.list[newIndex].columns.map(item => ({...item})),
                        name: name
                    })
                }
                _this.selectFormItem = _this.data.list[newIndex];
                _this.applyTheme();
                if (dataType === 'm_data_ref' || dataType === 'data_select' || dataType === 'm_data_select' || dataType === 'company_select' || dataType === 'm_company_select'|| dataType === 'user_select' || dataType === 'm_user_select') {
                    _this.notifyLoadMapping = newIndex;
                }
                if(dataType === 'table'){
                    let tempData = _this.KHUtils.clone(_this.data.list[newIndex]);
                   tempData.options.dsConf = {
                        formId:"",
                        formName:"",
                        subKey:'',
                        mapping:[],
                        columns:[],
                        condFilters:[],
                        defaultSelect:false
                    }
                    this.$set(_this.data.list,newIndex,tempData)
                }
            },
            // 子表单内部控件添加
            formTdAdd($event, row) {
                this.$emit('onFormItemList', row.tableColumns);
                let _this = this;
                const newIndex = $event.newIndex;
                _this.showTable = false;
                const oldIndex = $event.oldIndex;
                const item = $event.item;
                let tempSelectItem = row.tableColumns[newIndex];
                let dataType = row.tableColumns[newIndex].type;
                let currentObj = {};
                if (_this.KHUtils.isNull(tempSelectItem.model)) {
                    if (dataType === 'grid' || dataType === 'table' || dataType === 'flow_table') {
                        _this.$notify({
                            title: '警告',
                            message: '子表单暂不支持添加此类控件',
                            type: 'warning'
                        });
                        row.tableColumns.splice(newIndex, 1);
                        return false;
                    }
                    // 当从面板将已存在的控件拖拽进入栅格,名称不需要重命名
                    let boxName = row.tableColumns[newIndex].name;
                    if (!this.KHUtils.isNumber(boxName.substring(boxName.length - 1, boxName.length))) {
                        let flag = false;
                        _this.numArray.forEach(numObj => {
                            if (numObj.type === dataType) {
                                if (null === numObj.num) {
                                    // 删除直至清空后,初始化num为""
                                    numObj.num = "";
                                } else {
                                    numObj.num = numObj.num === "" ? 1 : numObj.num + 1;
                                }
                                currentObj = numObj;
                                flag = true;
                            }
                        });
                        if (!flag) {
                            let newObj = {};
                            newObj.type = dataType;
                            newObj.num = "";
                            currentObj = newObj;
                            _this.numArray.push(newObj);
                        }
                    } else {
                        currentObj.num = "";
                    }
                }
                //  防止布局元素的嵌套拖拽
                if (item.className.indexOf('data-grid') >= 0) {
                    //  如果是列表中拖拽的元素需要还原到原来位置
                    item.tagName === 'DIV' && _this.data.list.splice(oldIndex, 0, row.tableColumns[newIndex]);
                    row.tableColumns.splice(newIndex, 1);
                    return false
                }
                let key = _this.KHUtils.isNull(tempSelectItem.key) ? Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999) : tempSelectItem.key;
                let model = _this.KHUtils.isNull(tempSelectItem.model) ? dataType + '_' + key : tempSelectItem.model;
                let name = _this.KHUtils.isNull(tempSelectItem.model) ? tempSelectItem.name + currentObj.num : tempSelectItem.name;
                _this.$set(row.tableColumns, newIndex, {
                    ...row.tableColumns[newIndex],
                    options: {
                        ...row.tableColumns[newIndex].options,
                        // remoteCall: 'func_' + key
                    },
                    key,
                    model: model,       // 绑定键值
                   // rules: [],
                    name: name
                });
                if (dataType === 'radio' || dataType === 'checkbox' || dataType === 'select') {
                    _this.$set(row.tableColumns, newIndex, {
                        ...row.tableColumns[newIndex],
                        options: {
                            ...row.tableColumns[newIndex].options,
                            options: row.tableColumns[newIndex].options.options.map(item => ({
                                ...item
                            }))
                        }
                    })
                }
                if (_this.KHUtils.isNull(tempSelectItem.model)) {
                    let tempData = _this.KHUtils.clone(row.tableColumns[newIndex]);
                    // 数据选择控件特殊处理
                    if (dataType === 'data_select' || dataType === 'm_data_select' || dataType === 'org_select' || dataType === 'm_org_select' || dataType === 'user_select'  || dataType === 'm_user_select' || dataType === 'company_select' || dataType === 'm_company_select' || dataType === 'role_select' || dataType === 'm_role_select' || dataType === 'dic_select' || dataType === 'm_dic_select') {
                        tempData.options.maps.key = "";
                        tempData.options.maps.name = "";
                        tempData.options.maps.title = "";
                        tempData.options.maps.mapping = [];
                        tempData.key_name = "";
                        tempData.label_name = "";
                        tempData.label_model = "";
                        if (tempData.options.maps.source) {
                            tempData.options.maps.source.datasource = "";
                            tempData.options.maps.source.table = "";
                            tempData.options.maps.source.columns = [];
                        }
                        row.tableColumns[newIndex] = tempData;
                    }
                    if(dataType === 'm_data_ref'){
                       tempData.options.dsConf = {
                            formId: "",
                            subKey: "",
                            mapping: {
                                key:"id",
                                value:"",
                            },
                            columns: [],
                            condFilters: [],
                        }
                       row.tableColumns[newIndex] = tempData;
                    }

                }
                _this.selectFormItem = row.tableColumns[newIndex];
                _this.applyTheme();
                _this.showTable = true;
                if (dataType === 'data_select' || dataType === 'm_data_select' || dataType === 'company_select' ||  dataType === 'm_company_select' || dataType === 'user_select' ||dataType === 'm_user_select' ) {
                    _this.notifyLoadMapping = newIndex;
                }
            },
            // 栅格内部控件添加
            formItemColAdd($event, row, colIndex) {
                let _this = this;
                const newIndex = $event.newIndex;
                const oldIndex = $event.oldIndex;
                const item = $event.item;
                let currentObj = {};
                let tempSelectItem = row.columns[colIndex].list[newIndex];
                let dataType = row.columns[colIndex].list[newIndex].type;
                // 当从面板将已存在的控件拖拽进入栅格,名称不需要重命名
                if (_this.KHUtils.isNull(tempSelectItem.model)) {
                    let boxName = row.columns[colIndex].list[newIndex].name;
                    if (!this.KHUtils.isNumber(boxName.substring(boxName.length - 1, boxName.length))) {
                        let flag = false;
                        _this.numArray.forEach(numObj => {
                            if (numObj.type === dataType) {
                                if (null === numObj.num) {
                                    // 删除直至清空后,初始化num为""
                                    numObj.num = "";
                                } else {
                                    numObj.num = numObj.num === "" ? 1 : numObj.num + 1;
                                }
                                currentObj = numObj;
                                flag = true;
                            }
                        });
                        if (!flag) {
                            let newObj = {};
                            newObj.type = dataType;
                            newObj.num = "";
                            currentObj = newObj;
                            _this.numArray.push(newObj);
                        }
                    } else {
                        currentObj.num = "";
                    }
                }
                //  防止布局元素的嵌套拖拽
                if (item.className.indexOf('data-grid') >= 0) {
                    //  如果是列表中拖拽的元素需要还原到原来位置
                    item.tagName === 'DIV' && _this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex]);
                    row.columns[colIndex].list.splice(newIndex, 1);
                    return false
                }
                let key = _this.KHUtils.isNull(tempSelectItem.key) ? Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999) : tempSelectItem.key;
                let model = _this.KHUtils.isNull(tempSelectItem.model) ? dataType + '_' + key : tempSelectItem.model;
                let name = _this.KHUtils.isNull(tempSelectItem.model) ? tempSelectItem.name + currentObj.num : tempSelectItem.name;
                _this.$set(row.columns[colIndex].list, newIndex, {
                    ...row.columns[colIndex].list[newIndex],
                    options: {
                        ...row.columns[colIndex].list[newIndex].options,
                        // remoteCall: 'func_' + key
                    },
                    key,
                    model: model,       // 绑定键值
                   // rules: [],
                    name: name
                });
                if (dataType === 'radio' || dataType === 'checkbox' || dataType === 'select') {
                    _this.$set(row.columns[colIndex].list, newIndex, {
                        ...row.columns[colIndex].list[newIndex],
                        options: {
                            ...row.columns[colIndex].list[newIndex].options,
                            options: row.columns[colIndex].list[newIndex].options.options.map(item => ({
                                ...item
                            }))
                        }
                    })
                }
                if (_this.KHUtils.isNull(tempSelectItem.model)) {
                    // 数据选择控件特殊处理
                    let tempData = _this.KHUtils.clone(row.columns[colIndex].list[newIndex]);
                    if (dataType === 'data_select' || dataType === 'm_data_select' || dataType === 'org_select' || dataType === 'm_org_select' || dataType === 'user_select' || dataType === 'm_user_select' || dataType === 'company_select' || dataType === 'm_company_select' || dataType === 'role_select' || dataType === 'm_role_select' || dataType === 'dic_select' || dataType === 'm_dic_select') {
                        tempData.options.maps.key = "";
                        tempData.options.maps.name = "";
                        tempData.options.maps.title = "";
                        tempData.options.maps.mapping = [];
                        tempData.key_name = "";
                        tempData.label_name = "";
                        tempData.label_model = "";
                        if (tempData.options.maps.source) {
                            tempData.options.maps.source.datasource = "";
                            tempData.options.maps.source.table = "";
                            tempData.options.maps.source.columns = [];
                        }
                        row.columns[colIndex].list[newIndex] = tempData;
                    }
                }
                _this.selectFormItem = row.columns[colIndex].list[newIndex];
                _this.applyTheme();
                if (dataType === 'data_select' ||dataType === 'm_data_select'  || dataType === 'company_select' || dataType === 'm_company_select' || dataType === 'user_select' ||  dataType === 'm_user_select' ) {
                    _this.notifyLoadMapping = colIndex;
                }
            },
            // 栅格,子表单控件删除
            boxDelete(index) {
                let _this = this;
                let flag = false;
                let changeNumIndex = 0;
                _this.numArray.forEach((numObj, i) => {
                    if (numObj.type === _this.data.list[index].type) {
                        flag = true;
                        changeNumIndex = i;
                    }
                });
                if (flag) {
                    if (_this.numArray[changeNumIndex].num < 1 || _this.KHUtils.isNull(_this.numArray[changeNumIndex].num)) {
                        _this.numArray.splice(changeNumIndex, 1);
                    } else if (_this.numArray[changeNumIndex].num > 2) {
                        _this.numArray[changeNumIndex].num = this.numArray[changeNumIndex].num - 1;
                    } else if (_this.numArray[changeNumIndex].num === 1) {
                        _this.numArray[changeNumIndex].num = "";
                    }
                }
                if (_this.data.list.length - 1 === index) {
                    if (index === 0) {
                        _this.selectFormItem = {}
                    } else {
                        _this.selectFormItem = _this.data.list[index - 1]
                    }
                } else {
                    _this.selectFormItem = _this.data.list[index + 1]
                }
                _this.applyTheme();
                _this.$nextTick(() => {
                    _this.data.list.splice(index, 1);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

    .form-empty {
        position: absolute;
        text-align: center;
        width: 300px;
        font-size: 20px;
        top: 300px;
        left: 50%;
        margin-left: -300px;
        color: #ccc;
    }

    .widget-table-content {
        width: 100%;
        outline: 1px dashed #ccc;
        background: #fff;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        margin: 0 1px;
        position: relative;
    }

    .widget-table-wrapper {
        min-height: 50px;
        background: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
    }

    .table-empty {
        position: absolute;
        text-align: center;
        width: 300px;
        height: 20px;
        font-size: 18px;
        top: 30px;
        left: 50%;
        margin-left: -150px;
        color: #ccc;
    }


</style>

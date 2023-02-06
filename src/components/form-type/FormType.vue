<template>
    <section class="form-type">
        <el-row v-if="formTypeItems.basic.length">
            <h4>基础控件</h4>
            <draggable
                tag="ul"
                :list="formTypeItems.basic"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="clickMove">
                <li
                    class="form-edit-widget-label"
                    :class="{'no-put': item.type === 'divider'}"
                    v-for="(item, index) in formTypeItems.basic"
                    :key="index">
                    <a>
                        <i class="icon iconfont" :class="item.icon"></i>
                        <span>{{item.name}}</span>
                    </a>
                </li>
            </draggable>
        </el-row>
        <el-row v-if="advance.length && type===0">
            <h4>高级控件</h4>
            {{ }}
            <draggable
                tag="ul"
                :list="advance"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="clickMove">
                <li
                    class="form-edit-widget-label"
                    :class="{'no-put': item.type === 'table'}"
                    v-for="(item, index) in advance"
                    :key="index">
                    <a>
                        <i class="icon iconfont" :class="item.icon"></i>
                        <span>{{item.name}}</span>
                    </a>
                </li>
            </draggable>
        </el-row>
        <el-row v-if="processAdvance.length && type===1">
            <h4>高级控件</h4>
            {{ }}
            <draggable
                tag="ul"
                :list="processAdvance"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="clickMove">
                <li
                    class="form-edit-widget-label"
                    :class="{'no-put': item.type === 'table'}"
                    v-for="(item, index) in processAdvance"
                    :key="index">
                    <a>
                        <i class="icon iconfont" :class="item.icon"></i>
                        <span>{{item.name}}</span>
                    </a>
                </li>
            </draggable>
        </el-row>
        <el-row v-if="formTypeItems.layout.length">
            <h4>布局控件</h4>
            <draggable
                tag="ul"
                :list="formTypeItems.layout"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="clickMove">
                <li
                    class="form-edit-widget-label no-put"
                    v-for="(item, index) in formTypeItems.layout"
                    :key="index">
                    <a>
                        <i class="icon iconfont" :class="item.icon"></i>
                        <span>{{item.name}}</span>
                    </a>
                </li>
            </draggable>
        </el-row>
    </section>
</template>

<script>
    import formTypeItems from '../../utils/formType.config'
    import Draggable from 'vuedraggable'
    
    export default {
        name: "FormType",
        
        components: {
            Draggable
        },
        
        props: {
            type: {},
            basicFields: {
                type: Array,
                default: () => ['input', 'textarea', 'text', 'input_mobile', 'input_tel', 'input_mail', 'input_postal', 'input_website', 'number', 'input_number', 'input_int', 'input_long', 'radio', 'checkbox', 'time', 'year', 'year_month', 'month', 'date', 'datetime', 'rate', 'select', 'multiple_select', 'switch']
            },
            advanceFields: {
                type: Array,
                default: () => ['image_upload', 'file_upload', 'data_select', 'm_data_select', 'org_select', 'm_org_select', 'user_select','m_user_select', 'role_select','m_role_select', 'region_select', 'dic_select', 'm_dic_select', 'company_select','m_company_select', 'gis_select', 'table', 'flow_table', 'editor', 'cascade']
            },
            layoutFields: {
                type: Array,
                default: () => ['grid']
            }
        },
        computed: {
            user() {
                return this.$store.getters.getUserInfo
            },
            advance: function () {
                let enableCompanyPermission = this.user.enableCompanyPermission;
                return this.formTypeItems.advance.filter(function (obj) {
                    if ((obj.type !== 'company_select' || obj.type !== 'm_company_select') || (obj.type === 'company_select' && enableCompanyPermission !== 0) || (obj.type === 'm_company_select' && enableCompanyPermission !== 0)) {
                        return obj;  // 0:基础设置页面将不再显示企业访问权限配置,表单设计页面中的高级控件栏不显示【企业】控件;
                    }
                })
            },
            processAdvance: function () {
                let enableCompanyPermission = this.user.enableCompanyPermission;
                return this.formTypeItems.formProcessAdvance.filter(function (obj) {
                    if ((obj.type !== 'company_select'|| obj.type !== 'm_company_select') || (obj.type === 'company_select' && enableCompanyPermission !== 0) || (obj.type === 'm_company_select' && enableCompanyPermission !== 0)) {
                        return obj; // // 0:基础设置页面将不再显示企业访问权限配置,表单设计页面中的高级控件栏不显示【企业】控件;
                    }
                })
            },
        },
        data() {
            return {
                formTypeItems: formTypeItems
            }
        },
        methods: {
            clickMove() {
                return true
            }
        }
    }
</script>

<style scoped lang="scss">
    .form-type {
        height: 100%;
        padding: 10px;
        overflow: auto;
        
        
        
        .components-list {
            padding: 8px 0;
            width: 100%;
            height: 100%;
            
            .widget-cate {
                padding: 8px 12px;
                font-size: 13px;
            }
            
            ul {
                position: relative;
                overflow: hidden;
                padding: 0 10px 10px;
                margin: 0;
            }
            
            .form-edit-widget-label {
                font-size: 12px;
                display: block;
                width: 48%;
                line-height: 26px;
                position: relative;
                float: left;
                left: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 1%;
                color: #333;
                border: 1px solid #F4F6FC;
                
                &:hover {
                    color: $primary-color;
                    border: 1px dashed $primary-color;
                }
                
                & > a {
                    display: block;
                    cursor: move;
                    background: #F4F6FC;
                    border: 1px solid #F4F6FC;
                    
                    .icon {
                        margin-right: 6px;
                        margin-left: 8px;
                        font-size: 14px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    
                    span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
            }
        }
        
        .el-row {
            padding: 0 0 10px;
            
            h4 {
                margin-left: 1%;
                font-size: 14px;
                line-height: 2.4;
                color:#fff
            }
            
            ul {
                position: relative;
                overflow: hidden;
                padding: 0 0 10px;
                margin: 0;
            }
            
            .form-edit-widget-label {
                font-size: 12px;
                display: block;
                width: 48%;
                line-height: 26px;
                position: relative;
                float: left;
                left: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 1%;
                color: #fff;
                border: 1px solid #F4F6FC;
                
                &:hover {
                    border: 1px dashed $primary-color;
                    color: #409eff;
                    
                    > a {
                        background-color: #f4f6fc;
                    }
                }
                
                & > a {
                    display: block;
                    cursor: move;
                    background: #0b1532;
                    border: 1px solid #2153d4;
                    
                    .icon {
                        margin-right: 6px;
                        margin-left: 8px;
                        font-size: 14px;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    
                    span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
            }
        }
    }

    /*滚动条里面小方块*/
    .form-type::-webkit-scrollbar-thumb {
        background-color: #fff;
        border-radius: 10px;
    }

    /*滚动条整体样式*/
    .form-type::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    /*滚动条里面轨道*/
    .form-type::-webkit-scrollbar-track {
        background: rgba(77, 86, 133, 0.1);
        border-radius: 10px;
    }
</style>

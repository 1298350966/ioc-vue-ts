import khConfig from "../utils/khConfig";
import {mapConfig} from "@/config";
//配置
const Config = khConfig.instance;
export default {
    basic: [
        {
            type: 'input',
            name: '单行文本',
            icon: 'icon-input',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                dataType: 'string',
                pattern: '',
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                
            },
            comment:"",
        },
        {
            type: 'textarea',
            name: '多行文本',
            icon: 'icon-textarea',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                disabled: false,
                editDisabled: false,
                pattern: '',
                placeholder: '请输入',
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'text',
            name: '文字',
            icon: 'icon-text',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '这是一段文字'
            },
            comment:"",
        },
        {
            type: 'input_mobile',
            name: '手机号码',
            icon: 'icon-input-mobile',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                pattern: "/^1([3-9])\\d{9}$/",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'input_tel',
            name: '电话号码',
            icon: 'icon-input-tel',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                pattern: "/^0\\d{2,3}-?\\d{7,8}$/",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'input_mail',
            name: '邮箱',
            icon: 'icon-input-mail',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                pattern: "/^([a-zA-Z0-9_.\\-])+@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$/",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'input_postal',
            name: '邮政编码',
            icon: 'icon-input-postal',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                pattern: "/^[1-9][0-9]{5}$/",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'input_website',
            name: '网址',
            icon: 'icon-input-website',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                pattern: "/((https|http|ftp|rtsp|mms):\\/\\/)?(([0-9a-zA-Z_!~*'().&=+$%-]+:)?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\\.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+\\.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\\.[a-zA-Z]{2,6})(:[0-9]{1,4})?((\\/?)|(\\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\\/?)/g",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'input_number',
            name: '数字(浮点型)',
            icon: 'icon-input-number',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                pattern: "/^-?\\d+(\\.\\d+)?$/",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                min: 0,
                max: 10,
                enableMinMax:false,
            },
            comment:"",
        },
        {
            type: 'input_int',
            name: '数字(整型)',
            icon: 'icon-input-number',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                pattern: "/^-?\\d+$/",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                min: 0,
                max: 10,
                enableMinMax:false,
            },
            comment:"",
        },
        {
            type: 'input_long',
            name: '数字(长整型)',
            icon: 'icon-input-number',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                pattern: "/^-?\\d+$/",
                placeholder: '请输入',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                min: 0,
                max: 10,
                enableMinMax:false,
            },
            comment:"",
        },
        {
            type: 'number',
            name: '计数器',
            icon: 'icon-number',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                defaultValue: '',
                min: 0,
                max: 10,
                step: 1,
                disabled: false,
                editDisabled: false,
                controlsPosition: '',
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'radio',
            name: '单选框',
            icon: 'icon-radio',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                inline: true,
                defaultValue: '',
                showLabel: false,
                hasControl: false,
                options: [
                    {
                        value: '选项1',
                        label: '选项1',
                        relatedList: []
                    },
                    {
                        value: '选项2',
                        label: '选项2',
                        relatedList: []
                    },
                    {
                        value: '选项3',
                        label: '选项3',
                        relatedList: []
                    }
                ],
                required: false,
                remote: true,
                remoteOptions: [],
                props: {
                    value: 'value',
                    label: 'label'
                },
                remoteCall: '',
                disabled: false,
                editDisabled: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'checkbox',
            name: '多选框',
            icon: 'icon-check-box',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                inline: false,
                defaultValue: [],
                showLabel: false,
                options: [
                    {
                        label: '选项1',
                        value: '选项1'
                    },
                    {
                        label: '选项2',
                        value: '选项2'
                    },
                    {
                        label: '选项3',
                        value: '选项3'
                    }
                ],
                required: false,
                remote: true,
                remoteOptions: [],
                props: {
                    value: 'value',
                    label: 'label'
                },
                remoteCall: '',
                disabled: false,
                editDisabled: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'year',
            name: '年份',
            icon: 'icon-year',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                defaultType: 0,
                readonly: false,
                disabled: false,
                editDisabled: false,
                editable: true,
                clearable: true,
                placeholder: '请选择',
                startPlaceholder: '',
                endPlaceholder: '',
                type: 'year',
                format: 'yyyy',
                timestamp: false,
                required: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'month',
            name: '月份',
            icon: 'icon-month',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                defaultType: 0,
                readonly: false,
                disabled: false,
                editDisabled: false,
                editable: true,
                clearable: true,
                placeholder: '请选择',
                startPlaceholder: '',
                endPlaceholder: '',
                type: 'month',
                format: 'MM',
                timestamp: false,
                required: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'year_month',
            name: '年月份',
            icon: 'icon-month',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                defaultType: 0,
                readonly: false,
                disabled: false,
                editDisabled: false,
                editable: true,
                clearable: true,
                placeholder: '请选择',
                startPlaceholder: '',
                endPlaceholder: '',
                type: 'month',
                format: 'yyyy-MM',
                timestamp: false,
                required: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'date',
            name: '日期',
            icon: 'icon-date',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                defaultType: 0,
                readonly: false,
                disabled: false,
                editDisabled: false,
                editable: true,
                clearable: true,
                placeholder: '请选择',
                startPlaceholder: '',
                endPlaceholder: '',
                type: 'date',
                format: 'yyyy-MM-dd',
                timestamp: false,
                required: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'time',
            name: '时间',
            icon: 'icon-time',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                defaultType: 0,
                readonly: false,
                disabled: false,
                editDisabled: false,
                editable: true,
                clearable: true,
                placeholder: '请选择',
                startPlaceholder: '',
                endPlaceholder: '',
                isRange: false,
                arrowControl: true,
                format: 'HH:mm:ss',
                required: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'datetime',
            name: '日期时间',
            icon: 'icon-datetime',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                defaultType: 0,
                readonly: false,
                disabled: false,
                editDisabled: false,
                editable: true,
                clearable: true,
                placeholder: '请选择',
                startPlaceholder: '',
                endPlaceholder: '',
                format: 'yyyy-MM-dd HH:mm:ss',
                timestamp: false,
                required: false,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'switch',
            name: '开关',
            icon: 'icon-switch',
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: false,
                required: false,
                disabled: false,
                editDisabled: false,
                isControlled: false,
                closeMsg: '已关闭',
                openMsg: '已开启'
            },
            comment:"",
        },
        {
            type: 'multiple_select',
            name: '多选下拉框',
            icon: 'icon-multipleSelect',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                multiple: true,
                disabled: false,
                editDisabled: false,
                clearable: false,
                placeholder: '请选择',
                required: false,
                showLabel: false,
                options: [
                    {
                        label: '下拉框1',
                        value: '下拉框1',
                        relatedList: []
                    },
                    {
                        label: '下拉框2',
                        value: '下拉框2',
                        relatedList: []
                    }, {
                        label: '下拉框3',
                        value: '下拉框3',
                        relatedList: []
                    }
                ],
                remote: true,
                filterable: false,
                remoteOptions: [],
                props: {
                    value: 'value',
                    label: 'label'
                },
                remoteCall: '',
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'select',
            name: '下拉选择框',
            icon: 'icon-select',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                multiple: false,
                disabled: false,
                editDisabled: false,
                clearable: false,
                placeholder: '请选择',
                required: false,
                showLabel: false,
                hasControl: false,
                options: [
                    {
                        label: '下拉框1',
                        value: '下拉框1',
                        relatedList: []
                    },
                    {
                        label: '下拉框2',
                        value: '下拉框2',
                        relatedList: []
                    }, {
                        label: '下拉框3',
                        value: '下拉框3',
                        relatedList: []
                    }
                ],
                remote: true,
                filterable: false,
                remoteOptions: [],
                props: {
                    value: 'value',
                    label: 'label'
                },
                remoteCall: '',
                isControlled: false,

            },
            comment:"",
        },
    ],

    advance: [
        {
            type: 'image_upload',
            name: '图片',
            icon: 'icon-imageUpload',
            options: {
                action: Config.api.fileUpload,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                fileList: [],
                multiple: false,
                // 最大上传数
                length: 3,
                maxFileSize: 5,
                isControlled: false,
                presetImgs:"",
            },
            comment:"",
        },
        {
            type: 'file_upload',
            name: '附件',
            icon: 'icon-fileUpload',
            options: {
                action: Config.api.fileUpload,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                fileList: [],
                multiple: false,
                maxFileSize: 20,
                // 最大上传数
                length: 3,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'signature',
            name: '签名',
            icon: 'icon-imageUpload',
            options: {
                action: Config.api.fileUpload,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                fileList: [],
                multiple: false,
                // 最大上传数
                length: 3,
                maxFileSize: 1,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'm_data_ref',
            name: '数据引用',
            icon: 'icon-data-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                dsConf: {
                    formId: "",
                    formName: "",
                    key: "",
                    subKey: "",
                    mapping: {},
                    columns: [],
                    condFilters: [],
                    defaultSelect: false,
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            }
        },
        {
            type: 'data_select',
            name: '通用数据',
            icon: 'icon-data-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "选择",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                    source: {
                        datasource: "", // 预留字段,关联数据源
                        table: "",
                        columns: [] // 列表选择展示的列
                    }
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                method:"GET",
                postType:"json",
                displayModel: "table", // 数据选择页面的展现形式
                dataSelectType:"0", //0 表单数据 1 接口数据
                remoteDataPoint:"datas", // 返回数据节点
                urlParams:[],
            },
            comment:"",
        },
        {
            type: 'm_data_select',
            name: '通用数据(多选)',
            icon: 'icon-data-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "选择",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                    source: {
                        datasource: "", // 预留字段,关联数据源
                        table: "",
                        columns: [] // 列表选择展示的列
                    }
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'org_select',
            name: '组织机构',
            icon: 'icon-org-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "组织机构",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_org_select',
            name: '组织机构(多选)',
            icon: 'icon-org-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "组织机构",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'user_select',
            name: '用户',
            icon: 'icon-user-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "用户",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                defaultCurrentUser: false,
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_user_select',
            name: '用户(多选)',
            icon: 'icon-user-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "用户",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'role_select',
            name: '角色',
            icon: 'icon-role-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "角色",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_role_select',
            name: '角色(多选)',
            icon: 'icon-role-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "角色",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'company_select',
            name: '企业',
            icon: 'icon-company-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "企业",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_company_select',
            name: '企业(多选)',
            icon: 'icon-company-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "企业",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'dic_select',
            name: '数据字典',
            icon: 'icon-dic-select',
            typeCode: "", // 数据字典类型
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "数据字典",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                defaultValue: '',
                required: false,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_dic_select',
            name: '数据字典(多选)',
            icon: 'icon-dic-select',
            typeCode: "", // 数据字典类型
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "数据字典",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                defaultValue: '',
                required: false,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'gis_select',
            name: 'Gis定位',
            icon: 'icon-gis-select',
            options: {
                width: '80%',
                defaultValue: '',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                pattern: '',
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                zoom: 13,
                lat: mapConfig.gisInitLat,
                lnt: mapConfig.gisInitLng,
                city: "南昌",
                gisType: "高德",
                allowLocation: false,
                positions: []
            },
            modelExt: {
                lat: "lat",
                lnt: "lng",
                address: "address",
                latName: "经度",
                lntName: "纬度",
                addressName: "详细地址",
            },
            comment:"",
        },
        {
            type: 'region_select',
            name: '行政区划',
            icon: 'icon-region-select',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                disabled: false,
                editDisabled: false,
                required: false,
                pattern: '',
                placeholder: '',
                isControlled: false,
            },
            modelExt: {
                province: "province",
                provinceName: "省份",
                provinceCode: "province_code",
                provinceCodeName: "省份代码",
                city: "city",
                cityName: "市",
                cityCode: "city_code",
                cityCodeName: "市代码",
                area: "area",
                areaName: "区县",
                areaCode: "area_code",
                areaCodeName: "县区代码"
            },
            comment:"",
        },
        {
            type: 'current_user',
            name: '当前用户',
            icon: 'icon-user-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "用户",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                multiple: false,      // 是否支持多选
                remoteUrl: "",  // 数据控件后台访问接口,
            },
            comment:"",
        },
        {
            type: "table",
            icon: "icon-table",
            options: {
                isControlled: false,
                gutter: 0,
                justify: 'start',
                align: 'top',
                addModel: "single",
                dsConf: {
                    formId: "",
                    formName: "",
                    subKey: '',
                    mapping: [],
                    columns: [],
                    condFilters: [],
                    defaultSelect: false
                }
            },
            tableColumns: [],
            name: "子表单",
            key: "",
            model: "",
            comment:"",
        },
        {
            name: "计算公式",
            icon: "icon-number",
            options: {
                isControlled: false,
                defaultValue: "",
                dateType: "number",
                width: "40%",
                pattern: "",
                disabled: false,
                editDisabled: false,
                showFields: false,
                placeholder: "",
                editShowFields: false,
                required: false,
                formula: {
                    type: "number", //number/year/year_month/date/datetime
                    exp:[],
                    decimal: 2 //$decimal: "小数点位数，只有类型为number需要设置",
                }
            },
            model: "",
            rules: [],
            type: "calculate_formula",
            key: "",
            show: true
        }
    ],

    formProcessAdvance: [
        {
            type: 'image_upload',
            name: '图片',
            icon: 'icon-imageUpload',
            options: {
                action: Config.api.fileUpload,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                fileList: [],
                multiple: false,
                // 最大上传数
                length: 3,
                maxFileSize: 1,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'file_upload',
            name: '附件',
            icon: 'icon-fileUpload',
            options: {
                action: Config.api.fileUpload,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                fileList: [],
                multiple: false,
                maxFileSize: 10,
                // 最大上传数
                length: 3,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'signature',
            name: '签名',
            icon: 'icon-imageUpload',
            options: {
                action: Config.api.fileUpload,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                fileList: [],
                multiple: false,
                // 最大上传数
                length: 3,
                maxFileSize: 1,
                isControlled: false,
            },
            comment:"",
        },
        {
            type: 'm_data_ref',
            name: '数据引用',
            icon: 'icon-data-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                dsConf: {
                    formId: "",
                    formName: "",
                    key: "",
                    subKey: "",
                    mapping: {},
                    columns: [],
                    condFilters: [],
                    defaultSelect: false
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'data_select',
            name: '通用数据',
            icon: 'icon-data-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "选择",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                    source: {
                        datasource: "", // 预留字段,关联数据源
                        table: "",
                        columns: [] // 列表选择展示的列
                    }
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table", // 数据选择页面的展现形式
                urlParams:[],
            },
            comment:"",
        },
        {
            type: 'm_data_select',
            name: '通用数据（多选）',
            icon: 'icon-data-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "选择",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                    source: {
                        datasource: "", // 预留字段,关联数据源
                        table: "",
                        columns: [] // 列表选择展示的列
                    }
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'org_select',
            name: '组织机构',
            icon: 'icon-org-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "组织机构",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_org_select',
            name: '组织机构(多选)',
            icon: 'icon-org-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "组织机构",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'user_select',
            name: '用户',
            icon: 'icon-user-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "用户",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_user_select',
            name: '用户(多选)',
            icon: 'icon-user-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "用户",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },

        {
            type: 'role_select',
            name: '角色',
            icon: 'icon-role-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "角色",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_role_select',
            name: '角色(多选)',
            icon: 'icon-role-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "角色",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'company_select',
            name: '企业',
            icon: 'icon-company-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "企业",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_company_select',
            name: '企业(多选)',
            icon: 'icon-company-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "企业",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "table" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'dic_select',
            name: '数据字典',
            icon: 'icon-dic-select',
            typeCode: "", // 数据字典类型
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "数据字典",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                defaultValue: '',
                required: false,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'm_dic_select',
            name: '数据字典(多选)',
            icon: 'icon-dic-select',
            typeCode: "", // 数据字典类型
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "数据字典",  // 数据选择页面标题设置:用户选择
            options: {
                width: '40%',
                defaultValue: '',
                required: false,
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                maps: {
                    key: "",   // 映射源数据的主键 (组织架构ID:id)
                    name: "",  // 映射源数据字段用于显示 (组织架构名称:orgName)
                    title: "",  // 数据选择页面标题设置:用户选择
                    mapping: [],
                },
                multiple: false,      // 是否支持多选
                props: {
                    label: "",      // 对应Vue的Tree组件的设置,对应于maps.name
                    children: 'zones'
                },
                remoteUrl: "",  // 数据控件后台访问接口,
                displayModel: "tree" // 数据选择页面的展现形式
            },
            comment:"",
        },
        {
            type: 'gis_select',
            name: 'Gis定位',
            icon: 'icon-gis-select',
            options: {
                width: '80%',
                defaultValue: '',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                required: false,
                pattern: '',
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                zoom: 13,
                lat: 28.683016,
                lnt: 115.857963,
                city: "南昌",
                gisType: "高德",
                allowLocation: false,
                positions: []
            },
            modelExt: {
                lat: "lat",
                lnt: "lng",
                address: "address",
                latName: "经度",
                lntName: "纬度",
                addressName: "详细地址",
            },
            comment:"",
        },
        {
            type: 'region_select',
            name: '行政区划',
            icon: 'icon-region-select',
            options: {
                width: '40%',
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                defaultValue: '',
                disabled: false,
                editDisabled: false,
                required: false,
                pattern: '',
                placeholder: '请选择',
                isControlled: false,
            },
            modelExt: {
                province: "province",
                provinceName: "省份",
                provinceCode: "province_code",
                provinceCodeName: "省份代码",
                city: "city",
                cityName: "市",
                cityCode: "city_code",
                cityCodeName: "市代码",
                area: "area",
                areaName: "区县",
                areaCode: "area_code",
                areaCodeName: "县区代码"
            },
            comment:"",
        },
        {
            type: 'current_user',
            name: '当前用户',
            icon: 'icon-user-select',
            key_name: "", // 数据控件隐藏域key对应数据库的备注
            label_name: "", //  数据控件显示Label信息对应的表结构字段备注信息
            label_model: "", // 数据控件显示Label信息对应的表结构字段
            title: "用户",  // 数据选择页面标题设置:用户选择
            options: {
                showFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                editShowFields: false, // 表单新增时是否显示字段,是显示,否隐藏;
                width: '40%',
                defaultValue: '',
                required: false,
                placeholder: '请选择',
                disabled: false,
                editDisabled: false,
                isControlled: false,
                multiple: false,      // 是否支持多选
                remoteUrl: "",  // 数据控件后台访问接口,
            },
            comment:"",
        },
        {
            type: "flow_table",
            icon: "icon-flow-table",
            options: {
                isControlled: false,
                gutter: 0,
                justify: 'start',
                align: 'top'
            },
            tableColumns: [],
            name: "审批填报项",
            key: "",
            model: "",
            comment:"",
        },
        {
            type: "table",
            icon: "icon-table",
            options: {
                isControlled: false,
                gutter: 0,
                justify: 'start',
                align: 'top',
                addModel: "batch"
            },
            tableColumns: [],
            name: "子表单",
            key: "",
            model: "",
            comment:"",
        },
        {
            name: "计算公式",
            icon: "icon-number",
            options: {
                isControlled: false,
                defaultValue: "",
                dateType: "number",
                width: "40%",
                pattern: "",
                disabled: false,
                editDisabled: false,
                showFields: false,
                placeholder: "",
                editShowFields: false,
                required: false,
                formula: {
                    type: "number", //number/year/year_month/date/datetime
                    exp:[],
                    decimal: 2 //$decimal: "小数点位数，只有类型为number需要设置",
                }
            },
            model: "",
            rules: [],
            type: "calculate_formula",
            key: "",
            show: true,
            comment:"",
        }
    ],

    layout: [
        {
            type: 'grid',
            name: '栅格布局',
            icon: 'icon-grid',
            columns: [
                {
                    span: 12,
                    list: []
                },
                {
                    span: 12,
                    list: []
                }
            ],
            options: {
                gutter: 0,
                justify: 'start',
                align: 'top'
            },
            comment:"",
        }
    ]
};

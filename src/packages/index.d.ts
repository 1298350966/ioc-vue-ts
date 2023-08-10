import { BaseEvent, EventLife } from '@/enums/eventEnum'
import type { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import type { RequestConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { EventConfigFiltersType } from "@/components/Pages/FilterConfig/type";
export enum ChartFrameEnum {
  // 支持 dataset 的 echarts 框架
  ECHARTS = 'echarts',
  // UI 组件框架
  NAIVE_UI = 'naiveUI',
  ELEMENT_PLUS = 'elementPlus',
  // 自定义带数据组件
  COMMON = 'common',
  // 无数据变更
  STATIC = 'static',

}

// 组件配置
export type ConfigType = {
  key: string
  chartKey: string
  conKey: string
  title: string
  category: string
  categoryName: string
  package: string
  chartFrame?: ChartFrameEnum
  image: string
}

// 数据请求
interface requestConfig {
  request: RequestConfigType
}

// Echarts 数据类型
interface EchartsDataType {
  dimensions: string[]
  source: any[]
}

// 组件状态
export interface StatusType {
  lock: boolean
  hide: boolean
}

// 滤镜/变换枚举
export enum FilterEnum {
  // 是否启用
  FILTERS_SHOW = 'filterShow',

  // 透明度
  OPACITY = 'opacity',
  // 饱和度
  SATURATE = 'saturate',
  // 对比度
  CONTRAST = 'contrast',
  // 色相
  HUE_ROTATE = 'hueRotate',
  // 亮度
  BRIGHTNESS = 'brightness',

  // 旋转
  ROTATE_Z = 'rotateZ',
  ROTATE_X = 'rotateX',
  ROTATE_Y = 'rotateY',

  // 倾斜
  SKEW_X = 'skewX',
  SKEW_Y = 'skewY',

  // 混合模式
  BLEND_MODE = 'blendMode'
}

export const BlendModeEnumList = [
  { label: '正常', value: 'normal' },
  { label: '正片叠底', value: 'multiply' },
  { label: '叠加', value: 'overlay' },
  { label: '滤色', value: 'screen' },
  { label: '变暗', value: 'darken' },
  { label: '变亮', value: 'lighten' },
  { label: '颜色减淡', value: 'color-dodge' },
  { label: '颜色加深', value: 'color-burn;' },
  { label: '强光', value: 'hard-light' },
  { label: '柔光', value: 'soft-light' },
  { label: '差值', value: 'difference' },
  { label: '排除', value: 'exclusion' },
  { label: '色相', value: 'hue' },
  { label: '饱和度', value: 'saturation' },
  { label: '颜色', value: 'color' },
  { label: '亮度', value: 'luminosity' }
]

// 组件实例类
export interface PublicConfigType {
  id: string
  isGroup: boolean
  attr: { x: number; y: number; w: number; h: number; zIndex: number; offsetX: number; offsetY: number }
  styles: {
    [FilterEnum.FILTERS_SHOW]: boolean
    [FilterEnum.OPACITY]: number
    [FilterEnum.SATURATE]: number
    [FilterEnum.CONTRAST]: number
    [FilterEnum.HUE_ROTATE]: number
    [FilterEnum.BRIGHTNESS]: number

    [FilterEnum.ROTATE_Z]: number
    [FilterEnum.ROTATE_X]: number
    [FilterEnum.ROTATE_Y]: number

    [FilterEnum.SKEW_X]: number
    [FilterEnum.SKEW_Y]: number
    [FilterEnum.BLEND_MODE]: string

    // 动画
    animations: string[]
    backgroundColor:string
    paddingX:number
    paddingY:number
  }
  filter?: string
  filterNode?: string
  dataBinding:{
    codeMode:string
    configMode:{
      targetId:string
      value:string
    }[] 
  }
  status: StatusType
  events: {
    configEvents: ConfigEventsType
    baseEvent: {
      [K:string]: string
    },
    advancedEvents: {
      [K:string]: string
    },
    componentEvents:{
      [K:string]: string
    },
  }
}
export interface ConfigEventsType {
  baseEvent?: EventConfigType[]
  eChartsEvents?: EventConfigType[],
  componentEvents?: EventConfigType[],
  [T: string]: EventConfigType[],
}
export interface CreateComponentType extends PublicConfigType, requestConfig {
  key: string
  chartConfig: ConfigType
  option: GlobalThemeJsonType,
  data?: any
  dataMapping?: DataMappingType | any,
  eChartsEventVars?: {
    label: string,
    value: string
  }[],
  [T: string]: any
}
export interface DataMappingType {
  classAxis?: any[],
  colorAxis?: any[],
  valueAxis?: any[],
  drillingAxis?: any[]
  typeList?: any[]
  xAxis?: any[]
  yAxis?: any[]
  sizeAxis?: any[]
  [T: string]: any[]
}

export interface GlobalVarType {
  name: string;
  key: string;
  entitys: {
    key: string;
    name: string;
    type: string;
    value: string;
  }[];
}

// 组件成组实例类
export interface CreateComponentGroupType extends CreateComponentType {
  groupList: CreateComponentType[]
}

// 获取组件实例类中某个key对应value类型的方法
export type PickCreateComponentType<T extends keyof CreateComponentType> = Pick<CreateComponentType, T>[T]

// 包分类枚举
export enum PackagesCategoryEnum {
  CHARTS = 'Charts',
  TABLES = 'Tables',
  INFORMATIONS = 'Informations',
  DECORATES = 'Decorates',
  FORMS = 'Forms',
  BUSINESS = "Business",
  CUSTOM = "Custom"
}

// 包分类名称
export enum PackagesCategoryName {
  CHARTS = '图表',
  TABLES = '列表',
  INFORMATIONS = '信息',
  DECORATES = '小组件',
  FORMS = '表单',
  BUSINESS = '业务',
  CUSTOM = "自定义"
}

// 获取组件
export enum FetchComFlagType {
  VIEW,
  CONFIG
}

// 图表包类型
export type PackagesType = {
  [PackagesCategoryEnum.CHARTS]: ConfigType[]
  [PackagesCategoryEnum.INFORMATIONS]: ConfigType[]
  [PackagesCategoryEnum.TABLES]: ConfigType[]
  [PackagesCategoryEnum.DECORATES]: ConfigType[]
  [PackagesCategoryEnum.FORMS]: ConfigType[]
  [PackagesCategoryEnum.CUSTOM]: ConfigType[]
}


export interface GlobalDialogType {
  component: string,
  name: string,
  show: boolean,
  attrs: {
    title: string
    width: string | number
    fullscreen: boolean,
    top: string,
    modal: boolean
    draggable: boolean
  },
  body: {
    height: String,
    type: string,
    component?: any
    iframe?: any
  }
}


export interface EventConfigType {
  name?: string,
  type: string,
  trigger: EventTriggerConfigType[]
  filters?: EventConfigFiltersType
}


export enum FiltersEnum{
  OR = "||",
  AND = "&&"
} 


export interface EventTriggerConfigType {
  type: string;
  targetId: string;
  updateValue?:any;
  [T: string]: any
}


export interface EventType  {
  type?:string
  key?: string;
  name: string;
  paramsName: string[];
  vars: {
    label: string;
    value: string;
    type?:string
  }[];
  setVars?: (CreateComponentType) => void
  [T: string]:any
}

export interface EventsType {
  [T: string]: EventType
}

export interface EventsMapType {
  [T: string]: EventsType
}


// 地图组件覆盖物组实例类
export interface CoverGroupType{
  id: any;
  name: string;
  visible: boolean;
  type: string | coverEnum;
  options: any;
  dataset?: any;
  request: RequestConfigType;
  events: {
      configEvents: {
        componentEvents: any[];
      };
      codeEvents: {
        baseEvent:{
          [T:string]:string
        }
      };
  };
  InfoWindow?:{
    eventType:string,
    enable: boolean,
    options:any
  }
  data: any[];
  dataKeyList?:any[],
  dataMapping?:{
    [T:string]:{
      key:string,
      label: string,
    }
  },
  filterNode?:string
  filter?: string,
  dataBinding:{
    codeMode:string
    configMode:{
      targetId:string
      value:string
    }[] 
  }
}
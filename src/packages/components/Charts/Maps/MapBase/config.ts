import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { MapBaseConfig } from './index'
import { chartInitConfig } from '@/settings/designSetting'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import dataJson from './data.json'
import { cloneDeep } from 'lodash'

export const includes = []

export const option = {
  // dataset: dataJson,
  mapRegion: {
    adcode: 'china',
    showHainanIsLands: true
  },
  tooltip: {
    show: true,
    trigger: 'item'
  },
  visualMap: {
    show: true,
    orient: 'vertical',
    pieces: [
      { gte: 1000, label: '>1000' }, // 不指定 max，表示 max 为无限大（Infinity）。
      { gte: 600, lte: 999, label: '600-999' },
      { gte: 200, lte: 599, label: '200-599' },
      { gte: 50, lte: 199, label: '49-199' },
      { gte: 10, lte: 49, label: '10-49' },
      { lte: 9, label: '<9' } // 不指定 min，表示 min 为无限大（-Infinity）。
    ],
    inRange: {
      // 渐变颜色，从小到大
      color: ['#c3d7df', '#5cb3cc', '#8abcd1', '#66a9c9', '#2f90b9', '#1781b5']
    },
    textStyle: {
      color: '#fff'
    }
  },
  geo: {
    show: false,
    type: 'map',
    roam: false,
    map: 'china',
    selectedMode: false, //是否允许选中多个区域
    zoom: 1
  },
  series: [
    {
      name: '',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      symbolSize: 4,
      legendHoverLink: true,
      showEffectOn: 'render',
      rippleEffect: {
        scale: 6,
        color: '#FFFFFF',
        brushType: 'fill'
      },
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0,0,0,.6)',
        borderColor: 'rgba(147, 235, 248, .8)',
        textStyle: {
          color: '#FFF'
        }
      },
      label: {
        formatter: '{b}',
        fontSize: 11,
        offset: [0, 2],
        position: 'bottom',
        textBorderColor: '#fff',
        textShadowColor: '#000',
        textShadowBlur: 10,
        textBorderWidth: 0,
        color: '#FFF',
        show: true
      },
      itemStyle: {
        color: '#FFFFFF',
        borderColor: 'rgba(225,255,255,2)',
        borderWidth: 4,
        shadowColor: '#E1FFFF',
        shadowBlur: 10
      },
      data: []
    },
    {
      name: '区域',
      type: 'map',
      map: 'china',
      data: [],
      selectedMode: false,
      zoom: 1,
      geoIndex: 1,
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0,0,0,.6)',
        borderColor: 'rgba(147, 235, 248, .8)',
        textStyle: {
          color: '#FFF'
        }
      },
      label: {
        show: false
      },
      emphasis: {
        disabled: false,
        label: {
          color: '#fffFFF'
        },
        itemStyle: {
          areaColor: '#389BB7',
          shadowColor: '#389BB7',
          borderWidth: 1
        }
      },
      itemStyle: {
        borderColor: '#93EBF8',
        borderWidth: 1,
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
            }
          ],
          globalCoord: false
        },
        shadowColor: '#80D9F842',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10
      }
    }
  ]
}

//组件基础事件类型
export enum BaseEventEnum {
  // 单击
  CLICK = 'click',
  // 鼠标进入
  MOUSE_ENTER = 'mouseenter',
  // 鼠标移出
  MOUSE_LEAVE = 'mouseleave',
}

 let eChartsEventVars = [
  {
    label: "系列名称",
    value: '${e.seriesName}',
  },
  {
    label: "名称",
    value: '${e.name}',
  },
  {
    label: "经纬度",
    value: '${e.value}',
  }
]

//事件
export const Events: EventsType = {
  [BaseEventEnum.CLICK]: {
    key: BaseEventEnum.CLICK,
    name: "单击",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eChartsEventVars,
  },
  [BaseEventEnum.MOUSE_ENTER]: {
    key: BaseEventEnum.MOUSE_ENTER,
    name: "鼠标进入",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eChartsEventVars,
  },
  [BaseEventEnum.MOUSE_LEAVE]: {
    key: BaseEventEnum.MOUSE_LEAVE,
    name: "鼠标移出",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eChartsEventVars,
  },
}


export const MapDefaultConfig = { ...option }
export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = MapBaseConfig.key
  public attr = { ...chartInitConfig, w: 750, h: 800, zIndex: -1 }
  public chartConfig = MapBaseConfig
  public option = echartOptionProfixHandle(option, includes)
  public data = cloneDeep(dataJson)
  public eChartsEventVars = [
    {
      label: "系列名称",
      value: '${e.seriesName}',
    },
    {
      label: "名称",
      value: '${e.name}',
    },
    {
      label: "经纬度",
      value: '${e.value}',
    }
  ]
  public dataMapping = [
    { 
      key:"point",
      name:"点维度", 
      column:"point",
      children:[
        {
          key:"name",
          name:"点名称",
          column:"name"
        },
        {
          key:"lng",
          name:"经度",
          column:"lng"
        },
        {
          key:"lat",
          name:"纬度",
          column:"lat"
        },
        {
          key:"value",
          name:"值",
          column:"value"
        }
      ]
    },
    {
      key:"map",
      name:"省维度",
      column:"map",
      children:[
        {
          key:"name",
          name:"省名称",
          column:"name"
        },
        {
          key:"value",
          name:"值",
          column:"value"
        }
      ]
    }
  ]
}

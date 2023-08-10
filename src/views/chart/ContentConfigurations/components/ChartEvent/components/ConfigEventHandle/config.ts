import { EChartEventTriggerType } from "./type";

export const eventOptions = [
  {
    label: "单击",
    value: "click",
  },
  {
    label: "双击",
    value: "dblclick",
  },
  {
    label: "鼠标进入",
    value: "mouseenter",
  },
  {
    label: "鼠标移出",
    value: "mouseleave",
  },
];

export const eventTypeOptions = [
  {
    label: "弹窗",
    value: "globalDialog",
  },
  {
    label: "组件",
    value: "componentList",
  },
  {
    label: "方法",
    value: "globalFunction",
  },
];

export const eChartsEventOptions = [
  {
    label: "单击",
    value: "click",
  },
  {
    label: "鼠标进入",
    value: "mouseenter",
  },
  {
    label: "鼠标移出",
    value: "mouseleave",
  }
];


export const eChartEventTriggerConfig: EChartEventTriggerType = {
  type: "globalDialog",
  targetId: '',
  updateValue: null,
}
// componentListUpdate: {
//   "request.requestParams.Header": [],
//     "request.requestParams.Params": [],
//       "request.requestParams.Body.form-data": [],
//         "request.requestParams.Body.json": [],
//           "request.requestParams.Body.x-www-form-urlencoded": []
// },
// globalDialogUpdate: {
//   'body.attrs': [],
//     show: null,
//       attrs: null
// }
export const componentListUpdate = {
  "request.requestParams.Header": [],
  "request.requestParams.Params": [],
  "request.requestParams.Body.form-data": [],
  "request.requestParams.Body.json": [],
  "request.requestParams.Body.x-www-form-urlencoded": [],
  "data":""
}



export const globalDialogUpdate = {
  'body.attrs': [],
  show: null,
  attrs: null
}
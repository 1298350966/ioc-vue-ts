export interface EChartEventTriggerType {
  type: string;
  targetId: string;
  componentListUpdate?: {
    "request.requestParams.Header": any[],
    "request.requestParams.Params": any[],
    "request.requestParams.Body.form-data": any[],
    "request.requestParams.Body.json": any[],
    "request.requestParams.Body.x-www-form-urlencoded": any[],
    [T: string]: any[]
  },
  globalDialogUpdate?: {
    'body.attrs': any[],
    attrs: any,
    show: any,
    [T: string]: any[]
  }
  [T: string]: any
}
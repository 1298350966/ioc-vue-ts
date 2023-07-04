interface Window {
  $loading: any
  $message: any
  $dialog: any
  // 语言
  $t: any
  $vue: any
  // 键盘按键记录
  $KeyboardActive?: { [T: string]: boolean }
  onKeySpacePressHold?: Function

  // 编辑 JSON 的存储对象
  opener: any
  // 天地图
  T: any,
  TMapIns: any
  // 高德地图
  AMap: any,
  AMapIns: any
  // 百度地图
  BMapGL: any 
}

declare type Recordable<T = any> = Record<string, T>
declare module 'v-contextmenu';
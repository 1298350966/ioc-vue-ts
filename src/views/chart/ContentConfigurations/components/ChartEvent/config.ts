import { BaseEvent, EventLife } from "@/enums/eventEnum";
export const EventTypeName = {
  [BaseEvent.ON_CLICK]: "单击",
  [BaseEvent.ON_DBL_CLICK]: "双击",
  [BaseEvent.ON_MOUSE_ENTER]: "鼠标进入",
  [BaseEvent.ON_MOUSE_LEAVE]: "鼠标移出",
};


export const EventLifeName = {
  [EventLife.VNODE_BEFORE_MOUNT]: '渲染之前',
  [EventLife.VNODE_MOUNTED]: '渲染之后'
}

export const EventLifeTip = {
  [EventLife.VNODE_BEFORE_MOUNT]: '此时组件 DOM 还未存在',
  [EventLife.VNODE_MOUNTED]: '此时组件 DOM 已经存在'
}

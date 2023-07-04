import { VNodeChild } from "vue"

export interface ContextmenuItem {
  key?: string
  icon?:() => VNodeChild,
  label?: string
  subText?: string
  divider?: boolean
  disable?: boolean
  show?: boolean
  hidden?: boolean
  children?: ContextmenuItem[]
  handler?: (el: HTMLElement) => void
}



export interface Axis {
  x: number
  y: number
}
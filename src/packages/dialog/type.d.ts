export interface GlobalDialogType {
  id:string,
  component:any,
  name:string,
  show:boolean,
  attrs :{
    title:string
    width:string | number
    fullscreen:boolean,
    top:string,
    modal:boolean
    draggable:boolean
  },
  body:{
    height:String,
    type:string,
    attrs:any,
    component?:{
      is:string,
      [string]:any
    }
    iframe?:{
      src:string,
      [string]:any
    }
  }
}
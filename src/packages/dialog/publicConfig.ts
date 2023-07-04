import { GlobalDialogType } from "./type";

export const publicOption: GlobalDialogType = {
  id: "",
  name: "",
  component: "darkDialog",
  show: false,
  attrs: {
    title: "",
    width: "60%",
    fullscreen: false,
    top: "15vh",
    modal: true,
    draggable: false
  },
  body: {
    height: "60vh",
    type: "component",  //component iframe
    attrs: {},
    component: {
      is: "",
    },
    iframe: {
      src: "",
    },
  }
}
import { App, Component } from "vue";
import { useIcon } from "./icon"
// import "element-plus/theme-chalk/src/index.scss"
// import 'element-plus/theme-chalk/dark/css-vars.css'
// import 'element-plus/theme-chalk/src/message.scss'
// import 'element-plus/theme-chalk/src/notification.scss'
// import 'element-plus/theme-chalk/src/message-box.scss'

// import "@/style/element-plus/var.scss"
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import {
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElCol,
  ElRow,
  ElSpace,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElAvatar,
  ElEmpty,
  ElCollapse,
  ElCollapseItem,
  ElTable,
  ElTableColumn,
  ElLink,
  ElColorPicker,
  ElSelect,
  ElOption,
  ElTimeline,
  ElTimelineItem,
  ElResult,
  ElSteps,
  ElStep,
  ElTree,
  ElTreeV2,
  ElPopconfirm,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElImage,
  ElUpload,
  ElAutocomplete,
  ElCascader,
  ElInputNumber,
  ElSlider,
  ElTimePicker,
  // 指令
  ElLoading,
  ElInfiniteScroll,
  //提示
  ElMessageBox,
  ElMessage,
  ElNotification 
} from "element-plus";


// Directives
const plugins = [ElLoading, ElInfiniteScroll];

const components = [
  ElTag,
  ElAffix,
  ElSkeleton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElScrollbar,
  ElSubMenu,
  ElButton,
  ElCol,
  ElRow,
  ElSpace,
  ElDivider,
  ElCard,
  ElDropdown,
  ElDialog,
  ElMenu,
  ElMenuItem,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElForm,
  ElFormItem,
  ElPopover,
  ElPopper,
  ElTooltip,
  ElDrawer,
  ElPagination,
  ElAlert,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElBacktop,
  ElSwitch,
  ElBadge,
  ElTabs,
  ElTabPane,
  ElAvatar,
  ElEmpty,
  ElCollapse,
  ElCollapseItem,
  ElTree,
  ElTreeV2,
  ElPopconfirm,
  ElCheckbox,
  ElCheckboxGroup,
  ElTable,
  ElTableColumn,
  ElLink,
  ElColorPicker,
  ElSelect,
  ElOption,
  ElTimeline,
  ElTimelineItem,
  ElResult,
  ElSteps,
  ElStep,
  ElDatePicker,
  ElImage,
  ElUpload,
  ElAutocomplete,
  ElCascader,
  ElInputNumber,
  ElSlider,
  ElTimePicker
];

export function useElMessage(app: App) {
   app.config.globalProperties.$message = ElMessage
   window["$message"] = ElMessage
}

export function useMessageBox(app: App){
  app.config.globalProperties.$confirm = ElMessageBox.confirm
  app.config.globalProperties.$alert = ElMessageBox.alert
  app.config.globalProperties.$prompt = ElMessageBox.prompt
  window["$confirm"] = ElMessageBox.confirm
  window["$alert"] = ElMessageBox.alert
  window["$prompt"] = ElMessageBox.prompt

}
export function useElNotification(app: App) {
   app.config.globalProperties.$notify = ElNotification
}
 
export function setDarkClass(){
  document.querySelector("html").classList.add("dark")
  AddCss('element-plus/theme-chalk/dark/css-vars.css')
}

export function AddCss(URL){
  var oHead = document.getElementsByTagName('HEAD').item(0);
  var addheadfile
  addheadfile= document.createElement("link");
  addheadfile.type = "text/css";
  addheadfile.rel="stylesheet";
  addheadfile.rev = "stylesheet";
  addheadfile.media = "screen";
  addheadfile.href=URL;
  oHead.appendChild( addheadfile);
}
export function useElementPlus(app: App) {  
  // 注册组件
  components.forEach((component: Component) => {
    app.component(component.name, component);
  });
  // 注册指令
  plugins.forEach(plugin => {
    app.use(plugin);
  });
  //提示
  useElMessage(app)
  useMessageBox(app)
  useElNotification(app)
  // 注册图标
  useIcon(app)
}


export function useElementPlusGlobal(app: App) { 
  // 注册指令
  plugins.forEach(plugin => {
    app.use(plugin);
  }); 
  //提示
  useElMessage(app)
  useMessageBox(app)
  useElNotification(app)
  // 注册图标
  useIcon(app)
}

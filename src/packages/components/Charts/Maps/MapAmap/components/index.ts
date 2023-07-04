// import coverGroup from "./coverGroup/index.vue";
// import InfoWindow from "./InfoWindow.vue";
// import controlGroup from "./controlGroup/index.vue";
const coverGroup = defineAsyncComponent(()=> import("./coverGroup/index.vue"))
const InfoWindow = defineAsyncComponent(()=> import("./InfoWindow.vue"))
const controlGroup = defineAsyncComponent(()=> import("./controlGroup/index.vue"))
export {
  coverGroup,
  InfoWindow,
  controlGroup
}
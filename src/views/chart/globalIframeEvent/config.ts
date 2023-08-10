export const propsFunConfig = {
  key: "change",
  name: "值改变",
  paramsName: ["newVal", "oldVal", 'rootConfig'],
  vars: [
    {label:"新值",value:"${newVal}"},
    {label:"旧值",value:"${oldVal}"},
  ],
}
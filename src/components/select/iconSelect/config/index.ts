const imgs = import.meta.glob("@static/image/**")
const imgsClass:{
  [T:string]:{
      name: string;
      src: string;
      type: string;
  }[]
} = {}
export const imgList = Object.keys(imgs).map(key => {
  let list = key.split("/");
  let src = import.meta.env.BASE_URL +   key.replace(/^\/public/,"")
  let name =  list[list.length - 1]
  let type = list[list.length - 3] == "image" ? list[list.length - 2] : list[list.length - 3]
  if(!imgsClass[type]){
    imgsClass[type] = []
  }
  let item = {
    name,
    src,
    type
  }
  imgsClass[type].push(item)

  return item
})

export enum ImgsClassNameEnum {
  map = "地图",
  layout = "布局",
  smallDecoration = "小装饰",
  border = "边框"
}

export default imgsClass
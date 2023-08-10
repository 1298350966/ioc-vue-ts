import { JSONParse } from "@/utils"

export function useDataMappingHook(config){
  function getDataMapping(data){
    let _options = {}
    Object.keys(config.dataMapping).forEach((_key)=>{
      const {type,key} = config.dataMapping[_key]
      try {
        if(type == "json|LngLat"){
          const {lng,lat} = config.dataMapping[_key]
          let path = []
    
          JSON.parse(data[key]).forEach((LngLat) => {
            if(LngLat[lng] && LngLat[lat]){
              path.push([LngLat[lat],LngLat[lng]])
            }
          })
          _options[_key] = path
        }else if(type == "json|LngLatArray"){
          _options[_key] = JSON.parse(data[key])
        }else if(type == "array|LngLat"){
          const {lng,lat} = config.dataMapping[_key]
          let path = []
          data[key].forEach((LngLat) => {
            if(LngLat[lng] && LngLat[lat]){
              path.push([LngLat[lat],LngLat[lng]])
            }
          })
          _options[_key] = path
        }else if(type == "array|LngLatArray"){
          if(Array.isArray(data[key])){
            _options[_key] = data[key]
          }else{
            window.$message.error('数据映射格式不匹配,请检查数据映射配置')
          }
        }else if(type == "LngLat"){
          const {lng,lat} = config.dataMapping[_key]
          if(data[lng] && data[lat]){
            _options[_key] = [data[lat],data[lng]]
          }
        }else{
          _options[_key] = data[key]
        }
      } catch (error) {
        window.$message.error('数据映射格式不匹配,请检查数据映射配置')
        console.error("数据映射格式不匹配")
        console.error(error)
      }
    })
    return _options
  }

  function setDataMappingOptions(data,options){
    let dataOptions = getDataMapping(data)
    Object.keys(dataOptions).forEach((key) => {
      if (options.hasOwnProperty(key)) {
        options[key] = dataOptions[key];
      }
    });
  }
  return {getDataMapping,setDataMappingOptions}
}
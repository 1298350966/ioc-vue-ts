import { get } from "lodash";

/**
 * * 动态数据处理
 * @param data { string }
 * @returns 
 */
export function getValue(value, data) {
  if (typeof value === "object") {
   
    for (const key in value) {
      const e = value[key];
      value[key] = getValue(e, data)
    }
    return value
  } else if (typeof value === "string") {
    if(/\$\{([^\}]+)\}/g.test(value)){
    value.replace(/\$\{([^\}]+)\}/g, (_, key) => {
      if(/\(\)/.test(key)){
        value = eval("data." + key)
      }else{
        value = get(data, key)
      }
      return _
    });
    }
    return value
  } else {
    return value
  }
}
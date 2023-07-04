import lib from "./build/lib/lib"
import baseConfig from "./build/base/index"

export default (options) => {
  if (options.mode === 'lib') {
    // 打包库文件
    return Object.assign(baseConfig(options),lib) 
  } else {
    // 开发模式、生产模式
    return baseConfig(options)
  }
}
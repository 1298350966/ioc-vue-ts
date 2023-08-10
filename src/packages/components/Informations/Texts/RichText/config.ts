import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { RichTextConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'


export const option = {
  htmlText:"<p>我是文本</p>",
  paddingX: 10,
  paddingY: 10,
  style:{
    '--w-e-textarea-bg-color':"",
    '--w-e-textarea-color':"",
    '--w-e-textarea-border-color':"",
    "--w-e-textarea-slight-border-color":"",
    "--w-e-textarea-slight-color":"",
    "--w-e-textarea-slight-bg-color":"",
    "--w-e-textarea-selected-border-color":"",
    "--w-e-textarea-handler-bg-color":""
  }
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = RichTextConfig.key
  public chartConfig = cloneDeep(RichTextConfig)
  public option = cloneDeep(option)
  public data = {
    name:"张三",
    age:12
  }
}

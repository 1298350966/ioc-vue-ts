import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ElTableV2Config } from './index'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const option = {
  data: [],
  attr: {
    columns: [{
      key: "column",
      dataKey: "column",
      title: "列1",
      width: 150,
    }],
    fixed: false
  }
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ElTableV2Config.key
  public chartConfig = cloneDeep(ElTableV2Config)
  public data = []
  public option = cloneDeep(option)
}

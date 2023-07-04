export * from "./config"
import image from '@/assets/images/chart/forms/el-inputNumber.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'

export const InputNumberConfig: ConfigType = {
  key: 'InputNumber',
  chartKey: 'VInputNumber',
  conKey: 'VCInputNumber',
  title: '数字输入框',
  category: FormComponentsCategoryEnum.INPUT,
  categoryName: FormComponentsCategoryEnumName.INPUT,
  package: PackagesCategoryEnum.FORMS,
  chartFrame: ChartFrameEnum.ELEMENT_PLUS,
  image
}


export * from "./config"
import image from '@/assets/images/chart/forms/el-inputText.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const InputTextConfig: ConfigType = {
  key: 'InputText',
  chartKey: 'VInputText',
  conKey: 'VCInputText',
  title: '文本输入框',
  category: FormComponentsCategoryEnum.INPUT,
  categoryName: FormComponentsCategoryEnumName.INPUT,
  package: PackagesCategoryEnum.FORMS,
  chartFrame: ChartFrameEnum.ELEMENT_PLUS,
  image
}



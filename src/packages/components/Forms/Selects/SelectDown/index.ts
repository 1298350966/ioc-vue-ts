export * from "./config"
import image from '@/assets/images/chart/forms/el-select.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const SelectDownConfig: ConfigType = {
  key: 'SelectDown',
  chartKey: 'VSelectDown',
  conKey: 'VCSelectDown',
  title: '下拉选择器',
  category: FormComponentsCategoryEnum.SELECT,
  categoryName: FormComponentsCategoryEnumName.SELECT,
  package: PackagesCategoryEnum.FORMS,
  chartFrame: ChartFrameEnum.ELEMENT_PLUS,
  image
}

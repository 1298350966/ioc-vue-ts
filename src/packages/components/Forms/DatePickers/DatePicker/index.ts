export * from "./config"
import image from '@/assets/images/chart/forms/el-datePicker.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const DatePickerConfig: ConfigType = {
  key: 'DatePicker',
  chartKey: 'VDatePicker',
  conKey: 'VCDatePicker',
  title: '日期选择器',
  category: FormComponentsCategoryEnum.DATEPICKER,
  categoryName: FormComponentsCategoryEnumName.DATEPICKER,
  package: PackagesCategoryEnum.FORMS,
  chartFrame: ChartFrameEnum.ELEMENT_PLUS,
  image
}

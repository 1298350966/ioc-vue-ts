export * from "./config"
import image from '@/assets/images/chart/forms/el-checkbox.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const CheckboxConfig:ConfigType = {
    key: 'Checkbox',
    chartKey: 'VCheckbox',
    conKey: 'VCCheckbox',
    title: '多选框',
    category: FormComponentsCategoryEnum.RADIO,
    categoryName: FormComponentsCategoryEnumName.RADIO,
    package: PackagesCategoryEnum.FORMS,
    chartFrame: ChartFrameEnum.ELEMENT_PLUS,
    image
}
export * from "./config"
import image from '@/assets/images/chart/forms/el-radio.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const RadioConfig:ConfigType = {
    key: 'Radio',
    chartKey: 'VRadio',
    conKey: 'VCRadio',
    title: '单选框',
    category: FormComponentsCategoryEnum.RADIO,
    categoryName: FormComponentsCategoryEnumName.RADIO,
    package: PackagesCategoryEnum.FORMS,
    chartFrame: ChartFrameEnum.ELEMENT_PLUS,
    image
}
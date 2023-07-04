export * from "./config"
import image from '@/assets/images/chart/forms/el-switch.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const SwitchConfig:ConfigType = {
    key: 'Switch',
    chartKey: 'VSwitch',
    conKey: 'VCSwitch',
    title: '开关',
    category: FormComponentsCategoryEnum.SWITCH,
    categoryName: FormComponentsCategoryEnumName.SWITCH,
    package: PackagesCategoryEnum.FORMS,
    chartFrame: ChartFrameEnum.ELEMENT_PLUS,
    image
}
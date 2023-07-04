export * from "./config"
import image from '@/assets/images/chart/forms/el-silder.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const SliderConfig:ConfigType = {
    key: 'Slider',
    chartKey: 'VSlider',
    conKey: 'VCSlider',
    title: '滑块',
    category: FormComponentsCategoryEnum.MORE,
    categoryName: FormComponentsCategoryEnumName.MORE,
    package: PackagesCategoryEnum.FORMS,
    chartFrame: ChartFrameEnum.ELEMENT_PLUS,
    image
}
export * from "./config"
import image from '@/assets/images/chart/custom/iframe.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import {CustomCategoryEnum,CustomCategoryEnumName } from "../../index.d"
export const componentConfig: ConfigType = {
  key: 'component',
  chartKey: 'VComponent',
  conKey: 'VCComponent',
  title: 'vue组件',
  category: CustomCategoryEnum.COMPONENTS,
  categoryName: CustomCategoryEnumName.COMPONENTS,
  package: PackagesCategoryEnum.CUSTOM,
  chartFrame: ChartFrameEnum.STATIC,
  image
}


export * from "./config"
import image from '@/assets/images/chart/custom/iframe.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import {CustomCategoryEnum,CustomCategoryEnumName } from "../../index.d"
export const IframeConfig: ConfigType = {
  key: 'Iframe',
  chartKey: 'VIframe',
  conKey: 'VCIframe',
  title: 'Iframe',
  category: CustomCategoryEnum.IFRAMES,
  categoryName: CustomCategoryEnumName.IFRAMES,
  package: PackagesCategoryEnum.CUSTOM,
  chartFrame: ChartFrameEnum.STATIC,
  image
}


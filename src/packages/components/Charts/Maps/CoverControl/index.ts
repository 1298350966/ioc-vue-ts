export * from "./config"
import image from '@/assets/images/chart/charts/map_coverControl.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import {ChatCategoryEnum, ChatCategoryEnumName} from "../../index.d"
export const CoverControlConfig: ConfigType = {
  key: 'CoverControl',
  chartKey: 'VCoverControl',
  conKey: 'VCCoverControl',
  title: '地图覆盖物控制器',
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.STATIC,
  image
}

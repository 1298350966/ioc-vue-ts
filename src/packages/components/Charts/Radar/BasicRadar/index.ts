export * from "./config"
import image from '@/assets/images/chart/charts/radar.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const BasicRadarConfig: ConfigType = {
  key: 'BasicRadar',
  chartKey: 'VBasicRadar',
  conKey: 'VCBasicRadar',
  title: '雷达图',
  category: ChatCategoryEnum.RADAR,
  categoryName: ChatCategoryEnumName.RADAR,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}

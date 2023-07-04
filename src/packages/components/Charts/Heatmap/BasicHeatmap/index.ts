export * from "./config"
import image from '@/assets/images/chart/charts/heatmap.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'


export const HeatmapConfig: ConfigType = {
  key: 'BasicHeatmap',
  chartKey: 'VBasicHeatmap',
  conKey: 'VCBasicHeatmap',
  title: '热力图',
  category: ChatCategoryEnum.HEATMAP,
  categoryName: ChatCategoryEnumName.HEATMAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image
}

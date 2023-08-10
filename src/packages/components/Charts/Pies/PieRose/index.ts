export * from "./config"
import image from '@/assets/images/chart/charts/pie-2.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const PieRoseConfig: ConfigType = {
  key: 'PieRose',
  chartKey: 'VPieRose',
  conKey: 'VCPieRose',
  title: '玫瑰饼图',
  category: ChatCategoryEnum.PIE,
  categoryName: ChatCategoryEnumName.PIE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}

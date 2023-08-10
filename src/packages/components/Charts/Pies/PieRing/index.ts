export * from "./config"
import image from '@/assets/images/chart/charts/pie-1.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const PieRingConfig: ConfigType = {
  key: 'PieRing',
  chartKey: 'VPieRing',
  conKey: 'VCPieRing',
  title: '环形饼图',
  category: ChatCategoryEnum.PIE,
  categoryName: ChatCategoryEnumName.PIE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}

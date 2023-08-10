export * from "./config"
import image from '@/assets/images/chart/charts/MultiLoopPie.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const MultiLoopPieConfig: ConfigType = {
  key: 'MultiLoopPie',
  chartKey: 'VMultiLoopPie',
  conKey: 'VCMultiLoopPie',
  title: '多环饼图',
  category: ChatCategoryEnum.PIE,
  categoryName: ChatCategoryEnumName.PIE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}

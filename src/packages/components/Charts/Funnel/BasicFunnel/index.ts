export * from "./config"
import image from '@/assets/images/chart/charts/funnel.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const BasicFunnelConfig: ConfigType = {
  key: 'BasicFunnel',
  chartKey: 'VBasicFunnel',
  conKey: 'VCBasicFunnel',
  title: '漏斗图',
  category: ChatCategoryEnum.FUNNEl,
  categoryName: ChatCategoryEnumName.FUNNEl,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}

export * from "./config"
import image from '@/assets/images/chart/charts/tree_map.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TreeMapConfig: ConfigType = {
  key: 'BasicTreeMap',
  chartKey: 'VBasicTreeMap',
  conKey: 'VCBasicTreeMap',
  title: '树形分布',
  category: ChatCategoryEnum.TREE_MAP,
  categoryName: ChatCategoryEnumName.TREE_MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}

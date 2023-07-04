import image from '@/assets/images/chart/tables/table_scrollboard.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const ElTableV2Config: ConfigType = {
  key: 'ElTableV2',
  chartKey: 'VElTableV2',
  conKey: 'VCElTableV2',
  title: '列表',
  category: ChatCategoryEnum.TABLE,
  categoryName: ChatCategoryEnumName.TABLE,
  package: PackagesCategoryEnum.TABLES,
  chartFrame: ChartFrameEnum.COMMON,
  image
}

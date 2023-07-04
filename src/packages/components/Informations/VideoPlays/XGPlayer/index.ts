import image from '@/assets/images/chart/informations/video.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
export const XGPlayerConfig: ConfigType = {
  key: 'XGPlayer',
  chartKey: 'VXGPlayer',
  conKey: 'VCXGPlayer',
  title: '西瓜播放器',
  category: ChatCategoryEnum.VIDEO_PLAYS,
  categoryName: ChatCategoryEnumName.VIDEO_PLAYS,
  package: PackagesCategoryEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}

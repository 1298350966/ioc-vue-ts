import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import image from '@/assets/images/chart/charts/map_Bmap.png'
export const MapBmapConfig: ConfigType = {
  key: 'MapBmap',
  chartKey: 'VMapBmap',
  conKey: 'VCMapBmap',
  title: '百度地图',
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: image
}

import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import image from '@/assets/images/chart/charts/map_Tmap.png'
export const MapTmapConfig: ConfigType = {
  key: 'MapTmap',
  chartKey: 'VMapTmap',
  conKey: 'VCMapTmap',
  title: '天地图',
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: image
}

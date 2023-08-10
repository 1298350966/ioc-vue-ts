import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'
import image from '@/assets/images/chart/charts/map_leaflet.png'
export const LeafletConfig: ConfigType = {
  key: 'Leaflet',
  chartKey: 'VLeaflet',
  conKey: 'VCLeaflet',
  title: 'leaflet地图',
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: image
}

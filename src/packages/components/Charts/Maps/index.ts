import {
  Events as MapBaseEvents,
  MapBaseConfig
} from './MapBase/index'
import { MapAmapConfig } from './MapAmap/index'
import { MapTmapConfig } from './MapTmap/index'
import { MapBmapConfig } from './MapBmap/index'
import { LeafletConfig } from './Leaflet/index'
import { 
  Events as CoverControlEvents,
  CoverControlConfig } from './CoverControl/index'

export const MapsEvents = {
  [MapBaseConfig.key]: MapBaseEvents,
  [CoverControlConfig.key]:CoverControlEvents 
}

export default [MapBaseConfig, MapAmapConfig, MapTmapConfig, MapBmapConfig, LeafletConfig, CoverControlConfig]

import {
  Events as BasicRadarEvents,
  BasicRadarConfig
} from './BasicRadar/index'

export const RadarsEvents = {
  [BasicRadarConfig.key]: BasicRadarEvents,
}

export default [BasicRadarConfig]

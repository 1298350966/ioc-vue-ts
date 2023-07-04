import Bars, { BarsEvents } from './Bars'
import Pies, { PiesEvents } from './Pies'
import Lines, { LinesEvents } from './Lines'
import Scatters, { ScattersEvents } from './Scatters'
import Mores, { MoresEvents } from './Mores'
import Maps, { MapsEvents } from './Maps'
import Radars, { RadarsEvents } from './Radar'
import Heatmaps, { HeatmapsEvents } from './Heatmap'
import Funnels, { FunnelsEvents } from './Funnel'
import TreeMaps, { TreeMapsEvents } from './TreeMap'
export const ChartList = [...Bars, ...Lines, ...Pies, ...Scatters, ...Maps, ...Radars, ...Heatmaps, ...Funnels, ...TreeMaps, ...Mores]


export const ChartsEvents = {
  ...BarsEvents,
  ...PiesEvents,
  ...LinesEvents,
  ...ScattersEvents,
  ...MapsEvents,
  ...RadarsEvents,
  ...HeatmapsEvents,
  ...FunnelsEvents,
  ...TreeMapsEvents,
  ...MoresEvents,
}

import {
  Events as BasicFunnelEvents,
  BasicFunnelConfig
} from "./BasicFunnel"

export const FunnelsEvents = {
  [BasicFunnelConfig.key]: BasicFunnelEvents,
}

export default [BasicFunnelConfig]
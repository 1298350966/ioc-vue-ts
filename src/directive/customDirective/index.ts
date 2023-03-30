export * from "./dragDirective"
export * from "./wavesDirective"
import { App } from "vue"
import { dragDirective } from "./dragDirective"
import { wavesDirective } from "./wavesDirective"


export function useDirective(app : App){
  dragDirective(app)
  wavesDirective(app)
}
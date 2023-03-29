import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { App } from 'vue'

export function setupLoading(app: App) {
  window['$loading'] = NProgress
}
import { ref, onMounted, onUnmounted } from 'vue'
import { usePreviewFitScale, usePreviewScrollYScale, usePreviewScrollXScale, usePreviewFullScale } from '@/hooks/index'
import type { ChartEditStorageType } from '../index.d'
import { PreviewScaleEnum } from '@/enums/styleEnum'

export const SCALE_KEY = 'scale-value'

export const useScale = (localStorageInfo: ChartEditStorageType) => {
  const entityRef = ref()
  const previewRef = ref()
  const contextRef = ref()
  const width = ref(localStorageInfo.editCanvasConfig.width)
  const height = ref(localStorageInfo.editCanvasConfig.height)

  // 屏幕适配
  onMounted(() => {
    console.dir(entityRef.value)
    console.dir(contextRef.value)
    switch (localStorageInfo.editCanvasConfig.previewScaleType) {
      case PreviewScaleEnum.FIT: (() => {
        const { calcRate, windowResize, unWindowResize } = usePreviewFitScale(
          width.value as number,
          height.value as number,
          previewRef.value,
          contextRef.value,
        )
        calcRate()
        windowResize()
        onUnmounted(() => {
          unWindowResize()
        })
      })()
        break;
      case PreviewScaleEnum.SCROLL_Y: (() => {
        const { calcRate, windowResize, unWindowResize } = usePreviewScrollYScale(
          width.value as number,
          height.value as number,
          previewRef.value,
          contextRef.value,
          (scale) => {
            const dom = entityRef.value
            dom.style.width = `${width.value * scale.width}px`
            dom.style.height = `${height.value * scale.height}px`
          },
 
        )
        calcRate()
        windowResize()
        onUnmounted(() => {
          unWindowResize()
        })
      })()

        break;
      case PreviewScaleEnum.SCROLL_X: (() => {
        const { calcRate, windowResize, unWindowResize } = usePreviewScrollXScale(
          width.value as number,
          height.value as number,
          previewRef.value,
          contextRef.value,
          (scale) => {
            const dom = entityRef.value
            dom.style.width = `${width.value * scale.width}px`
            dom.style.height = `${height.value * scale.height}px`
          },
 
        )
        calcRate()
        windowResize()
        onUnmounted(() => {
          unWindowResize()
        })
      })()

        break;
      case PreviewScaleEnum.FULL: (() => {
        const { calcRate, windowResize, unWindowResize } = usePreviewFullScale(
          width.value as number,
          height.value as number,
          previewRef.value,
          contextRef.value
        )
        calcRate()
        windowResize()
        onUnmounted(() => {
          unWindowResize()
        })
      })()
        break;
    }
  })

  return {
    entityRef,
    previewRef,
    contextRef
  }
}

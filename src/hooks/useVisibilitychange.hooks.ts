export const useVisibilitychange = (cb:()=>void) => {
  onMounted(() => {
    document.addEventListener('visibilitychange', changePage)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', changePage)
  })
  function changePage() {
    if (document.visibilityState == "visible") {
      cb()
    }
  }
}
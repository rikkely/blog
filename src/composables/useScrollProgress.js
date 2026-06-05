import { ref, onMounted, onUnmounted } from 'vue'

/** 页面纵向滚动进度 0~1，用于阅读进度条。 */
export function useScrollProgress() {
  const progress = ref(0)
  let raf = 0

  const measure = () => {
    raf = 0
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    progress.value = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
  }
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(measure)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    measure()
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })

  return { progress }
}

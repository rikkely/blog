import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 极简 hash 路由（零依赖）。用 hash 是为了让 dist/ 丢到任意子路径
 * （/blog/）都能直接跑，nginx 不需要任何 rewrite/try_files。
 *
 *   #/            → 列表页            { name: 'list' }
 *   #/p/<slug>    → 文章详情          { name: 'post', slug }
 */
function parse() {
  const raw = (window.location.hash || '').replace(/^#/, '') || '/'
  const path = raw.split('?')[0]
  const m = path.match(/^\/p\/(.+)$/)
  if (m) return { name: 'post', slug: decodeURIComponent(m[1]) }
  return { name: 'list' }
}

// 模块级单例，全 App 共享同一个路由状态
const route = ref(parse())

export function navigate(to) {
  if (window.location.hash === `#${to}`) {
    // 相同 hash 不会触发 hashchange，手动刷新一次
    route.value = parse()
    window.scrollTo({ top: 0, behavior: 'auto' })
    return
  }
  window.location.hash = to
}

export function useHashRoute() {
  const onHash = () => {
    route.value = parse()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  onMounted(() => window.addEventListener('hashchange', onHash))
  onUnmounted(() => window.removeEventListener('hashchange', onHash))
  return route
}

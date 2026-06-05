/**
 * 博客数据访问层 —— 后端就绪前的「写死优先」实现。
 *
 *  · mode='mock'：返回 src/api/mock/posts.js 里的内容（带轻微延迟，方便看加载态）
 *  · mode='live'：走真实 REST 接口（后端由我后续生成，契约见下方注释）
 *
 *  REST 契约（live 模式）：
 *    GET {base}/blog/posts            → ListItem[]            （不含正文 body）
 *    GET {base}/blog/posts/:slug      → { post, prev, next }  （post 含正文）
 *    GET {base}/blog/tags             → { name, count }[]
 *
 *  切换：改 src/config.js 里的 api.mode / api.base 即可。
 */
import config from '../config.js'
import { posts as RAW } from './mock/posts.js'

const MODE = config.api?.mode || 'mock'
const BASE = config.api?.base || '/api'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// 置顶优先，然后按日期倒序
const order = (a, b) => {
  if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
  return a.date < b.date ? 1 : -1
}
const stripBody = ({ body, ...rest }) => rest

async function http(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} @ ${path}`)
  return res.json()
}

/** 文章列表（不含正文）。 */
export async function fetchPosts() {
  if (MODE === 'live') return http('/blog/posts')
  await delay(180)
  return RAW.slice().sort(order).map(stripBody)
}

/** 单篇文章 + 相邻文章。slug 不存在返回 null。 */
export async function fetchPost(slug) {
  if (MODE === 'live') return http(`/blog/posts/${encodeURIComponent(slug)}`)
  await delay(160)
  const sorted = RAW.slice().sort(order)
  const i = sorted.findIndex((p) => p.slug === slug)
  if (i === -1) return null
  const lite = (p) => (p ? { slug: p.slug, title: p.title } : null)
  return {
    post: sorted[i],
    prev: lite(sorted[i - 1]), // 更新的一篇
    next: lite(sorted[i + 1]) // 更早的一篇
  }
}

/** 标签及计数。 */
export async function fetchTags() {
  if (MODE === 'live') return http('/blog/tags')
  await delay(60)
  const map = new Map()
  RAW.forEach((p) => (p.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1)))
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

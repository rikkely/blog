/**
 * 数据访问层 —— mock / live 一键切换（见 src/config.js → api.mode）。
 *
 * live 模式契约（后端按此实现即可，前端零改动）：
 *   GET {base}/blog/posts          → ListItem[]            （不含正文 body）
 *   GET {base}/blog/posts/:slug    → { post, prev, next }  （post 含正文）
 *   GET {base}/blog/tags           → { name, count }[]
 *
 * ListItem = { slug, title, date, tags, excerpt, readMins, accent, pinned }
 */
import config from '../config.js'
import { POSTS } from './mock/posts.js'

const { mode, base } = config.api || { mode: 'mock', base: '/api' }

/* ---------------- mock 实现 ---------------- */

const sorted = () =>
  [...POSTS].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.date.localeCompare(a.date)
  })

const stripBody = ({ body, ...rest }) => rest

async function mockPosts() {
  return sorted().map(stripBody)
}

async function mockPost(slug) {
  const list = sorted()
  const i = list.findIndex((p) => p.slug === slug)
  if (i === -1) return { post: null, prev: null, next: null }
  return {
    post: list[i],
    prev: i > 0 ? stripBody(list[i - 1]) : null,
    next: i < list.length - 1 ? stripBody(list[i + 1]) : null
  }
}

async function mockTags() {
  const count = {}
  for (const p of POSTS) for (const t of p.tags || []) count[t] = (count[t] || 0) + 1
  return Object.entries(count)
    .map(([name, n]) => ({ name, count: n }))
    .sort((a, b) => b.count - a.count)
}

/* ---------------- live 实现 ---------------- */

async function get(path) {
  const res = await fetch(`${base}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

/* ---------------- 导出 ---------------- */

export const fetchPosts = () => (mode === 'live' ? get('/blog/posts') : mockPosts())
export const fetchPost = (slug) =>
  mode === 'live' ? get(`/blog/posts/${encodeURIComponent(slug)}`) : mockPost(slug)
export const fetchTags = () => (mode === 'live' ? get('/blog/tags') : mockTags())

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import config from '../config.js'
import { fetchPost } from '../api/client.js'
import { navigate } from '../composables/useHashRoute.js'

const props = defineProps({ slug: { type: String, required: true } })

const post = ref(null)
const prev = ref(null)
const next = ref(null)
const missing = ref(false)
const showTop = ref(false)

// 烛金 / 余烬 / 苔绿 / 月银
const ACCENTS = ['var(--gold)', 'var(--ember)', 'var(--moss)', 'var(--moon)']
const accent = ref(ACCENTS[0])

watch(
  () => props.slug,
  async (slug) => {
    missing.value = false
    post.value = null
    const r = await fetchPost(slug)
    if (!r.post) {
      missing.value = true
      return
    }
    post.value = r.post
    prev.value = r.prev
    next.value = r.next
    accent.value = ACCENTS[(r.post.accent || 0) % 4]
  },
  { immediate: true }
)

const rendered = computed(() => {
  const html = post.value?.body || ''
  if (!html || typeof DOMParser === 'undefined') {
    return { html, toc: [] }
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const toc = []
  doc.querySelectorAll('h2').forEach((h2, idx) => {
    const id = `h2-${idx}`
    h2.setAttribute('id', id)
    toc.push({ id, title: h2.textContent.trim() })
  })
  doc.querySelectorAll('pre').forEach((pre) => {
    const bar = doc.createElement('div')
    bar.className = 'code-bar'
    const tag = doc.createElement('span')
    tag.className = 'code-bar__lbl'
    tag.textContent = 'CODE'
    const btn = doc.createElement('button')
    btn.type = 'button'
    btn.className = 'code-copy-btn'
    btn.textContent = '复制代码'
    bar.appendChild(tag)
    bar.appendChild(btn)
    pre.prepend(bar)
  })
  return { html: doc.body.innerHTML, toc }
})

function onBodyClick(e) {
  const btn = e.target.closest?.('.code-copy-btn')
  if (!btn) return
  const pre = btn.closest('pre')
  const code = pre?.querySelector('code')?.textContent || ''
  if (!code) return
  navigator.clipboard?.writeText(code).then(() => {
    btn.textContent = '已复制 ✓'
    btn.classList.add('is-ok')
    setTimeout(() => {
      btn.textContent = '复制代码'
      btn.classList.remove('is-ok')
    }, 1500)
  }).catch(() => {})
}

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  showTop.value = window.scrollY > 300
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="post" :style="{ '--acc': accent }">
    <a class="post__back reveal" href="#/" @click.prevent="navigate('/')">← 回到归档</a>

    <template v-if="post">
      <header class="post__head reveal" style="--delay: 0.06s">
        <div class="post__meta">
          <time>{{ post.date }}</time>
          <span>·</span>
          <span>{{ post.readMins }} 分钟</span>
          <span>·</span>
          <span>{{ config.site.author }}</span>
        </div>
        <h1 class="post__title">{{ post.title }}</h1>
        <div class="post__tags">
          <span v-for="t in post.tags" :key="t"># {{ t }}</span>
        </div>
      </header>

      <aside v-if="rendered.toc.length >= 2" class="post__toc reveal" style="--delay: 0.1s">
        <div class="post__toc-head">文章目录</div>
        <div class="post__toc-list">
          <button
            v-for="(item, i) in rendered.toc"
            :key="item.id"
            class="post__toc-item"
            @click="jumpTo(item.id)"
          >
            <i>{{ String(i + 1).padStart(2, '0') }}</i>
            <span>{{ item.title }}</span>
          </button>
        </div>
      </aside>

      <article
        class="post__body reveal"
        style="--delay: 0.14s"
        v-html="rendered.html"
        @click="onBodyClick"
      />

      <nav class="post__pager reveal" style="--delay: 0.2s">
        <a
          v-if="prev"
          class="post__pageritem"
          :href="`#/p/${prev.slug}`"
          @click.prevent="navigate(`/p/${prev.slug}`)"
        >
          <i>← 较新</i><b>{{ prev.title }}</b>
        </a>
        <span v-else class="post__pageritem is-empty" />
        <a
          v-if="next"
          class="post__pageritem is-right"
          :href="`#/p/${next.slug}`"
          @click.prevent="navigate(`/p/${next.slug}`)"
        >
          <i>较旧 →</i><b>{{ next.title }}</b>
        </a>
        <span v-else class="post__pageritem is-empty" />
      </nav>
    </template>

    <p v-else-if="missing" class="post__missing">
      没有找到这篇文章。<a href="#/" @click.prevent="navigate('/')">回到归档</a>
    </p>

    <button v-if="showTop" class="topbtn" aria-label="返回顶部" @click="scrollTop">↑ 顶部</button>
  </div>
</template>

<style scoped>
.post {
  max-width: 740px;
  margin: 0 auto;
  padding-bottom: 32px;
}

.post__back {
  display: inline-block;
  margin: 6px 0 22px;
  font-size: 0.86rem;
  color: var(--cream-dim);
  transition: color 0.3s, transform 0.3s var(--ease-out);
}
.post__back:hover {
  color: var(--acc);
  transform: translateX(-3px);
}

.post__head {
  text-align: center;
  padding-bottom: 24px;
}
.post__meta {
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 0.78rem;
  font-family: var(--font-mono);
  color: var(--cream-dim);
}
.post__title {
  margin: 14px 0 12px;
  font-family: var(--font-serif);
  font-size: clamp(1.65rem, 4.5vw, 2.25rem);
  line-height: 1.4;
  letter-spacing: 1px;
  color: var(--cream);
  text-shadow: 0 0 28px color-mix(in srgb, var(--acc) 35%, transparent);
}
.post__tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 0.78rem;
  color: var(--acc);
}

/* ---------- 目录 ---------- */
.post__toc {
  margin-bottom: 18px;
  padding: 16px 20px;
  border-radius: 14px;
  background: rgba(23, 19, 13, 0.86);
  border: 1px solid var(--line);
}
.post__toc-head {
  margin-bottom: 10px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: var(--acc);
}
.post__toc-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}
.post__toc-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  color: var(--cream-soft);
  transition: color 0.25s;
}
.post__toc-item i {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--cream-dim);
}
.post__toc-item:hover {
  color: var(--acc);
}

/* ---------- 正文排版 ---------- */
.post__body {
  background: linear-gradient(165deg, rgba(25, 20, 14, 0.94), rgba(18, 14, 9, 0.94));
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--card-shadow), inset 0 1px 0 rgba(241, 233, 215, 0.06);
  padding: clamp(24px, 4.5vw, 44px);
  font-size: 1rem;
  line-height: 1.95;
  color: var(--cream);
}
.post__body :deep(p) {
  margin: 0 0 1.15em;
  color: var(--cream-soft);
}
.post__body :deep(h2) {
  position: relative;
  margin: 1.9em 0 0.8em;
  padding-left: 16px;
  scroll-margin-top: 84px;
  font-family: var(--font-serif);
  font-size: 1.28rem;
  color: var(--cream);
}
.post__body :deep(h2)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.28em;
  bottom: 0.28em;
  width: 4px;
  border-radius: 4px;
  background: var(--acc);
  box-shadow: 0 0 8px color-mix(in srgb, var(--acc) 70%, transparent);
}
.post__body :deep(ul),
.post__body :deep(ol) {
  margin: 0 0 1.15em;
  padding-left: 1.4em;
  color: var(--cream-soft);
}
.post__body :deep(li) {
  margin-bottom: 0.35em;
}
.post__body :deep(blockquote) {
  margin: 1.35em 0;
  padding: 14px 20px;
  border-left: 4px solid var(--acc);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: color-mix(in srgb, var(--acc) 9%, var(--night-2));
  color: var(--cream-soft);
  font-style: italic;
}
.post__body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.86em;
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--night-3);
  color: #ecd9ae;
}
.post__body :deep(pre) {
  margin: 1.35em 0;
  padding: 0 0 16px;
  border-radius: var(--radius-sm);
  background: #0a0805;
  border: 1px solid var(--line);
  overflow-x: auto;
}
.post__body :deep(.code-bar) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(229, 185, 110, 0.12);
  background: rgba(255, 255, 255, 0.02);
  font-family: var(--font-mono);
  font-size: 0.68rem;
}
.post__body :deep(.code-bar__lbl) {
  letter-spacing: 1.5px;
  color: var(--cream-dim);
}
.post__body :deep(.code-copy-btn) {
  padding: 2px 9px;
  border-radius: 6px;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  color: var(--cream-soft);
  background: rgba(241, 233, 215, 0.06);
  border: 1px solid rgba(229, 185, 110, 0.16);
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.post__body :deep(.code-copy-btn:hover),
.post__body :deep(.code-copy-btn.is-ok) {
  color: var(--gold);
  border-color: rgba(229, 185, 110, 0.45);
  background: rgba(229, 185, 110, 0.12);
}
.post__body :deep(pre code) {
  display: block;
  padding: 0 18px;
  background: none;
  color: #e9dcb8;
  font-size: 0.84rem;
  line-height: 1.7;
}
.post__body :deep(strong) {
  color: var(--cream);
}
.post__body :deep(em) {
  color: var(--cream-soft);
}

/* ---------- 上一篇 / 下一篇 ---------- */
.post__pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 26px;
}
.post__pageritem {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 18px;
  border-radius: var(--radius-sm);
  background: var(--night-2);
  border: 1px solid var(--line);
  box-shadow: var(--card-shadow);
  transition: transform 0.4s var(--ease-out), box-shadow 0.4s, border-color 0.4s;
}
.post__pageritem:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--acc) 45%, transparent);
  box-shadow: var(--card-shadow-hover);
}
.post__pageritem.is-right {
  text-align: right;
}
.post__pageritem.is-empty {
  visibility: hidden;
}
.post__pageritem i {
  font-style: normal;
  font-size: 0.72rem;
  color: var(--cream-dim);
}
.post__pageritem b {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cream);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post__missing {
  text-align: center;
  padding: 60px 0;
  color: var(--cream-dim);
}
.post__missing a {
  color: var(--gold);
  text-decoration: underline;
}

.topbtn {
  position: fixed;
  right: 22px;
  bottom: 76px;
  z-index: 60;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  color: var(--gold);
  background: rgba(23, 19, 13, 0.85);
  border: 1px solid rgba(229, 185, 110, 0.28);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 28px -10px rgba(0, 0, 0, 0.7);
}
.topbtn:hover {
  border-color: var(--gold);
}

@media (max-width: 640px) {
  .post__pager {
    grid-template-columns: 1fr;
  }
}
</style>

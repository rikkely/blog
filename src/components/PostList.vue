<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import config from '../config.js'
import { fetchPosts, fetchTags } from '../api/client.js'
import PostCard from './PostCard.vue'

const arc = config.archive || {}
const pageSize = arc.pageSize || 6

const posts = ref([])
const tags = ref([])
const loading = ref(true)
const error = ref(null)

const query = ref('')
const activeTag = ref('')
const page = ref(1)

onMounted(async () => {
  try {
    const [p, t] = await Promise.all([fetchPosts(), fetchTags()])
    posts.value = p
    tags.value = t
  } catch (e) {
    error.value = e?.message || '链路异常'
  } finally {
    loading.value = false
  }
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return posts.value.filter((p) => {
    if (activeTag.value && !(p.tags || []).includes(activeTag.value)) return false
    if (!q) return true
    const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(' ')}`.toLowerCase()
    return hay.includes(q)
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

watch([query, activeTag], () => {
  page.value = 1
})

const lastSync = computed(() => {
  if (!posts.value.length) return '—'
  return posts.value.map((p) => p.date).sort().pop().replace(/-/g, '.')
})

const go = (n) => {
  page.value = Math.min(totalPages.value, Math.max(1, n))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="idx">
    <!-- nameplate -->
    <header class="np">
      <span class="np__kicker">VOL.01 — 来自互联网边缘的不定期刊</span>
      <h1 class="np__title">{{ arc.titleZh }}</h1>
      <p class="np__stand">{{ arc.tagline }}</p>
      <div class="np__meta">
        <span>{{ posts.length }} 篇</span><span class="np__dot">·</span>
        <span>{{ tags.length }} 个主题</span><span class="np__dot">·</span>
        <span>更新于 {{ lastSync }}</span>
      </div>
    </header>

    <!-- controls -->
    <div class="ctrls">
      <label class="srch">
        <input v-model="query" type="text" placeholder="检索…" spellcheck="false" />
      </label>
      <nav class="topics">
        <button class="topic" :class="{ 'is-on': activeTag === '' }" @click="activeTag = ''">全部</button>
        <button
          v-for="t in tags"
          :key="t.name"
          class="topic"
          :class="{ 'is-on': activeTag === t.name }"
          @click="activeTag = t.name"
        >{{ t.name }}<i>{{ t.count }}</i></button>
      </nav>
    </div>

    <div v-if="loading" class="state">正在取阅…</div>
    <div v-else-if="error" class="state state--err">链路异常：{{ error }}</div>
    <template v-else>
      <div v-if="paged.length" class="feed">
        <PostCard
          v-for="(p, i) in paged"
          :key="p.slug"
          :post="p"
          :index="i + (page - 1) * pageSize"
          :lead="page === 1 && i === 0"
        />
      </div>
      <div v-else class="state">此条件下没有文章</div>

      <nav v-if="totalPages > 1" class="pager">
        <button class="pager__b" :disabled="page <= 1" @click="go(page - 1)">← 前页</button>
        <span class="pager__n">
          <button
            v-for="n in totalPages"
            :key="n"
            :class="{ 'is-on': n === page }"
            @click="go(n)"
          >{{ n }}</button>
        </span>
        <button class="pager__b" :disabled="page >= totalPages" @click="go(page + 1)">次页 →</button>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.idx {
  width: min(940px, 92vw);
  margin: 0 auto;
  padding: clamp(22px, 4vh, 44px) 0 40px;
}

/* nameplate */
.np {
  text-align: center;
  padding-bottom: 26px;
  margin-bottom: 26px;
  border-bottom: 1px solid color-mix(in srgb, var(--accent-a) 22%, transparent);
}
.np__kicker {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent-a);
}
.np__title {
  margin: 16px 0 14px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(3rem, 9vw, 5.4rem);
  line-height: 1;
  letter-spacing: 4px;
  color: var(--text);
}
.np__stand {
  max-width: 46ch;
  margin: 0 auto;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.06rem;
  line-height: 1.7;
  color: var(--text-soft);
}
.np__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 1.5px;
  color: var(--text-dim);
}
.np__dot {
  opacity: 0.5;
}

/* controls */
.ctrls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 30px;
}
.srch input {
  width: 200px;
  max-width: 44vw;
  padding: 6px 2px;
  border: none;
  border-bottom: 1px solid color-mix(in srgb, var(--accent-a) 35%, transparent);
  outline: none;
  background: none;
  color: var(--text);
  font-family: var(--font-serif);
  font-size: 0.98rem;
  transition: border-color 0.25s;
}
.srch input:focus {
  border-color: var(--accent-a);
}
.srch input::placeholder {
  color: var(--text-dim);
  font-style: italic;
}
.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
}
.topic {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.5px;
  color: var(--text-dim);
  transition: color 0.2s;
}
.topic i {
  font-style: normal;
  font-size: 0.56rem;
  vertical-align: super;
  margin-left: 1px;
  opacity: 0.6;
}
.topic:hover {
  color: var(--text-soft);
}
.topic.is-on {
  color: var(--accent-a);
}

/* feed */
.feed > * + * {
  border-top: 1px solid rgba(236, 230, 218, 0.1);
}

/* states */
.state {
  padding: 70px 0;
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--text-dim);
}
.state--err {
  color: var(--accent-b);
}

/* pager */
.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 36px;
  padding-top: 22px;
  border-top: 1px solid color-mix(in srgb, var(--accent-a) 20%, transparent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 1px;
  color: var(--text-soft);
}
.pager__b {
  color: var(--text-soft);
  transition: color 0.2s;
}
.pager__b:hover:not(:disabled) {
  color: var(--accent-a);
}
.pager__b:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.pager__n {
  display: inline-flex;
  gap: 12px;
}
.pager__n button {
  color: var(--text-dim);
  transition: color 0.2s;
}
.pager__n button:hover {
  color: var(--text-soft);
}
.pager__n button.is-on {
  color: var(--accent-a);
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 540px) {
  .pager__n {
    display: none;
  }
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import config from '../config.js'
import { fetchPosts, fetchTags } from '../api/client.js'
import PostCard from './PostCard.vue'
import TagBar from './TagBar.vue'

const posts = ref([])
const tags = ref([])
const activeTag = ref('')
const q = ref('')
const ready = ref(false)
const searchRef = ref(null)

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  return posts.value.filter((p) => {
    if (activeTag.value && !(p.tags || []).includes(activeTag.value)) return false
    if (!s) return true
    const hay = `${p.title} ${p.excerpt} ${(p.tags || []).join(' ')}`.toLowerCase()
    return hay.includes(s)
  })
})

const totalMins = computed(() =>
  filtered.value.reduce((sum, p) => sum + (Number(p.readMins) || 0), 0)
)

const hasFeatured = computed(
  () => !activeTag.value && !q.value.trim() && filtered.value[0]?.pinned
)

function onKeydown(e) {
  if (e.key === '/' && document.activeElement !== searchRef.value) {
    const tag = e.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    e.preventDefault()
    searchRef.value?.focus()
  } else if (e.key === 'Escape' && document.activeElement === searchRef.value) {
    q.value = ''
    searchRef.value?.blur()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  const [p, t] = await Promise.all([fetchPosts(), fetchTags()])
  posts.value = p
  tags.value = t
  ready.value = true
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const hero = config.hero
</script>

<template>
  <div class="list">
    <!-- 刊头 -->
    <section class="hero reveal" style="--delay: 0.05s">
      <h1 class="hero__title">
        {{ config.site.name }}
        <svg class="hero__stroke" viewBox="0 0 220 14" aria-hidden="true">
          <path
            d="M4 10 C 50 2, 120 2, 216 8"
            fill="none"
            stroke="var(--gold)"
            stroke-width="4.5"
            stroke-linecap="round"
            opacity="0.65"
          />
        </svg>
      </h1>
      <p class="hero__tagline">{{ hero.tagline }}</p>
      <p class="hero__sub">{{ hero.sub }}</p>
    </section>

    <!-- 搜索与统计 -->
    <section class="toolbar reveal" style="--delay: 0.12s">
      <label class="search">
        <span class="search__ico" aria-hidden="true">⌕</span>
        <input
          ref="searchRef"
          v-model="q"
          type="text"
          placeholder="搜索标题、摘要或标签… (按 / 聚焦)"
          spellcheck="false"
        />
        <button v-if="q" class="search__clear" type="button" aria-label="清除搜索" @click="q = ''">×</button>
      </label>
      <div class="toolbar__meta">
        <span>共 {{ filtered.length }} 篇</span>
        <span>·</span>
        <span>约 {{ totalMins }} 分钟阅读</span>
      </div>
    </section>

    <!-- 标签筛选 -->
    <section class="list__tags reveal" style="--delay: 0.16s">
      <TagBar :tags="tags" :active="activeTag" @pick="activeTag = $event" />
    </section>

    <!-- 文章卡片 -->
    <section v-if="ready" class="list__grid">
      <PostCard
        v-for="(p, i) in filtered"
        :key="p.slug"
        :post="p"
        :featured="hasFeatured && i === 0"
        :delay="0.2 + Math.min(i, 6) * 0.05"
      />
      <p v-if="!filtered.length" class="list__empty">没有找到符合条件的文章。</p>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 28px 0 22px;
  text-align: center;
}
.hero__title {
  position: relative;
  display: inline-block;
  font-family: var(--font-serif);
  font-size: clamp(2.3rem, 6vw, 3.3rem);
  letter-spacing: 10px;
  text-indent: 10px;
  color: var(--cream);
  text-shadow: 0 0 32px rgba(229, 185, 110, 0.35);
}
.hero__stroke {
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 78%;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 6px rgba(229, 185, 110, 0.5));
}
.hero__tagline {
  margin-top: 22px;
  font-size: 1.02rem;
  color: var(--cream-soft);
}
.hero__sub {
  margin-top: 6px;
  font-size: 0.82rem;
  color: var(--cream-dim);
  letter-spacing: 1px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(23, 19, 13, 0.82);
  border: 1px solid var(--line);
}
.search {
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--cream-dim);
}
.search__ico {
  font-size: 1rem;
  color: var(--gold);
}
.search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  color: var(--cream);
  font-size: 0.9rem;
}
.search input::placeholder {
  color: var(--cream-dim);
}
.search__clear {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1;
  color: var(--cream-dim);
  background: rgba(241, 233, 215, 0.08);
}
.search__clear:hover {
  color: var(--cream);
}
.toolbar__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--cream-dim);
}

.list__tags {
  display: flex;
  justify-content: center;
  padding: 18px 0 28px;
}

.list__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding-bottom: 24px;
}
.list__empty {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--cream-dim);
  padding: 40px 0;
}

@media (max-width: 720px) {
  .list__grid {
    grid-template-columns: 1fr;
  }
  .hero {
    padding-top: 18px;
  }
}
</style>

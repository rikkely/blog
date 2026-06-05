<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import config from '../config.js'
import { fetchPost } from '../api/client.js'
import { useScrollProgress } from '../composables/useScrollProgress.js'
import { navigate } from '../composables/useHashRoute.js'

const props = defineProps({
  slug: { type: String, required: true }
})

const data = ref(null)
const loading = ref(true)
const notFound = ref(false)
const { progress } = useScrollProgress()
const author = config.site.author || 'rikkely'

const post = computed(() => data.value?.post || null)
const dateFmt = computed(() => {
  const [y, m, d] = (post.value?.date || '').split('-')
  return y ? `${y} 年 ${+m} 月 ${+d} 日` : post.value?.date
})

async function load(slug) {
  loading.value = true
  notFound.value = false
  data.value = null
  try {
    const res = await fetchPost(slug)
    if (!res || !res.post) notFound.value = true
    else data.value = res
  } catch (e) {
    notFound.value = true
  } finally {
    loading.value = false
  }
}
onMounted(() => load(props.slug))
watch(() => props.slug, (s) => load(s))

const open = (slug) => navigate(`/p/${slug}`)
const back = () => navigate('/')
</script>

<template>
  <div class="rd">
    <div class="progress" :style="{ transform: `scaleX(${progress})` }" />

    <div v-if="loading" class="state">正在翻页…</div>

    <div v-else-if="notFound" class="state state--err">
      <p>未找到该文章（{{ slug }}）</p>
      <button class="ghost" @click="back">← 回到目录</button>
    </div>

    <article v-else class="art">
      <header class="art__head">
        <div class="art__topics">
          <span v-for="t in post.tags" :key="t">#{{ t }}</span>
        </div>
        <h1 class="art__title">{{ post.title }}</h1>
        <div class="art__byline">
          <img class="art__ava" :src="config.site.avatar" :alt="author" />
          <span>{{ author }}</span>
          <span class="art__sep">·</span>
          <span>{{ dateFmt }}</span>
          <span class="art__sep">·</span>
          <span>{{ post.readMins }} 分钟阅读</span>
        </div>
      </header>

      <div class="art__body" v-html="post.body" />

      <nav class="ends">
        <a v-if="data.prev" class="end" :href="`#/p/${data.prev.slug}`" @click.prevent="open(data.prev.slug)">
          <span class="end__lbl">← 新一篇</span>
          <span class="end__t">{{ data.prev.title }}</span>
        </a>
        <span v-else />
        <a v-if="data.next" class="end end--r" :href="`#/p/${data.next.slug}`" @click.prevent="open(data.next.slug)">
          <span class="end__lbl">旧一篇 →</span>
          <span class="end__t">{{ data.next.title }}</span>
        </a>
        <span v-else />
      </nav>

      <div class="art__back"><button @click="back">← 返回目录</button></div>
    </article>
  </div>
</template>

<style scoped>
.rd {
  position: relative;
}
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 60;
  transform-origin: left;
  background: var(--accent-a);
  box-shadow: 0 0 10px color-mix(in srgb, var(--accent-a) 70%, transparent);
}

.art {
  width: min(680px, 92vw);
  margin: 0 auto;
  padding: clamp(20px, 4vh, 40px) 0 30px;
}

/* header */
.art__head {
  text-align: center;
  padding-bottom: 26px;
  margin-bottom: 30px;
  border-bottom: 1px solid color-mix(in srgb, var(--accent-a) 22%, transparent);
}
.art__topics {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent-a);
}
.art__title {
  margin: 18px 0;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(1.9rem, 5vw, 3.1rem);
  line-height: 1.22;
  letter-spacing: 0.3px;
  color: var(--text);
}
.art__byline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.5px;
  color: var(--text-dim);
}
.art__ava {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--accent-a) 45%, transparent);
}
.art__sep {
  opacity: 0.5;
}

/* body */
.art__body {
  font-family: var(--font-serif);
  font-size: 1.12rem;
  line-height: 1.95;
  color: var(--text-soft);
}
.art__body :deep(p) {
  margin: 0 0 22px;
}
.art__body :deep(> p:first-of-type)::first-letter {
  float: left;
  font-size: 3.6em;
  line-height: 0.78;
  padding: 0.06em 0.12em 0 0;
  color: var(--accent-a);
  font-weight: 700;
}
.art__body :deep(h2) {
  margin: 40px 0 16px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.3px;
  color: var(--text);
}
.art__body :deep(h2)::before {
  content: '§ ';
  color: var(--accent-a);
}
.art__body :deep(h3) {
  margin: 30px 0 12px;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  color: var(--text);
}
.art__body :deep(ul),
.art__body :deep(ol) {
  margin: 0 0 22px;
  padding-left: 26px;
}
.art__body :deep(li) {
  margin: 8px 0;
}
.art__body :deep(li)::marker {
  color: var(--accent-a);
}
.art__body :deep(strong) {
  color: var(--text);
  font-weight: 700;
}
.art__body :deep(em) {
  color: var(--accent-b);
  font-style: italic;
}
.art__body :deep(a) {
  color: var(--accent-a);
  border-bottom: 1px solid color-mix(in srgb, var(--accent-a) 45%, transparent);
}
.art__body :deep(blockquote) {
  margin: 26px 0;
  padding: 4px 0 4px 22px;
  border-left: 2px solid var(--accent-a);
  font-style: italic;
  color: var(--text);
}
.art__body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.82em;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(236, 230, 218, 0.08);
  color: var(--accent-a);
}
.art__body :deep(pre) {
  margin: 0 0 24px;
  padding: 16px 18px;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(236, 230, 218, 0.12);
  border-radius: 6px;
}
.art__body :deep(pre code) {
  padding: 0;
  background: none;
  color: var(--text-soft);
  font-size: 0.86rem;
  line-height: 1.7;
}

/* ends */
.ends {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 44px;
  padding-top: 26px;
  border-top: 1px solid color-mix(in srgb, var(--accent-a) 22%, transparent);
}
.end {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.end--r {
  text-align: right;
}
.end__lbl {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 1px;
  color: var(--accent-a);
}
.end__t {
  font-family: var(--font-serif);
  font-size: 1.02rem;
  color: var(--text-soft);
  transition: color 0.2s;
}
.end:hover .end__t {
  color: var(--text);
}

.art__back {
  margin-top: 30px;
  text-align: center;
}
.art__back button {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 1px;
  color: var(--text-dim);
  transition: color 0.2s;
}
.art__back button:hover {
  color: var(--accent-a);
}

/* states */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 90px 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--text-dim);
}
.state--err {
  color: var(--accent-b);
}
.ghost {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 1px;
  color: var(--accent-a);
  padding: 8px 16px;
  border: 1px solid color-mix(in srgb, var(--accent-a) 40%, transparent);
  border-radius: 4px;
}

@media (max-width: 540px) {
  .ends {
    grid-template-columns: 1fr;
  }
  .end--r {
    text-align: left;
  }
}
</style>

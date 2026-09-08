<script setup>
import { ref, computed, onMounted } from 'vue'
import config from '../config.js'
import { fetchPosts, fetchTags } from '../api/client.js'
import PostCard from './PostCard.vue'
import TagBar from './TagBar.vue'

const posts = ref([])
const tags = ref([])
const activeTag = ref('')
const ready = ref(false)

const filtered = computed(() =>
  activeTag.value
    ? posts.value.filter((p) => (p.tags || []).includes(activeTag.value))
    : posts.value
)

onMounted(async () => {
  const [p, t] = await Promise.all([fetchPosts(), fetchTags()])
  posts.value = p
  tags.value = t
  ready.value = true
})

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
            stroke-width="5"
            stroke-linecap="round"
            opacity="0.6"
          />
        </svg>
      </h1>
      <p class="hero__tagline">{{ hero.tagline }}</p>
      <p class="hero__sub">{{ hero.sub }}</p>
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
        :delay="0.22 + i * 0.06"
      />
      <p v-if="!filtered.length" class="list__empty">这个标签下还没有文章。</p>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 40px 0 26px;
  text-align: center;
}
.hero__title {
  position: relative;
  display: inline-block;
  font-family: var(--font-serif);
  font-size: clamp(2.4rem, 6vw, 3.4rem);
  letter-spacing: 10px;
  text-indent: 10px;
  color: var(--cream);
  text-shadow: 0 0 32px rgba(224, 179, 106, 0.35);
}
.hero__stroke {
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 78%;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 6px rgba(224, 179, 106, 0.5));
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

.list__tags {
  display: flex;
  justify-content: center;
  padding: 6px 0 30px;
}

.list__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding-bottom: 30px;
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
    padding-top: 24px;
  }
}
</style>

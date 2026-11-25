<script setup>
import { computed } from 'vue'
import { navigate } from '../composables/useHashRoute.js'

const props = defineProps({
  post: { type: Object, required: true },
  delay: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
})

// 烛金 / 余烬 / 苔绿 / 月银
const ACCENTS = ['var(--gold)', 'var(--ember)', 'var(--moss)', 'var(--moon)']
const accent = computed(() => ACCENTS[(props.post.accent || 0) % 4])

const open = () => navigate(`/p/${props.post.slug}`)
</script>

<template>
  <article
    class="card reveal"
    :class="{ 'is-featured': featured }"
    :style="{ '--delay': delay + 's', '--acc': accent }"
    @click="open"
  >
    <header class="card__meta">
      <time class="card__date">{{ post.date }}</time>
      <span v-if="featured" class="card__lead">✦ 置顶精选</span>
      <span v-else-if="post.pinned" class="card__pin">置顶</span>
      <span class="card__mins">{{ post.readMins }} 分钟阅读</span>
    </header>

    <h2 class="card__title">
      <a :href="`#/p/${post.slug}`" @click.prevent.stop="open">{{ post.title }}</a>
    </h2>

    <p class="card__excerpt">{{ post.excerpt }}</p>

    <footer class="card__foot">
      <span v-for="t in post.tags" :key="t" class="card__tag"># {{ t }}</span>
      <span class="card__more">读全文 →</span>
    </footer>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  padding: 24px 26px 21px;
  border-radius: var(--radius);
  background: linear-gradient(160deg, rgba(25, 20, 14, 0.92), rgba(18, 14, 9, 0.92));
  border: 1px solid var(--line);
  box-shadow: var(--card-shadow), inset 0 1px 0 rgba(241, 233, 215, 0.06);
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.45s var(--ease-out), box-shadow 0.45s var(--ease-out),
    border-color 0.45s;
}
.card.is-featured {
  grid-column: 1 / -1;
  padding: 30px 32px 26px;
  background: radial-gradient(
      90% 120% at 100% 0%,
      color-mix(in srgb, var(--acc) 10%, transparent),
      transparent 60%
    ),
    linear-gradient(160deg, rgba(28, 22, 15, 0.96), rgba(18, 14, 9, 0.94));
}

/* 左侧烛光脊，悬停时长高点亮 */
.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 24px;
  bottom: 72%;
  width: 3.5px;
  border-radius: 0 4px 4px 0;
  background: var(--acc);
  box-shadow: 0 0 12px color-mix(in srgb, var(--acc) 70%, transparent);
  transition: bottom 0.5s var(--ease-out);
}
.card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--acc) 45%, transparent);
  box-shadow: var(--card-shadow-hover);
}
.card:hover::before {
  bottom: 24px;
}

.card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.76rem;
  color: var(--cream-dim);
}
.card__date {
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
}
.card__pin,
.card__lead {
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #17130d;
  background: var(--acc);
}
.card__mins {
  margin-left: auto;
}

.card__title {
  margin: 12px 0 9px;
  font-family: var(--font-serif);
  font-size: 1.24rem;
  line-height: 1.45;
  letter-spacing: 0.5px;
  color: var(--cream);
}
.card.is-featured .card__title {
  font-size: clamp(1.45rem, 2.8vw, 1.85rem);
}
.card__title a {
  background-image: linear-gradient(var(--acc), var(--acc));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1.5px;
  transition: background-size 0.45s var(--ease-out), color 0.35s;
}
.card:hover .card__title a {
  background-size: 100% 1.5px;
  color: color-mix(in srgb, var(--acc) 65%, var(--cream));
}

.card__excerpt {
  font-size: 0.9rem;
  line-height: 1.75;
  color: var(--cream-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card.is-featured .card__excerpt {
  -webkit-line-clamp: 3;
  max-width: 68ch;
}

.card__foot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-top: auto;
  padding-top: 16px;
  font-size: 0.76rem;
}
.card__tag {
  padding: 2px 8px;
  border-radius: 6px;
  color: var(--cream-dim);
  background: rgba(241, 233, 215, 0.04);
  border: 1px solid rgba(229, 185, 110, 0.1);
}
.card__more {
  margin-left: auto;
  color: var(--acc);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.35s, transform 0.35s var(--ease-out);
}
.card:hover .card__more {
  opacity: 1;
  transform: translateX(0);
}
</style>

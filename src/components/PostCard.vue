<script setup>
import { computed } from 'vue'
import { navigate } from '../composables/useHashRoute.js'

const props = defineProps({
  post: { type: Object, required: true },
  delay: { type: Number, default: 0 }
})

// 烛金 / 余烬 / 苔绿 / 月银
const ACCENTS = ['var(--gold)', 'var(--ember)', 'var(--moss)', 'var(--moon)']
const accent = computed(() => ACCENTS[(props.post.accent || 0) % 4])

const open = () => navigate(`/p/${props.post.slug}`)
</script>

<template>
  <article
    class="card reveal"
    :style="{ '--delay': delay + 's', '--acc': accent }"
    @click="open"
  >
    <header class="card__meta">
      <time class="card__date">{{ post.date }}</time>
      <span v-if="post.pinned" class="card__pin">置顶</span>
      <span class="card__mins">{{ post.readMins }} 分钟</span>
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
  padding: 26px 28px 22px;
  border-radius: var(--radius);
  background: var(--night-2);
  border: 1px solid var(--line);
  box-shadow: var(--card-shadow);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.45s var(--ease-out), box-shadow 0.45s var(--ease-out),
    border-color 0.45s;
}
/* 左侧烛光脊，悬停时长高点亮 */
.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 26px;
  bottom: 70%;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: var(--acc);
  box-shadow: 0 0 10px color-mix(in srgb, var(--acc) 70%, transparent);
  transition: bottom 0.5s var(--ease-out);
}
.card:hover {
  transform: translateY(-5px);
  border-color: color-mix(in srgb, var(--acc) 45%, transparent);
  box-shadow: var(--card-shadow-hover);
}
.card:hover::before {
  bottom: 26px;
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
.card__pin {
  padding: 1px 9px;
  border-radius: 99px;
  font-size: 0.7rem;
  color: #1a1408;
  background: var(--acc);
}
.card__mins {
  margin-left: auto;
}

.card__title {
  margin: 10px 0 8px;
  font-family: var(--font-serif);
  font-size: 1.28rem;
  line-height: 1.45;
  letter-spacing: 0.5px;
  color: var(--cream);
}
.card__title a {
  background-image: linear-gradient(var(--acc), var(--acc));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 2px;
  transition: background-size 0.45s var(--ease-out), color 0.35s;
}
.card:hover .card__title a {
  background-size: 100% 2px;
  color: color-mix(in srgb, var(--acc) 60%, var(--cream));
}

.card__excerpt {
  font-size: 0.9rem;
  color: var(--cream-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__foot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  font-size: 0.78rem;
}
.card__tag {
  color: var(--cream-dim);
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

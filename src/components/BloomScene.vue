<script setup>
// 「夜航书馆」背景：暖黑夜色 + 一窗月晕 + 漂浮的流萤光尘。
// 纯 CSS、零图片，「拾光」具象化 —— 在夜里捡拾微光。

// 流萤：位置/大小/节奏由序号伪随机生成，刷新页面布局稳定
function flyStyle(n) {
  const seed = (n * 9301 + 49297) % 233280
  const r = seed / 233280
  const size = 2 + Math.round(r * 2.6)
  const palette = ['#e0b36a', '#e08a5d', '#d6c489', '#a9b8d6']
  return {
    left: ((n * 137) % 100) + '%',
    top: 12 + ((n * 53) % 80) + '%',
    width: size + 'px',
    height: size + 'px',
    background: palette[n % 4],
    color: palette[n % 4],
    animationDuration: 7 + (n % 6) * 2.4 + 's, ' + (2.2 + (n % 4) * 0.7) + 's',
    animationDelay: -(n * 1.7) + 's, ' + -(n * 0.5) + 's'
  }
}
</script>

<template>
  <div class="night" aria-hidden="true">
    <div class="night__moon" />
    <div class="night__flies">
      <span v-for="n in 16" :key="n" :style="flyStyle(n)" />
    </div>
    <div class="night__grain" />
    <div class="night__vignette" />
  </div>
</template>

<style scoped>
.night {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: radial-gradient(120% 90% at 50% 0%, #1c1710 0%, #131008 48%, #0c0a06 100%);
}

/* 顶部一窗暖色月晕，像台灯/烛光的余光 */
.night__moon {
  position: absolute;
  top: -22vh;
  left: 50%;
  width: 70vw;
  height: 52vh;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(224, 179, 106, 0.13), transparent 65%);
  filter: blur(30px);
  animation: moonBreath 9s var(--ease-in-out) infinite;
}
@keyframes moonBreath {
  50% {
    opacity: 0.65;
  }
}

/* 流萤光尘：缓慢上浮 + 呼吸明灭 */
.night__flies {
  position: absolute;
  inset: 0;
}
.night__flies span {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 8px 2px currentColor;
  opacity: 0.5;
  animation-name: flyDrift, flyGlow;
  animation-timing-function: ease-in-out, ease-in-out;
  animation-iteration-count: infinite, infinite;
}
@keyframes flyDrift {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(2.2vw, -4vh);
  }
  50% {
    transform: translate(-1.6vw, -8vh);
  }
  75% {
    transform: translate(1.4vw, -12vh);
  }
  100% {
    transform: translate(0, -16vh);
  }
}
@keyframes flyGlow {
  0%,
  100% {
    opacity: 0.12;
  }
  50% {
    opacity: 0.75;
  }
}

.night__grain {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.night__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(115% 95% at 50% 38%, transparent 45%, rgba(0, 0, 0, 0.52) 100%);
}

/* 移动端：少几只流萤、停掉位移（保留明灭），省电省 GPU */
@media (max-width: 640px) {
  .night__flies span:nth-child(n + 11) {
    display: none;
  }
  .night__flies span {
    animation-name: flyGlow;
  }
}

@media (prefers-reduced-motion: reduce) {
  .night__moon,
  .night__flies span {
    animation: none;
  }
}
</style>

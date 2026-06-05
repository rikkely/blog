<script setup>
// 纯装饰：暗夜文学刊物背景（暖黑底 + 细颗粒纸纹 + 柔和暗角）
</script>

<template>
  <div class="zine" aria-hidden="true">
    <div class="zine__tint" />
    <div class="zine__grain" />
    <div class="zine__vignette" />
  </div>
</template>

<style scoped>
.zine {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: #100f12;
}
.zine__tint {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(80% 50% at 50% -8%, rgba(217, 168, 95, 0.08), transparent 70%),
    radial-gradient(70% 60% at 100% 110%, rgba(154, 143, 176, 0.07), transparent 70%),
    linear-gradient(180deg, #131115, #0e0d10 60%, #0b0a0d);
}
.zine__grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.zine__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 100% at 50% 40%, transparent 58%, rgba(0, 0, 0, 0.5) 100%);
}
</style>

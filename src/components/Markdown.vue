<script setup lang="ts">
import { render } from '@/lib/markdown';
import { computedAsync } from '@vueuse/core';
import { twMerge } from 'tailwind-merge';

const props = defineProps<{ markdown: string; class?: string }>();

const html = computedAsync(() => render(props.markdown), null);
</script>

<template>
  <div
    :class="twMerge('prose prose-base prose-neutral max-w-none dark:prose-invert', props.class)"
    v-if="html !== null && props.markdown.length > 0"
    v-html="html"
  />
  <div :class="twMerge('flex flex-row items-center gap-x-0.5', props.class)" v-else>
    <div class="loading-indicator" style="animation-delay: 0s" />
    <div class="loading-indicator" style="animation-delay: 0.5s" />
    <div class="loading-indicator" style="animation-delay: 1s" />
  </div>
</template>

<style scoped>
.loading-indicator {
  @apply block h-1.5 w-1.5 rounded-full bg-text opacity-25;
  animation-name: loading-indicator;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes loading-indicator {
  0% {
    opacity: 25%;
  }

  50% {
    opacity: 50%;
  }

  100% {
    opacity: 25%;
  }
}
</style>

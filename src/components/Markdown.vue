<script setup lang="ts">
import { render } from '@/lib/markdown';
import { asyncComputed } from '@vueuse/core';
import { twMerge } from 'tailwind-merge';

const props = defineProps<{ markdown: string; class?: string }>();

const html = asyncComputed(() => render(props.markdown));
</script>

<template>
  <div
    :class="twMerge('prose prose-base prose-neutral max-w-none dark:prose-invert', props.class)"
    v-html="html"
  />
</template>

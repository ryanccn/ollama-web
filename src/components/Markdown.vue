<script setup lang="ts">
import { render } from '@/lib/markdown';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';

const props = defineProps<{ markdown: string; class?: string }>();
const html = computed(() => render(props.markdown));
</script>

<template>
  <div
    :class="twMerge('prose prose-neutral max-w-none dark:prose-invert', props.class)"
    v-html="html"
  ></div>
</template>

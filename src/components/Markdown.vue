<script setup lang="ts">
import { render } from '@/lib/markdown';
import { computed } from 'vue';
const props = defineProps<{ markdown: string }>();
const html = computed(() => render(props.markdown));
</script>

<template>
  <div class="prose dark:prose-invert prose-neutral" v-html="html"></div>
</template>

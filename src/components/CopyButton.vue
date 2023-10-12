<script setup lang="ts">
import { promiseTimeout } from '@vueuse/core';
import { ref } from 'vue';

import { ClipboardCheckIcon, ClipboardCopyIcon } from 'lucide-vue-next';

const props = defineProps<{ content: string }>();

const showSuccess = ref(false);

const copyText = async () => {
  await navigator.clipboard.writeText(props.content);
  showSuccess.value = true;
  await promiseTimeout(2500);
  showSuccess.value = false;
};
</script>

<template>
  <button
    title="Copy as Markdown"
    @click="copyText"
    class="p-0.5 opacity-50 transition-opacity hover:opacity-60"
  >
    <ClipboardCopyIcon v-if="!showSuccess" class="block h-4 w-4" />
    <ClipboardCheckIcon v-else class="block h-4 w-4" />
  </button>
</template>

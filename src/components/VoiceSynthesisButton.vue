<script setup lang="ts">
import { useSpeechSynthesis } from '@vueuse/core';

import { PlayCircleIcon, StopCircleIcon } from 'lucide-vue-next';

const props = defineProps<{ content: string }>();

const { isSupported, isPlaying, speak, stop } = useSpeechSynthesis(props.content);
const toggle = () => {
  if (isPlaying.value) stop();
  else speak();
};
</script>

<template>
  <button
    title="Play"
    @click="toggle"
    class="p-0.5 opacity-50 transition-opacity hover:opacity-60"
    v-if="isSupported"
  >
    <PlayCircleIcon v-if="!isPlaying" class="block h-4 w-4" />
    <StopCircleIcon v-else class="block h-4 w-4" />
  </button>
</template>

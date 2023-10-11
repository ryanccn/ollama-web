import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOllama = defineStore('ollama-info', () => {
  const ready = ref(false);
  const models = ref<string[]>([]);

  return {
    ready,
    models,
  };
});

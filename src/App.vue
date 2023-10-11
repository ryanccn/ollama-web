<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';

import { useOllama } from '@/stores/ollama';
import { useHead } from '@unhead/vue';

import Sidebar from './components/Sidebar.vue';

const ollama = useOllama();

const failed = ref(false);

useHead({ title: 'Ollama Web' });

const tryConnect = async () => {
  try {
    const modelsResp = await fetch('http://localhost:11434/api/tags');

    if (modelsResp.ok) {
      const { models } = (await modelsResp.json()) as { models: { name: string }[] };
      ollama.models = models.map((obj) => obj.name);

      window.setTimeout(() => {
        ollama.ready = true;
      }, 500);
    } else {
      failed.value = true;
      window.setTimeout(() => {
        tryConnect();
      }, 2500);
    }
  } catch (error) {
    failed.value = true;
    window.setTimeout(() => {
      tryConnect();
    }, 2500);
  }
};

onMounted(() => {
  tryConnect();
});

onMounted(() => {
  Notification.requestPermission();
});
</script>

<template>
  <div v-if="ollama.ready" class="fixed inset-0 flex flex-col md:flex-row">
    <Sidebar />

    <main class="relative h-full grow overflow-y-hidden [-webkit-transform:_translateZ(0);]">
      <RouterView />
    </main>
  </div>

  <div class="fixed inset-0 grid place-content-center font-medium" v-else>
    <span v-if="!failed">Connecting to Ollama</span>
    <div class="flex flex-col items-center gap-y-2" v-else>
      <span class="text-red-500 dark:text-red-400">Failed to connect to Ollama</span>
      <code class="select-all text-sm"
        >OLLAMA_ORIGINS="https://ollama.ryanccn.dev" ollama serve</code
      >
    </div>
  </div>
</template>

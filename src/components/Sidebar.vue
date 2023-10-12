<script setup lang="ts">
import { useChats } from '@/stores/chats';

import SidebarChatItem from './SidebarChatItem.vue';
import { PlusIcon, LaptopIcon, SunIcon, MoonIcon } from 'lucide-vue-next';

import { useRouter } from 'vue-router';
import { useColorMode } from '@vueuse/core';

const chats = useChats();

const { store: modeStore } = useColorMode();
const router = useRouter();

const createChat = () => {
  const newCreatedId = chats.create();
  router.push(`/c/${newCreatedId}`);
};

const nextColorMode = () => {
  if (modeStore.value === 'auto') modeStore.value = 'light';
  else if (modeStore.value === 'light') modeStore.value = 'dark';
  else modeStore.value = 'auto';
};
</script>

<template>
  <nav class="flex min-h-screen flex-col justify-between gap-y-2 bg-surface p-4 md:w-64">
    <div class="flex flex-col gap-y-2">
      <h1 class="mb-4 font-bold">Ollama Web</h1>

      <ol class="flex w-full flex-col gap-y-1">
        <SidebarChatItem v-for="(_, id) in chats.chats" :key="id" :id="id" />
      </ol>

      <button
        @click="createChat"
        class="flex flex-row items-center gap-x-2 rounded px-2 py-1 text-sm opacity-50 transition-opacity hover:opacity-60"
      >
        <PlusIcon class="block h-4 w-4" />
        <span>Create new</span>
      </button>
    </div>

    <div class="flex flex-col gap-y-2">
      <button
        class="self-start rounded p-1 opacity-50 transition-opacity hover:opacity-60"
        @click="nextColorMode"
      >
        <LaptopIcon class="block h-4 w-4" v-if="modeStore === 'auto'" />
        <SunIcon class="block h-4 w-4" v-else-if="modeStore === 'light'" />
        <MoonIcon class="block h-4 w-4" v-else-if="modeStore === 'dark'" />
      </button>
    </div>
  </nav>
</template>

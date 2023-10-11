<script setup lang="ts">
import { useChats } from '@/stores/chats';
import { PlusIcon } from 'lucide-vue-next';

import SidebarChatItem from './SidebarChatItem.vue';

import { useRouter } from 'vue-router';

const chats = useChats();

const router = useRouter();

const createChat = () => {
  const newCreatedId = chats.create();
  router.push(`/c/${newCreatedId}`);
};
</script>

<template>
  <nav class="flex flex-col gap-y-2 bg-neutral-100 p-4 dark:bg-neutral-900 md:w-64">
    <h1 class="mb-4 font-bold">Ollama Web</h1>

    <ol class="flex w-full flex-col gap-y-2 overflow-y-auto">
      <SidebarChatItem v-for="(_, id) in chats.chats" :key="id" :id="id" />
    </ol>

    <button
      @click="createChat"
      class="flex flex-row items-center gap-x-2 rounded px-2 py-1 text-sm opacity-50 transition-opacity hover:opacity-60"
    >
      <PlusIcon class="block h-4 w-4" />
      <span>Create new</span>
    </button>
  </nav>
</template>

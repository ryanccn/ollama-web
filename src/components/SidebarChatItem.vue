<script setup lang="ts">
import { toRefs } from '@vueuse/core';
import { twMerge } from 'tailwind-merge';

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChats } from '@/stores/chats';

import { TrashIcon, PencilIcon, SaveIcon } from 'lucide-vue-next';

const props = defineProps<{ id: string }>();
const { id } = toRefs(props);

const chats = useChats();

const title = ref(chats.chats[id.value]?.title ?? '');
const editingTitle = ref(false);

const router = useRouter();
const route = useRoute();
const currentChatId = computed(() => (route.name === 'chat' ? (route.params.id as string) : null));

const createChat = () => {
  const newCreatedId = chats.create();
  router.push(`/c/${newCreatedId}`);
};

const toggleEdit = () => {
  if (editingTitle.value === true) {
    chats.chats[id.value].title = title.value;
    editingTitle.value = false;
  } else {
    editingTitle.value = true;
  }
};

const deleteChat = () => {
  if (currentChatId.value === id.value) {
    const firstRemainingId = Object.keys(chats.chats).find((v) => v !== id.value);
    if (firstRemainingId) router.push(`/c/${firstRemainingId}`);
    else createChat();
  }

  chats.delete(id.value);
};
</script>

<template>
  <li
    :class="
      twMerge(
        'group relative flex w-full flex-row justify-between gap-x-3 rounded px-2 py-1 transition-colors',
        currentChatId === id ? 'bg-overlay' : null,
      )
    "
  >
    <RouterLink :to="`/c/${id}`" class="absolute inset-0 z-0 focus:ring-0 focus:ring-offset-0" />

    <span v-if="!editingTitle" class="line-clamp-1 block grow overflow-ellipsis text-sm">
      {{ chats.chats[id].title }}
    </span>
    <input v-else v-model="title" class="z-20 grow bg-transparent text-sm" />

    <div class="z-10 hidden shrink-0 flex-row gap-x-1 group-hover:flex">
      <button @click="toggleEdit">
        <PencilIcon v-if="!editingTitle" class="button-icon" />
        <SaveIcon v-else class="button-icon" />
      </button>
      <button @click="deleteChat">
        <TrashIcon class="button-icon" />
      </button>
    </div>
  </li>
</template>

<style scoped>
.button-icon {
  @apply block h-3 w-3 opacity-50 transition-opacity hover:opacity-75;
}
</style>

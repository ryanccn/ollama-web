<script setup lang="ts">
import { useChats, ChatActor } from '@/stores/chats';
import { useOllama } from '@/stores/ollama';
import { useRoute } from 'vue-router';

import { computed, ref, watchEffect } from 'vue';
import Markdown from '@/components/Markdown.vue';

import { twMerge } from 'tailwind-merge';
import { useHead } from '@unhead/vue';

const route = useRoute();

const decoder = new TextDecoder();

const ollama = useOllama();
const chats = useChats();
const chat = computed(() => chats.chats[route.params.id as string]);

const chatContainer = ref<HTMLDivElement | null>(null);

const shouldStopImmediately = ref(false);

watchEffect(() => {
  useHead({
    title: `${chat.value.title || route.params.id} · Ollama Web`,
  });
});

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

watchEffect(() => {
  if (chatContainer.value) scrollToBottom();
});

const generate = async () => {
  const prompt = chat.value.input;
  chat.value.input = '';

  scrollToBottom();

  chat.value.history = [
    ...chat.value.history,
    { id: crypto.randomUUID(), actor: ChatActor.HUMAN, content: prompt },
  ];

  chat.value.inProgress = true;

  const resp = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: chat.value.model,
      prompt: prompt,
      context: chat.value.context,
    }),
  });

  if (!resp.ok || !resp.body) {
    window.alert('Oops! An error occurred.');
    chat.value.inProgress = false;
    return;
  }

  const responseIdx = chat.value.history.length;
  chat.value.history = [
    ...chat.value.history,
    { id: crypto.randomUUID(), actor: ChatActor.BOT, content: '' },
  ];

  const reader = resp.body.getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (shouldStopImmediately.value) {
      shouldStopImmediately.value = false;
      break;
    }

    const chunk = await reader.read();

    if (chunk.value) {
      const chunkData = JSON.parse(decoder.decode(chunk.value)) as
        | {
            response: string;
            done: false;
          }
        | { context: number[]; done: true };

      if (!chunkData.done) {
        if (chunkData.response) {
          chat.value.history[responseIdx] = {
            ...chat.value.history[responseIdx],
            content: chat.value.history[responseIdx].content + chunkData.response,
          };
        }

        chat.value.history = [...chat.value.history];
        scrollToBottom();
      } else {
        chat.value.context = [...chat.value.context, ...chunkData.context];
        break;
      }
    }

    if (chunk.done) break;
  }

  chat.value.inProgress = false;
};

const generateOrStop = () => {
  if (!chat.value.inProgress) {
    generate();
  } else {
    shouldStopImmediately.value = true;
  }
};

const handleInputKeyboard = (ev: KeyboardEvent) => {
  if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
    generate();
  }
};
</script>

<template>
  <div
    v-if="chat"
    class="fixed inset-x-0 bottom-0 flex w-full flex-row gap-x-2 bg-neutral-50 p-4 dark:bg-neutral-950"
  >
    <input
      type="text"
      class="flex-grow rounded bg-neutral-100 px-3 py-2 text-base focus:outline-none focus:ring-2 dark:bg-neutral-900"
      v-model="chat.input"
      @keydown="handleInputKeyboard"
    />

    <button
      :class="
        twMerge(
          'rounded px-4 py-2 text-sm font-medium text-white disabled:opacity-75',
          chat.inProgress ? 'bg-red-500' : 'bg-blue-500',
        )
      "
      :disabled="!chat.inProgress && chat.input.length === 0"
      @click="generateOrStop"
    >
      <span v-if="!chat.inProgress">Send</span>
      <span v-else>Stop</span>
    </button>
  </div>

  <div class="flex h-screen flex-col gap-y-4 overflow-y-scroll pb-24" ref="chatContainer">
    <div class="flex flex-col gap-y-4 p-8">
      <label class="flex flex-col gap-y-0.5">
        <span class="text-sm font-medium opacity-50">Model</span>
        <select class="self-start rounded-lg px-3 py-2" v-model="chat.model">
          <option v-for="model in ollama.models" :value="model" :key="model">{{ model }}</option>
        </select>
      </label>
    </div>

    <ol v-if="chat" class="flex flex-col gap-y-4 p-8">
      <li
        v-for="item in chat.history"
        :key="item.id"
        :class="
          twMerge(
            'max-w-prose rounded-lg px-4 py-2 text-lg',
            item.actor === ChatActor.BOT
              ? 'self-start bg-neutral-100 dark:bg-neutral-900'
              : 'self-end bg-blue-500',
          )
        "
      >
        <Markdown
          :markdown="item.content"
          :class="item.actor === ChatActor.HUMAN ? 'text-white' : ''"
        />
      </li>
    </ol>
  </div>
</template>

<style scoped>
select {
  @apply bg-neutral-100 dark:bg-neutral-800;
}
</style>

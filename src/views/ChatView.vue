<script setup lang="ts">
import { useChats, ChatActor } from '@/stores/chats';
import { useOllama } from '@/stores/ollama';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { useWebNotification, useWindowFocus } from '@vueuse/core';

import { computed, ref, watchEffect } from 'vue';

import Markdown from '@/components/Markdown.vue';
import TimeAgo from '@/components/TimeAgo.vue';
import CopyButton from '@/components/CopyButton.vue';
import VoiceSynthesisButton from '@/components/VoiceSynthesisButton.vue';

import { twMerge } from 'tailwind-merge';

const route = useRoute();

const decoder = new TextDecoder();

const ollama = useOllama();
const chats = useChats();
const chat = computed(() => chats.chats[route.params.id as string]);

const chatContainer = ref<HTMLDivElement | null>(null);

const shouldStopImmediately = ref(false);

const isFocused = useWindowFocus();

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

type OllamaResponse =
  | {
      response: string;
      done: false;
    }
  | { context: number[]; done: true };

const generate = async () => {
  const prompt = chat.value.input;
  chat.value.input = '';

  chat.value.history = [
    ...chat.value.history,
    { id: crypto.randomUUID(), actor: ChatActor.HUMAN, content: prompt, timestamp: Date.now() },
  ];

  chat.value.inProgress = true;

  scrollToBottom();

  const resp = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: chat.value.model,
      prompt: prompt,
      context: chat.value.context,
      system: chat.value.system,
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
    { id: crypto.randomUUID(), actor: ChatActor.BOT, content: '', timestamp: Date.now() },
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
      const chunkData = JSON.parse(decoder.decode(chunk.value)) as OllamaResponse;

      if (!chunkData.done) {
        if (chunkData.response) {
          chat.value.history[responseIdx].content =
            chat.value.history[responseIdx].content + chunkData.response;
        }

        scrollToBottom();
      } else {
        chat.value.context = [...chunkData.context];
        break;
      }
    }

    if (chunk.done) break;
  }

  chat.value.inProgress = false;

  if (!isFocused.value) {
    const { isSupported, show } = useWebNotification({
      title: `${chat.value.title} (${chat.value.model})`,
      dir: 'auto',
      lang: 'en',
      body: chat.value.history[responseIdx].content,
      renotify: true,
      tag: chat.value.history[responseIdx].id,
    });

    if (isSupported.value) {
      await show();
    }
  }
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
    class="fixed inset-x-0 bottom-0 z-40 flex w-full flex-col gap-2 bg-base p-4 md:flex-row"
  >
    <input
      type="text"
      class="flex-grow rounded bg-surface px-3 py-2 text-text focus:outline-none focus:ring-2"
      v-model="chat.input"
      @keydown="handleInputKeyboard"
    />

    <button
      :class="
        twMerge(
          'rounded px-4 py-2 text-sm font-medium text-white disabled:opacity-75',
          chat.inProgress ? 'bg-danger' : 'bg-accent',
        )
      "
      :disabled="!chat.inProgress && chat.input.length === 0"
      @click="generateOrStop"
    >
      <span v-if="!chat.inProgress">Send</span>
      <span v-else>Stop</span>
    </button>
  </div>

  <div class="flex h-screen flex-col gap-y-4 overflow-y-scroll pb-64 md:pb-24" ref="chatContainer">
    <div class="flex flex-col gap-y-4 p-8">
      <label class="flex flex-col gap-y-0.5">
        <span class="text-sm font-medium opacity-50">Model</span>
        <select class="self-start rounded-lg px-3 py-2" v-model="chat.model">
          <option v-for="model in ollama.models" :value="model" :key="model">{{ model }}</option>
        </select>
      </label>

      <label class="flex flex-col gap-y-0.5">
        <span class="text-sm font-medium opacity-50">System prompt</span>
        <textarea
          v-model="chat.system"
          class="max-w-prose resize-y rounded bg-surface p-2"
        ></textarea>
      </label>
    </div>

    <ol v-if="chat" class="flex flex-col gap-y-4 p-8">
      <li
        v-for="item in chat.history"
        :key="item.id"
        :class="
          twMerge(
            'flex flex-col gap-y-1',
            item.actor === ChatActor.BOT ? 'items-start self-start' : 'items-end self-end',
          )
        "
      >
        <Markdown
          :markdown="item.content"
          :class="
            twMerge(
              'max-w-prose rounded-lg p-4',
              item.actor === ChatActor.BOT ? 'bg-surface' : 'bg-accent text-white',
            )
          "
        />

        <div class="flex flex-row flex-wrap items-center gap-x-2">
          <span class="text-xs opacity-50">
            <TimeAgo :date="item.timestamp" />
          </span>
          <CopyButton :content="item.content" />
          <VoiceSynthesisButton :content="item.content" />
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
select {
  @apply bg-surface;
}
</style>

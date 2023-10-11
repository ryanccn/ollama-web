import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type {} from '@vueuse/shared';

import { nanoid } from 'nanoid';
import { useOllama } from './ollama';

export const enum ChatActor {
  HUMAN,
  BOT,
}

export interface ChatHistory {
  id: string;
  actor: ChatActor;
  content: string;
  timestamp: number;
}

export interface ChatV1 {
  model: string;
  title: string;

  input: string;
  history: ChatHistory[];
  context: number[];
  inProgress: boolean;
}

export const useChats = defineStore('chats', () => {
  const chats = useStorage<Record<string, ChatV1>>('chats-v1', {});

  return {
    chats,
    create() {
      const id = nanoid(12);
      const models = useOllama().models;

      chats.value = {
        ...chats.value,
        [id]: {
          title: id,
          model: models[0],
          input: '',
          inProgress: false,
          history: [],
          context: [],
        },
      };

      return id;
    },
    delete(id: string) {
      const workingCopy = { ...chats.value };
      delete workingCopy[id];
      chats.value = workingCopy;
    },
  };
});

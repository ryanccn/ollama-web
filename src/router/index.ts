import { createRouter, createWebHistory } from 'vue-router';
import ChatView from '@/views/ChatView.vue';
import { useChats } from '@/stores/chats';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/c/:id',
      name: 'chat',
      component: ChatView,
      beforeEnter(to) {
        if (typeof to.params.id !== 'string') return false;

        const chats = useChats();
        const chat = chats.chats[to.params.id];

        if (chat === undefined) return false;
      },
    },
  ],
});

export default router;

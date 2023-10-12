import './assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { createHead } from '@unhead/vue';

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(router);

app.mount('#app');

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'stickyNote',
    component: () => import('../views/stickyNote.vue'),
  },
  {
    path: '/eatWhat',
    name: 'eatWhat',
    component: () => import('../views/eatWhat.vue'),
  },
  {
    path: '/drawLots',
    name: 'drawLots',
    component: () => import('../views/drawLots.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory('/funPage/'),
  routes:routes
});

export default router

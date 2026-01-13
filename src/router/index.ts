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
  {
    path: '/GestureParticle',
    name: 'GestureParticle',
    component: () => import('../views/GestureParticle.vue'),
  },
  {
    path: '/StockChart',
    name: 'StockChart',
    component: () => import('../views/StockChart.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory('/funPage/'),
  routes:routes
});

export default router

import { createWebHistory, createRouter } from 'vue-router'

import Question1 from '@/pages/Question1.vue'
import Question2 from '@/pages/Question2.vue'
import Question3 from '@/pages/Question3.vue'

const routes = [
  { path: '/', component: Question1 },
  { path: '/question2', component: Question2 },
  { path: '/question3', component: Question3 },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
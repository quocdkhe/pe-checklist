import { createMemoryHistory, createRouter } from 'vue-router'

import PEChecklist from '@/components/PEChecklist.vue'

const routes = [
  { path: '/', component: PEChecklist },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
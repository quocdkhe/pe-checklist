import { createWebHashHistory, createRouter } from 'vue-router'

import Question1 from '@/pages/Question1.vue'
import Question2 from '@/pages/Question2.vue'
import OdataConfig from '@/pages/OdataConfig.vue'
import EFDeleteCode from '@/pages/EFDeleteCode.vue'
import PaginationFormula from '@/pages/PaginationFormula.vue'

const routes = [
  { path: '/', component: Question1 },
  { path: '/question2', component: Question2 },
  { path: '/odata-config', component: OdataConfig },
  { path: '/ef-delete-code', component: EFDeleteCode },
  { path: '/pagination-formula', component: PaginationFormula },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
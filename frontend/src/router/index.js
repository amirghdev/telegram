import { createMemoryHistory, createRouter } from 'vue-router'


const routes = [
  // { path: '/', component: HomeView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export default router;
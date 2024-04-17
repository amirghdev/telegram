import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../view/home/HomePage.vue';
import LoginPage from '../view/login/LoginPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router;
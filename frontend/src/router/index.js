import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../view/home/HomePage.vue";
import LoginViewPage from "../view/login/LoginViewPage.vue";
import LoginPage from "../view/login/LoginPage.vue";
import EmailVerify from "../view/login/verify/EmailVerify.vue";
const routes = [
  { path: "/", name: "home", component: HomePage },
  {
    path: "/login",
    name: "login",
    component: LoginViewPage,
    children: [
      { path: "", name: "login-page", component: LoginPage },
      { path: "verify", name: "email-verify", component: EmailVerify },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;

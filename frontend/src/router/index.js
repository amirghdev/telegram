import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../view/home/HomePage.vue";
import SignUpViewPage from "../view/signup/SignUpViewPage.vue";
import SignUpPage from "../view/signup/SignUpPage.vue";
import EmailVerify from "../view/signup/verify/EmailVerify.vue";
const routes = [
  { path: "/", name: "home", component: HomePage },
  {
    path: "/signup",
    name: "signup-view",
    component: SignUpViewPage,
    children: [
      { path: "", name: "signup", component: SignUpPage },
      { path: "verify", name: "email-verify", component: EmailVerify },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;

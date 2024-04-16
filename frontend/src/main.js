import { createApp } from "vue";
import { createPinia } from "pinia"; // pinia (state managment)
import router from "./router/index"; // router
import "./style.css"; // tailwindcss
import App from "./App.vue";

const app = createApp(App);
// MiddleWare
app.use(createPinia());
app.use(router);
// Mount
app.mount("#app");

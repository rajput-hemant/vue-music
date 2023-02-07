import { createApp, type App } from "vue";
import { createPinia } from "pinia";

import VApp from "./App.vue";
import router from "./router";
import VeeValidate from "./includes/validation";
import { auth } from "./includes/firebase";

import "./assets/base.css";
import "./assets/main.css";

let app: App<Element>;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(VApp);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidate);

    app.mount("#app");
  }
});

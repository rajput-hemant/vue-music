import { createApp, type App } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";

import VApp from "./App.vue";
import router from "./router";
import i18n from "./includes/i18n";
import VeeValidate from "./includes/validation";
import Icon from "./directives/icon";
import GlobalComponents from "./includes/_global";
import { auth } from "./includes/firebase";
import progressBar from "./includes/progress-bar";

import "./assets/base.css";
import "./assets/main.css";
import "nprogress/nprogress.css";

registerSW({ immediate: true });

progressBar(router);

let app: App<Element>;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(VApp);

    app.use(createPinia());
    app.use(router);
    app.use(i18n);
    app.use(VeeValidate);
    app.use(GlobalComponents);
    app.directive("icon", Icon);

    app.mount("#app");
  }
});

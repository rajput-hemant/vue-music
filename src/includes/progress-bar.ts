import NProgress from "nprogress";
import type { Router } from "vue-router";

export default (router: Router) => {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
};

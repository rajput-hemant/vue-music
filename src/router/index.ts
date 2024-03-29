import { createRouter, createWebHistory } from "vue-router";

import useUserStore from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("@/views/Home.vue"),
    },
    {
      name: "about",
      path: "/about",
      component: () => import("@/views/About.vue"),
    },
    {
      name: "manage",
      path: "/manage",
      // alias: "/manage-music",
      component: () => import("@/views/Manage.vue"),
      /* not required as Global Guard is set */
      // beforeEnter: (to, from, next) => {
      //   const userStore = useUserStore();
      //   console.log("Manage Route Guard");

      //   if (userStore.userLoggedIn) {
      //     next();
      //   } else {
      //     next({ name: "home" });
      //   }
      // },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/manage-music",
      redirect: { name: "manage" },
    },
    {
      name: "song",
      path: "/song/:id",
      component: () => import("@/views/Song.vue"),
    },
    {
      path: "/:catchAll(.*)*",
      redirect: { name: "home" },
    },
  ],
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }
  const userStore = useUserStore();

  if (userStore.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;

<script setup lang="ts">
import MainHeader from "@/components/Header.vue";
import Auth from "@/components/Auth.vue";
import Player from "@/components/Player.vue";
import useUserStore from "@/stores/user";
import { auth as firebaseAuth } from "./includes/firebase";

const userStore = useUserStore();

if (firebaseAuth.currentUser) {
  userStore.userLoggedIn = true;
}

/* using Options API */
// export default {
//   name: "App",
//   components: {
//     MainHeader,
//     Auth,
//   },
// };
</script>

<template>
  <!-- Header -->
  <main-header />

  <router-view v-slot="{ Component }">
    <!-- transition won't work if components have multiple root elements -->
    <transition name="fade" mode="out-in">
      <!-- this is a ghost component, the component we pass in `is` property will be rendered in this ghost component  -->
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- Player -->
  <player />

  <!-- Auth Modal -->
  <auth />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>

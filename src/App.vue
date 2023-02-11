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

  <router-view />

  <!-- Player -->
  <player />

  <!-- Auth Modal -->
  <auth />
</template>

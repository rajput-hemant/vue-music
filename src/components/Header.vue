<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

const route = useRoute();
const router = useRouter();
const i18n = useI18n();

const modalStore = useModalStore();
const userStore = useUserStore();

const toggleAuthModal = () => {
  modalStore.isOpen = !modalStore.isOpen;
};

const signOut = () => {
  userStore.signOut();

  if (route.name === "manage") {
    router.push({ name: "home" });
  }
};

const changeLocale = () => {
  i18n.locale.value = i18n.locale.value === "en" ? "fr" : "en";
};

const currentLocale = computed(() => {
  return i18n.locale.value === "fr" ? "Fr" : "En";
});

/* using Options API */
// export default {
//   name: "AppHeader",
//   data() {
//     return {
//       //
//     };
//   },
//   computed: {
//     ...mapStores(useModalStore),
//     ...mapWritableState(useModalStore, ["isOpen"]),
//   },
//   methods: {
//     toggleAuthModal() {
//       /**
//        * In this case, we are using the mapWritableState helper
//        * to map the isOpen state to the component's data.
//        *
//        * This is a shorthand for the following:
//        * this.modalStore.isOpen = !this.modalStore.isOpen;
//        */
//       this.isOpen = !this.isOpen;
//       // this.modalStore.isOpen = !this.modalStore.isOpen;
//     },
//   },
// };
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        to="/"
        exact-active-class="no-active"
        >Vue Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link to="/about" class="px-2 text-white">About</router-link>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" to="/manage"
                >Manage</router-link
              >
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click="signOut">Logout</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a href="#" @click.prevent="changeLocale" class="px-2 text-white"
              >{{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

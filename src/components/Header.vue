<script lang="ts">
import { mapStores, mapWritableState } from "pinia";

import useModalStore from "@/stores/modal";

export default {
  name: "AppHeader",
  data() {
    return {
      //
    };
  },
  computed: {
    ...mapStores(useModalStore),
    ...mapWritableState(useModalStore, ["isOpen"]),
  },
  methods: {
    toggleAuthModal() {
      /**
       * In this case, we are using the mapWritableState helper
       * to map the isOpen state to the component's data.
       *
       * This is a shorthand for the following:
       * this.modalStore.isOpen = !this.modalStore.isOpen;
       */
      this.isOpen = !this.isOpen;
      // this.modalStore.isOpen = !this.modalStore.isOpen;
    },
  },
};
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#"
        >Vue Music</a
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <a class="px-2 text-white" href="#" @click="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <li>
            <a class="px-2 text-white" href="#">Manage</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

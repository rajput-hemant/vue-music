<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import type firebase from "firebase/app";

import { songsCollection } from "@/includes/firebase";
import SongItem from "@/components/SongItem.vue";
import vIconSecondary from "@/directives/icon-secondary";
import type { Song } from "@/@types";

const songs = ref<Song[]>([]);
const pendingRequest = ref(false);
const maxPerPage = 25;

/**
 * Get songs from firestore
 * This function will load songs from firestore and append them to the songs array
 */
const getSongs = async () => {
  if (pendingRequest.value) return;

  pendingRequest.value = true;

  let snapshots: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

  if (songs.value.length) {
    const lastDoc = await songsCollection
      .doc(songs.value[songs.value.length - 1].id)
      .get();

    snapshots = await songsCollection
      .orderBy("modified_name", "asc")
      .startAfter(lastDoc)
      .limit(maxPerPage)
      .get();
    4;
  } else {
    snapshots = await songsCollection
      .orderBy("modified_name", "asc")
      .limit(maxPerPage)
      .get();
  }

  snapshots.forEach((doc) => {
    const song = {
      ...doc.data(),
      id: doc.id,
    };
    songs.value.push(song as Song);
  });

  pendingRequest.value = false;
};

/**
 * Handle scroll event
 * On reaching the bottom of the page, this function will load more songs
 */
const handleScroll = () => {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;

  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    getSongs();
  }
};

onBeforeMount(async () => {
  await getSongs();

  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <!-- using Global Directives, using args & modifiers -->
        <!-- v-icon.right.yellow="'headphones-alt'" -->
        <!-- using Local Directives, using Object Syntax -->
        <div
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item
            v-for="song in songs"
            :key="song.id"
            :song="song"
            :index="song.id"
          />
        </ol>
        <!-- end Playlist -->
      </div>
    </section>
  </main>
</template>

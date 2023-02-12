<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import type firebase from "firebase/app";

import { auth, songsCollection } from "@/includes/firebase";
import CompositionItem from "@/components/CompositionItem.vue";
import Upload from "@/components/Upload.vue";
import type { Song } from "@/@types";

const uploadRef = ref<InstanceType<typeof Upload> | null>(null);
const songs = ref<Song[]>([]);
const unsavedFlag = ref(false);

onBeforeMount(async () => {
  const snapshot = await songsCollection
    .where("uid", "==", auth.currentUser!.uid)
    .get();

  snapshot.forEach(addSong);
});

const addSong = (
  document: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) => {
  const song = {
    ...document.data(),
    id: document.id,
  };

  songs.value.push(song as Song);
};

const updateSongs = (i: number, values: any) => {
  songs.value[i].modified_name = values.modified_name;
  songs.value[i].genre = values.genre;
};

const removeSong = (i: number) => {
  songs.value.splice(i, 1);
};

const updateUnsavedFlag = (value: boolean) => {
  unsavedFlag.value = value;
};

onBeforeRouteLeave((to, from, next) => {
  // uploadRef.value?.cancelUploads();

  if (!unsavedFlag.value) {
    next();
  } else {
    const leave = confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );

    next(leave);
  }

  // next();
});
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload ref="uploadRef" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t("manage.my_songs") }}</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.id"
              :song="song"
              :index="i"
              :updateSong="updateSongs"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

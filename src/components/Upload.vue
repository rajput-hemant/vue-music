<script setup lang="ts">
import { ref } from "vue";

import { storage } from "@/includes/firebase";

const isDragOver = ref(false);
const uploads: any = ref([]);

const upload = ($event: DragEvent) => {
  isDragOver.value = false;

  const files = [...$event.dataTransfer!.files];

  files.forEach((file) => {
    if (file.type !== "audio/mpeg") {
      return;
    }

    const storageRef = storage.ref(); // example.appspot.com
    const songsRef = storageRef.child(`songs/${file.name}`); // example.appspot.com/songs/Just another song.mp3
    const task = songsRef.put(file);

    const uploadIndex =
      uploads.value.push({
        task,
        name: file.name,
        current_progress: 0,
      }) - 1;

    task.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      console.log("Upload is " + progress + "% done");

      uploads.value[uploadIndex].current_progress = progress;
    });
  });
};
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="upload($event)"
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{
          'bg-green-400 text-white border-green-400 border-solid': isDragOver,
        }"
      >
        <h5>Drop your files here</h5>
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm">{{ upload.name }}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="'bg-blue-400'"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

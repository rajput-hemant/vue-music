<script setup lang="ts">
import { ref } from "vue";

import { storage, auth, songsCollection } from "@/includes/firebase";

const isDragOver = ref(false);
const uploads: any = ref([]);

/* cancel upload on navigating away from page */
// using onBeforeUnmount hook
// onBeforeUnmount(async () => {
//   uploads.value.forEach((upload: any) => {
//     upload.task.cancel();
//   });
// });

// using ref to access component instance
const cancelUploads = () => {
  uploads.value.forEach((upload: any) => {
    upload.task.cancel();
  });
};

const upload = ($event: DragEvent | Event) => {
  isDragOver.value = false;

  // get files from datatranfer.files if file is dropped into dropbox
  // else, get file from event target of file input field
  const files = ($event as DragEvent).dataTransfer
    ? [...($event as DragEvent).dataTransfer!.files]
    : // @ts-ignore
      [...$event.target!.files];
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
        variant: "bg-blue-400",
        icon: "fas fa-spinner fa-spin",
        text_class: "",
      }) - 1;

    task.on(
      "state_changed",
      // Progress
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log("Upload is " + progress + "% done");

        uploads.value[uploadIndex].current_progress = progress;
      },
      // Error
      (error) => {
        uploads.value[uploadIndex].variant = "bg-red-400";
        uploads.value[uploadIndex].icon = "fas fa-exclamation-triangle";
        uploads.value[uploadIndex].text_class = "text-red-400";
        console.log(error);
      },
      // Complete / Success
      async () => {
        const song = {
          uid: auth.currentUser!.uid,
          display_name: auth.currentUser!.displayName,
          original_name: task.snapshot.ref.name,
          modified_name: task.snapshot.ref.name,
          genre: "",
          comment_count: 0,
          url: null,
        };

        song.url = await task.snapshot.ref.getDownloadURL();
        await songsCollection.add(song);

        uploads.value[uploadIndex].variant = "bg-green-400";
        uploads.value[uploadIndex].icon = "fas fa-check";
        uploads.value[uploadIndex].text_class = "text-green-400";
      }
    );
  });
};

defineExpose({ cancelUploads });
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
      <!-- File Input Field -->
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon" />{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from "@/@types";

defineProps<{
  song: Song;
  index: string;
}>();
</script>

<template>
  <li
    :id="`song-id-${song.id}`"
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50 example"
    :class="`song-id-${song.id}`"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.id } }"
        class="font-bold block text-gray-600 composition-name"
      >
        {{ song.modified_name }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.id }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span @click="navigate" class="comments">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>
</template>

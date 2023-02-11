<script setup lang="ts">
import usePlayerStore from "@/stores/player";

const playerStore = usePlayerStore();
</script>

<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div v-if="playerStore.current_song.modified_name" class="text-center">
      <span class="song-title font-bold">
        {{ playerStore.current_song.modified_name }}
      </span>
      by
      <span class="song-artist">
        {{ playerStore.current_song.display_name }}
      </span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="playerStore.toggleAudio">
        <i
          class="fa text-gray-500 text-xl"
          :class="{
            'fa-play': !playerStore.playing,
            'fa-pause': playerStore.playing,
          }"
        ></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ playerStore.seek }}</div>
      <!-- Scrub Container  -->
      <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: playerStore.player_progress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerStore.player_progress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ playerStore.duration }}</div>
    </div>
  </div>
</template>

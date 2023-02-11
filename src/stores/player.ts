import { defineStore } from "pinia";
import { Howl } from "howler";

import type { Song } from "@/@types";
import { formatTime } from "@/includes/helper";

export default defineStore({
  id: "player",
  state: () => ({
    current_song: {} as Song,
    sound: {} as Howl,
    seek: "00:00",
    duration: "00:00",
    player_progress: "0%",
  }),

  actions: {
    async newSong(song: Song) {
      // @ts-ignore
      if (this.sound.playing) {
        this.toggleAudio();
        return;
      }
      this.current_song = song;

      this.sound = new Howl({
        src: [song.url!],
        html5: true,
      });

      this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },

    async toggleAudio() {
      if (!this.sound.playing) return;

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },

    progress() {
      this.seek = formatTime(this.sound.seek());
      this.duration = formatTime(this.sound.duration());

      this.player_progress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
  },

  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
});

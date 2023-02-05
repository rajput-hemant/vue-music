import { defineStore } from "pinia";

export default defineStore({
  id: "modal",
  state: () => ({
    isOpen: false,
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? "hidden" : "";
    },
  },
});

<script setup lang="ts">
import { ref } from "vue";

import { songsCollection, storage } from "@/includes/firebase";

const props = defineProps<{
  song: {
    docId: string;
    original_name: string;
    modified_name: string;
    genre: string;
  };
  index: number;
  updateSong: (
    i: number,
    values: {
      modified_name: string;
      genre: string;
    }
  ) => void;
  removeSong: (i: number) => void;
  updateUnsavedFlag?: (value: boolean) => void;
}>();

// const props = defineProps({
//   song: {
//     type: Object,
//     required: true,
//   },
//   updateSong: {
//     type: Function,
//     required: true,
//   },
//   index: {
//     type: Number,
//     required: true,
//   },
// });

const showForm = ref(false);

const schema = {
  modified_name: "required",
  genre: "alpha_spaces",
};

const inSubmission = ref(false),
  showAlert = ref(false),
  alertVariant = ref("bg-blue-500"),
  alertMessage = ref("Please Wait! Updating song info.");

const edit = async (values: typeof props.song) => {
  inSubmission.value = true;
  showAlert.value = true;
  alertVariant.value = "bg-blue-500";

  try {
    await songsCollection.doc(props.song.docId).update(values);
  } catch (error: any) {
    alertVariant.value = "bg-red-500";
    alertMessage.value = error.message;
    inSubmission.value = false;
    return;
  }

  // call updateSong fn to update the UI
  props.updateSong(props.index, values);

  // call updateUnsavedFlag fn to update the unsaved flag
  props.updateUnsavedFlag?.(false);

  alertVariant.value = "bg-green-500";
  alertMessage.value = "Song info updated successfully!";
  showForm.value = false;
};

const deleteSong = async () => {
  const storageRef = storage.ref();
  const songRef = storageRef.child(`songs/${props.song.original_name}`);

  // delete song from firebase storage
  await songRef.delete();

  // delete song from firestore bd
  await songsCollection.doc(props.song.docId).delete();

  // call removeSong fn to delete the song & update the UI
  props.removeSong(props.index);
};
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-lg font-bold">
        {{ props.song.modified_name }}
      </h4>
      <button
        @click.prevent="deleteSong"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <!-- Alert -->
      <div
        class="text-white text-center font-bold p-4 rounded mb-4"
        v-if="showAlert"
        :class="alertVariant"
      >
        {{ alertMessage }}
      </div>
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="props.updateUnsavedFlag?.(true)"
          />
          <error-message class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="props.updateUnsavedFlag?.(true)"
          />
          <error-message class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          :disabled="inSubmission"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          type="button"
          :disabled="inSubmission"
          @click.prevent="showAlert = false"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

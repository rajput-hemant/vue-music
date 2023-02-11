<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { FormContext } from "vee-validate";

import { songsCollection, auth, commentsCollection } from "@/includes/firebase";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";
import type { Song, Comment } from "@/@types";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const playerStore = usePlayerStore();

const song = ref<Song>(null!);
const comments = ref<Comment[]>([]);
const sortOrder = ref("latest");

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    if (sortOrder.value === "latest") {
      return (
        new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      );
    }

    return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
  });
});

watch(sortOrder, (value: string) => {
  if (route.query.sort === value) {
    return;
  }

  router.push({
    query: { sort: value },
  });
});

onBeforeMount(async () => {
  const songId = route.params.id as string;
  const snapshot = await songsCollection.doc(songId).get();

  if (!snapshot.exists) {
    router.push({ name: "home" });
  }

  const { sort } = route.query;
  sortOrder.value = sort === "latest" || sort === "oldest" ? sort : "latest";

  song.value = snapshot.data() as Song;

  await getComments();
});

const schema = {
  comment: "required|min:3",
};

const inSubmission = ref(false),
  showAlert = ref(false),
  alertVariant = ref("bg-blue-500"),
  alertMessage = ref("Please Wait! Your comment is being submitted.");

const addComment = async (
  values: typeof schema,
  { resetForm }: FormContext
) => {
  inSubmission.value = true;
  showAlert.value = true;
  alertVariant.value = "bg-blue-500";
  alertMessage.value = "Please Wait! Your comment is being submitted.";

  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: route.params.id,
    name: auth.currentUser!.displayName,
    uid: auth.currentUser!.uid,
  };

  await commentsCollection.add(comment);

  // update song comment count
  song.value.comment_count += 1;
  await songsCollection.doc(route.params.id as string).update({
    comment_count: song.value.comment_count,
  });

  // get latest comments
  await getComments();

  inSubmission.value = false;
  alertVariant.value = "bg-green-500";
  alertMessage.value = "Your comment has been submitted successfully.";

  resetForm();
};

const getComments = async () => {
  const snapshot = await commentsCollection
    .where("sid", "==", route.params.id)
    .get();

  // reset comments
  comments.value = [];

  snapshot.forEach((doc) => {
    const comment = {
      id: doc.id,
      ...doc.data(),
    };

    comments.value.push(comment as Comment);
  });
};
</script>

<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        @click.prevent="playerStore.newSong(song)"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i
          class="fas"
          :class="{
            'fa-play': !playerStore.playing,
            'fa-pause': playerStore.playing,
          }"
        ></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song?.modified_name }}</div>
        <div>{{ song?.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song?.comment_count }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          v-if="showAlert"
          :class="alertVariant"
          class="text-white text-center font-bold p-4 mb-4"
        >
          {{ alertMessage }}
        </div>
        <vee-form
          v-if="userStore.userLoggedIn"
          :validation-schema="schema"
          @submit="addComment"
        >
          <vee-field
            name="comment"
            as="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></vee-field>
          <error-message class="text-red-600" name="comment" />
          <button
            :disabled="inSubmission"
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
          >
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select
          v-model="sortOrder"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      :key="comment.id"
      v-for="comment in sortedComments"
      class="p-6 bg-gray-50 border border-gray-200"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>{{ comment.content }}</p>
    </li>
  </ul>
</template>

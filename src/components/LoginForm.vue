<script setup lang="ts">
import { ref } from "vue";

import useUserStore from "@/stores/user";

const { authenticate } = useUserStore();

const logInSubmission = ref(false),
  logShowAlert = ref(false),
  logAlertVariant = ref("bg-blue-500"),
  logAlertMsg = ref("Please Wait! We are Logging you in.");

const inputClasses =
  "block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded";

const loginSchema = {
  email: "required|min:3|max:100|email",
  password: "required|min:9|max:100|exclude:password",
};
const login = async (userData: typeof loginSchema) => {
  logShowAlert.value = true;
  logInSubmission.value = true;
  logAlertVariant.value = "bg-blue-500";
  logAlertMsg.value = "Please Wait! You are being logged in.";

  try {
    await authenticate(userData);
  } catch (error: any) {
    logAlertVariant.value = "bg-red-500";
    logInSubmission.value = false;
    logAlertMsg.value = error.message;
    return;
  }

  logAlertVariant.value = "bg-green-500";
  logAlertMsg.value = "You are now logged in!";
  window.location.reload();
};
</script>

<template>
  <!-- Alert -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="logShowAlert"
    :class="logAlertVariant"
  >
    {{ logAlertMsg }}
  </div>
  <!-- Login Form -->
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        :class="inputClasses"
        placeholder="Enter Email"
      />
      <error-message class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        :class="inputClasses"
        placeholder="Password"
      />
      <error-message class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

import useUserStore from "@/stores/user";

const { register: registerUser } = useUserStore();

const regInSubmission = ref(false),
  regShowAlert = ref(false),
  regAlertVariant = ref("bg-blue-500"),
  regAlertMsg = ref("Please Wait! Your account is being created.");

const schema = {
  name: "required|min:3|max:100|alpha_spaces",
  email: "required|min:3|max:100|email",
  age: "required|min_value:18|max_value:100",
  password: "required|min:9|max:100|exclude:password",
  confirm_password: "password_mismatch:@password",
  country: "required|country_excluded:Antarctica",
  tos: "tos",
};

const userData = {
  country: "India",
};

const register = async (userData: typeof schema) => {
  regShowAlert.value = true;
  regInSubmission.value = true;
  regAlertVariant.value = "bg-blue-500";
  regAlertMsg.value = "Please Wait! Your account is being created.";

  try {
    await registerUser(userData);
  } catch (error: any) {
    regAlertVariant.value = "bg-red-500";
    regInSubmission.value = false;
    regAlertMsg.value = error.message;
    return;
  }

  regAlertVariant.value = "bg-green-500";
  regAlertMsg.value = "Account Created Successfully!";
  window.location.reload();
};

const inputClasses =
  "block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded";
</script>

<template>
  <!-- Alert -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="regShowAlert"
    :class="regAlertVariant"
  >
    {{ regAlertMsg }}
  </div>

  <!-- Registration Form -->
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        name="name"
        type="text"
        :class="inputClasses"
        placeholder="Enter Name"
      />
      <error-message class="text-red-600" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field name="age" type="number" :class="inputClasses" />
      <error-message class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <!-- setting :bails="false" won't stop validation on first error -->
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          :class="inputClasses"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div></vee-field
      >
      <!-- <error-message class="text-red-600" name="password" /> -->
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        name="confirm_password"
        type="password"
        :class="inputClasses"
        placeholder="Confirm Password"
      />
      <error-message class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field as="select" name="country" :class="inputClasses">
        <option value="India">India</option>
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <error-message class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <i18n-t class="inline-block" keypath="register.accept" tag="label"
        ><a href="#">{{ $t("register.tos") }}</a></i18n-t
      >
      <vee-field
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <error-message class="block text-red-600" name="tos" />
    </div>
    <button
      type="submit"
      :disabled="regInSubmission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

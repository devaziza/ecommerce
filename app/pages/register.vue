<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuth";

const store = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => { 
  await store.registerUser({
    name: name.value,
    email: email.value,
    password: password.value,
  });
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg bg-white">
    <h1 class="text-2xl font-bold mb-4">Register</h1>

    <div class="mb-4">
      <label class="block mb-1">Name</label>
      <input v-model="name" type="text" class="border rounded w-full p-2" />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Email</label>
      <input v-model="email" type="email" class="border rounded w-full p-2" />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Password</label>
      <input
        v-model="password"
        type="password"
        class="border rounded w-full p-2"/>
    </div>

    <button
      @click="handleRegister"
      class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      :disabled="store.getLoading"
    >
      {{ store.getLoading ? "Registering..." : "Register" }}
    </button>

    <p v-if="store.getError" class="text-red-500 mt-3">{{ store.getError }}</p>
    <p v-if="store.getUser" class="text-green-600 mt-3">
      ✅ {{ store.getUser.name }} registered successfully!
    </p>
  </div>
</template>

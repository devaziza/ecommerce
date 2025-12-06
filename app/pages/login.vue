<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuth";
definePageMeta({
  middleware: ["auth-role"],
});
const store = useAuthStore();

const email = ref("@gmail.com");
const password = ref("123456");

const handleLogin = async () => {
  try {
    await store.loginUser({
      email: email.value,
      password: password.value,
    });

    // If login failed → do not continue
    if (!store.isAuthenticated || !store.user) return;

    // Redirect based on role
    if (store.user.role === "admin") {
      return navigateTo("/admin");
    } else {
      return navigateTo("/");
    }
  } catch (err) {
    console.error("Login failed:", err);
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-xl bg-gray-50">
    <h1 class="text-2xl font-bold mb-4">Login</h1>

    <div class="mb-4">
      <label class="block mb-1">Email</label>
      <input v-model="email" type="email" class="border rounded w-full p-2" />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Password</label>
      <input
        v-model="password"
        type="password"
        class="border rounded w-full p-2"
      />
    </div>

    <button
      @click="handleLogin"
      class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      :disabled="store.getLoading"
    >
      {{ store.getLoading ? "Logging in..." : "Login" }}
    </button>

    <p v-if="store.getError" class="text-red-500 mt-3">
      {{ store.getError }}
    </p>

    <p v-if="store.getUser" class="text-green-600 mt-3">✅ Welcome back!</p>
  </div>
</template>

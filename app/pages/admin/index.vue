<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuth";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: ["auth-role"],
  layout: "admin",
});

const store = useAuthStore();

// 1. Foydalanuvchini tekshiramiz
// if (!auth.user || auth.user.role !== 'admin') {
//   router.push('/'); // oddiy user kelsa, bosh sahifaga yuboramiz
// }

// 2. Logout funksiyasi
const handleLogout = async () => {
  await store.logout(); // cookie + user tozalanadi
  return navigateTo("/login");
};

onMounted(() => {
  store.fetchUser();
});
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10 p-6 rounded-xl shadow-lg bg-white">
    <h1 class="text-3xl font-bold mb-4 text-green-700">👑 Admin Dashboard</h1>

    <p class="text-gray-700 mb-6">Xush kelibsiz, admin!</p>

    <div class="space-y-3">
      <button
        @click="handleLogout"
        class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  </div>
</template>

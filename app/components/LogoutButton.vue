<script setup lang="ts">
import { useAuthStore } from "@/stores/useAuth";
import { useRouter } from "#imports";

const store = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await store.logout();        // token va user ni tozalaydi
  router.push("/login");       // login sahifaga yo‘naltiradi
};
</script>

<template>
  <button @click="handleLogout" class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
    Logout
  </button>
</template>

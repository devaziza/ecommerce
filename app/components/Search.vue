<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const search = ref("");
const route = useRoute();
const router = useRouter();

const handleSearch = () => {
  if (search.value.trim()) {
    // Foydalanuvchini /search sahifasiga qidiruv so'zi bilan birga yo'naltiramiz
    // URL shunday ko'rinadi: /search?q=so'zingiz
    navigateTo({
      path: "/search",
      query: {
        q: search.value.trim(),
      },
    });
  }
};

watch(search, (newVal) => {
  if (!newVal.trim()) {
    if (route.path === "/search") {
      router.back();
    }
  }
});
</script>

<template>
  <form @submit.prevent="handleSearch" class="flex w-full justify-center">
    <div class="flex w-full justify-center items-center space-x-8">
      <input
        @keyup="handleSearch"
        v-model="search"
        type="text"
        placeholder="Searching for products…"
        class="hidden lg:flex w-[400px] gap-6 border border-gray-200 bg-white rounded-2xl shadow-lg py-2 px-4"
      />
    </div>
  </form>
</template>

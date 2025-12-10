<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  class?: string;
  placeholder?: string;
}>();

const searchQuery = ref("");
const isSearchOpen = ref(false);
const route = useRoute();
const router = useRouter();

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Foydalanuvchini /search sahifasiga qidiruv so'zi bilan birga yo'naltiramiz
    // URL shunday ko'rinadi: /search?q=so'zingiz
    navigateTo({
      path: "/search",
      query: {
        q: searchQuery.value.trim(),
      },
    });
    isSearchOpen.value = false;
    searchQuery.value = "";
  }
};
</script>

<template>
  <form @submit.prevent="handleSearch">
    <input
      v-model="searchQuery"
      @keyup.enter="handleSearch"
      type="text"
      :placeholder="placeholder || 'Search products, categories...'"
      :class="['w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300 group-hover:border-gray-300', props.class]"
    />
  </form>
</template>

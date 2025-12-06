<script setup lang="ts">
import { useUI } from "~/composables/useUI";
import { useCategoryStore } from "~/stores/useCategory";

const categoriesStore = useCategoryStore();
onMounted(() => {
  categoriesStore.fetchCategories();
});

const { isNav } = useUI();
</script>

<template>
  <aside
    class="fixed top-20 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300"
    :class="isNav ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="p-4 flex justify-between items-center border-b">
      <h2 class="text-xl font-bold">Categories</h2>
      <button @click="isNav = false">✕</button>
    </div>
    <ul class="p-4 flex flex-col gap-2">
      <li
        v-for="cat in categoriesStore.categories"
        :key="cat.id"
        class="hover:bg-gray-100 p-2 rounded cursor-pointer"
      >
        {{ cat.name }}
      </li>
    </ul>
  </aside>
  <!-- Overlay for mobile -->
  <div
    v-if="isNav"
    @click="isNav = false"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
  ></div>
</template>

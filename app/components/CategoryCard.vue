<script setup>
import { useCategoryStore } from "~/stores/useCategory";

const categoriesStore = useCategoryStore();

onMounted(async () => {
  await categoriesStore.fetchCategories();
});

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing",
    items: "25+",
    badge: "New Collection",
    image: "https://builder.bootstrapmade.com/static/img/product/product-m-8.webp",
  },
  {
    id: 2,
    name: "Fashion",
    description: "Sed do eiusmod tempor incididunt ut labore",
    items: "40+",
    badge: "50% Off",
    image: "https://builder.bootstrapmade.com/static/img/product/product-f-15.webp",
  },
  {
    id: 3,
    name: "Sports",
    description: "Duis aute irure dolor in reprehenderit voluptate",
    items: "30+",
    badge: "Trending",
    image: "https://builder.bootstrapmade.com/static/img/product/product-m-12.webp",
  },
  {
    id: 4,
    name: "Books",
    description: "Excepteur sint occaecat cupidatat non proident",
    items: "15+",
    badge: "Limited",
    image: "https://builder.bootstrapmade.com/static/img/product/product-f-12.webp",
  },
];
</script>

<template>
  <section class="flex flex-col max-w-7xl mx-auto gap-8 py-16 px-4">

      <h1 class="text-3xl font-medium">Category </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Category Card -->
       
      <!-- categoriesStore.categoires -->
      <div
        v-for="category in categories"
        :key="category.id"
        class="relative overflow-hidden rounded-2xl cursor-pointer group shadow-lg "
      >
        <!-- Background Image -->
        <img
          :src="category.image"
          :alt="category.name"
          class="w-full h-64 object-cover transition-transform duration-500 shadow-2xl group-hover:scale-110"
        />
        
        <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40"></div>
        <!-- Text Content -->
        <div
          class="absolute bottom-8 left-4 text-white  transition-opacity duration-500"
        >
          <h3 class="text-lg font-bold">{{ category.name }}</h3>
          <p class="text-sm">{{ category.description }}</p>
          <span class="text-xs mt-1 inline-block">{{ category.items }} Items</span>
        </div>

        <!-- Hover Icon -->
        <div
          class="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        > 
          <i class="bi bi-arrow-right-circle"></i>
        </div>
      </div>

    </div>
  </section>
</template>

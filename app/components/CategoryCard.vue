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
  <section class="relative py-20 bg-gradient-to-b from-white to-stone-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Shop by
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">
            Category
          </span>
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our carefully curated collections designed for every style and occasion
        </p>
      </div>

      <!-- Category Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(category, index) in categories"
          :key="category.id"
          class="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-slide-up-blur"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Background Image with Overlay -->
          <div class="relative h-80 overflow-hidden">
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            <!-- Category Badge -->
            <div class="absolute top-4 left-4">
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                :class="category.badge === 'New Collection' ? 'bg-accent-600/90 text-white' : category.badge === '50% Off' ? 'bg-green-600/90 text-white' : 'bg-stone-800/90 text-white'"
              >
                {{ category.badge }}
              </span>
            </div>

            <!-- Hover Action Button -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button class="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                Shop Now
              </button>
            </div>
          </div>

          <!-- Category Content -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-1">{{ category.name }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ category.description }}</p>
              </div>
              <div class="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center group-hover:bg-accent-200 transition-colors duration-300">
                <svg class="w-5 h-5 text-accent-600 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-accent-600">{{ category.items }} Items</span>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span class="text-sm text-gray-600">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Categories Button -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/categories"
          class="inline-flex items-center px-8 py-4 border-2 border-accent-600 text-accent-600 font-semibold rounded-xl hover:bg-accent-600 hover:text-white transform hover:scale-105 transition-all duration-300"
        >
          View All Categories
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

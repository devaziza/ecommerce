<script setup lang="ts">
import { useFavoriteStore } from "~/stores/useFavorites";
import { useCartStore } from "~/stores/useCart";
import ProductsCard from "~/components/ProductsCard.vue";
import { onMounted, ref } from "vue";
import type { Product } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();
const isLoading = ref(true);

// Yurakchani tekshirish (har doim true, chunki favorites sahifasida faqat sevimlilar bor)
const isFavorite = (productId: number) => {
  return favoriteStore.favorites.some((f) => f.id === productId);
};

// Yurakchani toggle qilish
async function favoriteHandler(productId: number) {
  if (isFavorite(productId)) {
    await favoriteStore.removeFavorite(productId);
  } else {
    await favoriteStore.addFavorite(productId);
  }
  await favoriteStore.fetchFavorites();
}

async function addCartHandler(product: Product) {
  await cartStore.addToCart(product);
}

onMounted(async () => {
  try {
    await favoriteStore.fetchFavorites();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-white">
    <!-- Favorites Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
              <span class="text-red-500">❤️</span>
              My Favorites
            </h1>
            <p class="text-gray-600">
              {{ favoriteStore.favorites.length }} {{ favoriteStore.favorites.length === 1 ? 'item' : 'items' }} saved
            </p>
          </div>
          <NuxtLink
            to="/shop"
            class="flex items-center space-x-2 text-accent-600 hover:text-accent-700 font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Browse Products</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Favorites Content -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
              <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Loading your favorites...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="favoriteStore.favorites.length === 0" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Start adding products to your favorites to keep track of items you love!
          </p>
          <div class="space-x-4">
            <NuxtLink
              to="/shop"
              class="inline-flex items-center px-8 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
            >
              Start Shopping
            </NuxtLink>
            <NuxtLink
              to="/categories"
              class="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Browse Categories
            </NuxtLink>
          </div>
        </div>

        <!-- Favorites Grid -->
        <div v-else>
          <!-- Action Bar -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-gray-600">
                You have <span class="font-semibold text-gray-900">{{ favoriteStore.favorites.length }}</span> saved items
              </p>
              <div class="flex items-center space-x-4">
                <button class="text-accent-600 hover:text-accent-700 font-medium text-sm">
                  Add All to Cart
                </button>
                <button class="text-red-600 hover:text-red-700 font-medium text-sm">
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductsCard
              v-for="(product, index) in favoriteStore.favorites"
              :key="product.id"
              :product="product"
              :is-favorite="true"
              @toggle-favorite="favoriteHandler(product.id)"
              @add-to-cart="addCartHandler(product)"
              class="animate-fade-in-up"
              :style="{ animationDelay: `${index * 50}ms` }"
            />
          </div>

          <!-- Recommendations Section -->
          <section v-if="favoriteStore.favorites.length > 0" class="mt-16">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">You Might Also Like</h2>
              <p class="text-gray-600">Based on your favorites</p>
            </div>
            
            <!-- Placeholder for recommendations -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div
                v-for="i in 4"
                :key="i"
                class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center"
              >
                <div class="w-full h-48 bg-gray-100 rounded-lg mb-4 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

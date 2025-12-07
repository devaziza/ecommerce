<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from 'vue-router';
import type { Product } from "~/types/models";
import ProductsCard from "~/components/ProductsCard.vue";
import { useFavoriteStore } from "~/stores/useFavorites";
import { useProductStore } from "~/stores/useProducts";
import { useCartStore } from "~/stores/useCart";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const favoriteStore = useFavoriteStore();
const productStore = useProductStore();
const cartStore = useCartStore();

const route = useRoute();
const searchTerm = computed(() => (route.query.q as string) || '');
const sortBy = ref("relevance");
const isLoading = ref(false);

const sortOptions = [
  { id: "relevance", name: "Most Relevant" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "newest", name: "Newest First" },
  { id: "rating", name: "Highest Rated" },
];

const searchResults = computed(() => {
  let products = [...productStore.products];
  
  // Sort products
  switch (sortBy.value) {
    case "price-low":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      break;
    case "rating":
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }
  
  return products;
});

watch(searchTerm, (newValue) => {
  if (newValue) {
    performSearch(newValue);
  } else {
    productStore.products = [];
  }
}, { immediate: true });

watch(sortBy, () => {
  if (searchTerm.value) {
    performSearch(searchTerm.value);
  }
});

async function performSearch(query: string) {
  isLoading.value = true;
  try {
    await productStore.searchProducts(query);
  } catch (error) {
    console.error('Search failed:', error);
  } finally {
    isLoading.value = false;
  }
}

const isFavorite = (productId: number) => {
  return favoriteStore.favorites.some((f) => f.id === productId);
};

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
  await favoriteStore.fetchFavorites();
});
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-white">
    <!-- Search Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p class="text-lg text-gray-600">
            <span class="font-medium">"{{ searchTerm }}"</span>
            <span v-if="searchResults.length > 0" class="text-accent-600">
              ({{ searchResults.length }} products found)
            </span>
          </p>
        </div>
      </div>
    </section>

    <!-- Search Content -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search Controls -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">Sort by:</span>
              <select
                v-model="sortBy"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
              >
                <option v-for="option in sortOptions" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>
            
            <div class="flex items-center space-x-4">
              <NuxtLink
                to="/shop"
                class="text-accent-600 hover:text-accent-700 font-medium flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Back to Shop</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-16">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
              <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Searching for products...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="productStore.error" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Search Error</h3>
          <p class="text-gray-600 mb-6">{{ productStore.error }}</p>
          <button
            @click="performSearch(searchTerm)"
            class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>

        <!-- No Results -->
        <div v-else-if="searchResults.length === 0 && searchTerm" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any products matching "<span class="font-medium">{{ searchTerm }}</span>"
          </p>
          <div class="space-y-4">
            <p class="text-sm text-gray-500">Try:</p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>• Checking your spelling</li>
              <li>• Using more general terms</li>
              <li>• Trying different keywords</li>
            </ul>
          </div>
          <div class="mt-8 space-x-4">
            <NuxtLink
              to="/shop"
              class="inline-flex items-center px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
            >
              Browse All Products
            </NuxtLink>
            <button
              @click="searchTerm = ''"
              class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div v-else>
          <!-- Results Count -->
          <div class="mb-6">
            <p class="text-gray-600">
              Found <span class="font-semibold text-gray-900">{{ searchResults.length }}</span> products for 
              "<span class="font-medium">{{ searchTerm }}</span>"
            </p>
          </div>

          <!-- Products Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductsCard
              v-for="(product, index) in searchResults"
              :key="product.id"
              :product="product"
              @toggle-favorite="favoriteHandler"
              @add-to-cart="addCartHandler"
              :is-favorite="isFavorite(product.id)"
              class="animate-fade-in-up"
              :style="{ animationDelay: `${index * 50}ms` }"
            />
          </div>

          <!-- Load More (if needed) -->
          <div v-if="searchResults.length >= 12" class="text-center mt-12">
            <button class="inline-flex items-center px-8 py-3 border border-accent-600 text-accent-600 rounded-lg hover:bg-accent-50 transition-colors duration-200">
              Load More Products
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Suggestions -->
    <section v-if="searchResults.length > 0" class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Related Searches</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="suggestion in ['summer collection', 'premium fashion', 'accessories', 'new arrivals']"
            :key="suggestion"
            @click="navigateTo(`/search?q=${encodeURIComponent(suggestion)}`)"
            class="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-accent-50 hover:border-accent-300 hover:text-accent-700 transition-all duration-200"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ProductsCard from "~/components/ProductsCard.vue";
import ErrorMessage from "~/components/ErrorMessage.vue";
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "~/stores/useProducts";
import { useFavoriteStore } from "~/stores/useFavorites";
import { useCartStore } from "~/stores/useCart";
import type { Product } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const productsStore = useProductStore();
const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();

const searchQuery = ref("");
const selectedCategory = ref("all");
const sortBy = ref("featured");
const priceRange = ref([0, 1000]);
const isFilterOpen = ref(false);
const viewMode = ref("grid"); // grid or list

const hasError = ref(false);
const errorMessage = ref("Unable to load shop data.");

const categories = [
  { id: "all", name: "All Products", icon: "🛍️" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "fashion", name: "Fashion", icon: "👔" },
  { id: "home", name: "Home & Living", icon: "🏠" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "books", name: "Books", icon: "📚" },
];

const sortOptions = [
  { id: "featured", name: "Featured" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "newest", name: "Newest First" },
  { id: "rating", name: "Highest Rated" },
];

const filteredProducts = computed(() => {
  let products = [...productsStore.latestProducts];
  
  // Filter by category
  if (selectedCategory.value !== "all") {
    products = products.filter(p => p.category_id.toString() === selectedCategory.value);
  }
  
  // Filter by search
  if (searchQuery.value) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Filter by price
  products = products.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);
  
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

function clearFilters() {
  selectedCategory.value = "all";
  searchQuery.value = "";
  priceRange.value = [0, 1000];
  sortBy.value = "featured";
}

onMounted(async () => {
  try {
    await productsStore.fetchProducts();
    await favoriteStore.fetchFavorites();
  } catch (error) {
    hasError.value = true;
    errorMessage.value = "Failed to load products. Please try again.";
  }
});
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-accent-600 to-accent-700 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Shop Collection</h1>
          <p class="text-xl text-accent-100 max-w-2xl mx-auto">
            Discover our curated selection of premium products designed for the modern lifestyle
          </p>
        </div>
      </div>
    </section>

    <!-- Shop Content -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search and Filters Bar -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search Bar -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search products..."
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <!-- Sort Dropdown -->
            <div class="lg:w-48">
              <select
                v-model="sortBy"
                class="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
              >
                <option v-for="option in sortOptions" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>

            <!-- View Mode Toggle -->
            <div class="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              <button
                @click="viewMode = 'grid'"
                :class="viewMode === 'grid' ? 'bg-white shadow-sm' : ''"
                class="p-2 rounded-lg transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-white shadow-sm' : ''"
                class="p-2 rounded-lg transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>

            <!-- Filter Toggle (Mobile) -->
            <button
              @click="isFilterOpen = !isFilterOpen"
              class="lg:hidden flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <aside :class="[
            'lg:w-64 flex-shrink-0',
            isFilterOpen ? 'block' : 'hidden lg:block'
          ]">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  @click="clearFilters"
                  class="text-sm text-accent-600 hover:text-accent-700 font-medium"
                >
                  Clear all
                </button>
              </div>

              <!-- Categories -->
              <div class="mb-8">
                <h4 class="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
                <div class="space-y-2">
                  <label
                    v-for="category in categories"
                    :key="category.id"
                    class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <input
                      v-model="selectedCategory"
                      :value="category.id"
                      type="radio"
                      class="w-4 h-4 text-accent-600 focus:ring-accent-500 border-gray-300"
                    />
                    <span class="text-2xl">{{ category.icon }}</span>
                    <span class="text-gray-700">{{ category.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-8">
                <h4 class="text-sm font-semibold text-gray-900 mb-4">Price Range</h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">${{ priceRange[0] }}</span>
                    <span class="text-sm text-gray-600">${{ priceRange[1] }}</span>
                  </div>
                  <input
                    v-model="priceRange"
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-600"
                  />
                </div>
              </div>
            </div>
          </aside>

          <!-- Products Grid/List -->
          <main class="flex-1">
            <!-- Results Header -->
            <div class="flex items-center justify-between mb-6">
              <p class="text-gray-600">
                Showing <span class="font-semibold text-gray-900">{{ filteredProducts.length }}</span> products
              </p>
            </div>

            <!-- Error State -->
            <ErrorMessage v-if="hasError" :message="errorMessage" />

            <!-- Products Grid -->
            <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProductsCard
                v-for="(product, index) in filteredProducts"
                :key="product.id"
                :product="product"
                @toggle-favorite="favoriteHandler"
                @add-to-cart="addCartHandler"
                :is-favorite="isFavorite(product.id)"
                class="animate-fade-in-up"
                :style="{ animationDelay: `${index * 50}ms` }"
              />
            </div>

            <!-- Products List -->
            <div v-else class="space-y-4">
              <div
                v-for="(product, index) in filteredProducts"
                :key="product.id"
                class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 animate-fade-in-up"
                :style="{ animationDelay: `${index * 50}ms` }"
              >
                <div class="flex flex-col sm:flex-row gap-6">
                  <div class="sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
                      <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <span class="text-2xl font-bold text-gray-900">${{ product.price }}</span>
                        <div class="flex items-center space-x-1">
                          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span class="text-sm text-gray-600">4.5</span>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          @click="favoriteHandler(product.id)"
                          class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <svg
                            class="w-5 h-5"
                            :class="isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                        </button>
                        <button
                          @click="addCartHandler(product)"
                          class="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="!hasError && filteredProducts.length === 0" class="text-center py-16">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p class="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                @click="clearFilters"
                class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCategoryStore } from "~/stores/useCategory";
import { useProductStore } from "~/stores/useProducts";
import { useFavoriteStore } from "~/stores/useFavorites";
import { useCartStore } from "~/stores/useCart";
import type { Category, Product } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();

const categoryId = computed(() => parseInt(route.params.id as string));
const searchQuery = ref("");
const sortBy = ref("name");
const isLoading = ref(false);
const error = ref<string | null>(null);

// Computed properties
const category = computed(() => 
  categoryStore.categories.find(c => c.id === categoryId.value)
);

const products = computed(() => productStore.products);

const filteredProducts = computed(() => {
  let filtered = products.value;
  
  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Sort products
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      default:
        return 0;
    }
  });
});

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "newest", label: "Newest First" },
];

// Utility functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isFavorite = (productId: number) => {
  return favoriteStore.favorites.some(f => f.id === productId);
};

const isNewProduct = (created_at?: string | null) => {
  if (!created_at) return false;
  const days = 7;
  const diff = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24);
  return diff <= days;
};

// Event handlers
const handleFavorite = async (productId: number) => {
  try {
    if (isFavorite(productId)) {
      await favoriteStore.removeFavorite(productId);
    } else {
      await favoriteStore.addFavorite(productId);
    }
    await favoriteStore.fetchFavorites();
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

const addToCart = async (product: Product) => {
  try {
    await cartStore.addToCart(product);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

const viewProduct = (productId: number) => {
  router.push(`/products/${productId}`);
};

const loadCategoryProducts = async () => {
  if (!categoryId.value) return;
  
  try {
    isLoading.value = true;
    error.value = null;
    await productStore.ProductsByCategory(categoryId.value);
  } catch (err: any) {
    error.value = err.message || "Failed to load category products";
  } finally {
    isLoading.value = false;
  }
};

// Watch for category changes
watch(categoryId, (newId) => {
  if (newId) {
    loadCategoryProducts();
  }
}, { immediate: true });

// Load data
onMounted(async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
});
</script>

<template>
  <div class="bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading || productStore.loading" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600">Loading category products...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || productStore.error" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
        <p class="text-gray-600 mb-6">{{ error || productStore.error }}</p>
        <button
          @click="loadCategoryProducts"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Category Not Found -->
    <div v-else-if="!category" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">Category Not Found</h3>
        <p class="text-gray-600 mb-8">The category you're looking for doesn't exist or has been removed.</p>
        <NuxtLink
          to="/categories"
          class="inline-flex items-center px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Browse All Categories
        </NuxtLink>
      </div>
    </div>

    <!-- Category Content -->
    <div v-else>
      <!-- Category Header -->
      <section class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="flex-1">
              <!-- Breadcrumb -->
              <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <NuxtLink to="/" class="hover:text-accent-600 transition-colors">Home</NuxtLink>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <NuxtLink to="/categories" class="hover:text-accent-600 transition-colors">Categories</NuxtLink>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span class="text-gray-900 font-medium">{{ category.name }}</span>
              </nav>
              
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ category.name }}</h1>
              <p class="text-gray-600 text-lg">{{ category.description }}</p>
            </div>
            
            <!-- Category Image -->
            <div class="lg:w-64 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                v-if="category.image_url"
                :src="category.image_url"
                :alt="category.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                <span class="text-white text-3xl font-bold">{{ category.name.charAt(0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters and Controls -->
      <section class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Search -->
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
                  placeholder="Search products in this category..."
                  class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
                />
              </div>
            </div>

            <!-- Sort -->
            <div class="sm:w-48">
              <select
                v-model="sortBy"
                class="block w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Empty State -->
          <div v-if="filteredProducts.length === 0" class="text-center py-16">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-600 mb-8">
              {{ searchQuery ? 'Try adjusting your search terms' : 'No products available in this category' }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Search
              </button>
              <NuxtLink
                to="/categories"
                class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
              >
                Browse Other Categories
              </NuxtLink>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-else>
            <div class="flex items-center justify-between mb-6">
              <p class="text-gray-600">
                Showing {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }}
                {{ searchQuery ? `matching "${searchQuery}"` : '' }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <!-- Product Image -->
                <div class="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" @click="viewProduct(product.id)">
                  <img
                    v-if="product.image_url"
                    :src="product.image_url"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M9 16h.01M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                  
                  <!-- New Badge -->
                  <div
                    v-if="isNewProduct(product.created_at)"
                    class="absolute top-3 left-3 bg-accent-600 text-white px-2 py-1 rounded-full text-xs font-bold"
                  >
                    NEW
                  </div>
                  
                  <!-- Favorite Button -->
                  <button
                    @click.stop="handleFavorite(product.id)"
                    :disabled="favoriteStore.loading"
                    class="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-50"
                  >
                    <svg
                      v-if="!favoriteStore.loading"
                      class="w-5 h-5 transition-all duration-300"
                      :class="isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                </div>

                <!-- Product Info -->
                <div class="p-4">
                  <div class="mb-3">
                    <h3 
                      class="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-accent-600 transition-colors"
                      @click="viewProduct(product.id)"
                    >
                      {{ product.name }}
                    </h3>
                    <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ product.description }}</p>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-xl font-bold text-gray-900">{{ formatPrice(product.price) }}</p>
                      <p class="text-xs text-gray-500">In Stock</p>
                    </div>
                    
                    <button
                      @click.stop="addToCart(product)"
                      :disabled="cartStore.loading"
                      class="w-10 h-10 bg-accent-600 text-white rounded-lg flex items-center justify-center hover:bg-accent-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <svg
                        v-if="!cartStore.loading"
                        class="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
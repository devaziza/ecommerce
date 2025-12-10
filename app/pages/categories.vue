<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "~/stores/useCategory";
import { useProductStore } from "~/stores/useProducts";
import { useFavoriteStore } from "~/stores/useFavorites";
import { useCartStore } from "~/stores/useCart";
import type { Category, Product } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const categoryStore = useCategoryStore();
const productStore = useProductStore();
const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();

const searchQuery = ref("");
const selectedCategory = ref<number | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Computed properties
const categories = computed(() => categoryStore.categories);
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const featuredCategories = computed(() => 
  filteredCategories.value.slice(0, 6)
);

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

// Category interaction handlers
const selectCategory = async (categoryId: number) => {
  try {
    isLoading.value = true;
    error.value = null;
    selectedCategory.value = categoryId;
    
    // Fetch products for this category
    await productStore.ProductsByCategory(categoryId);
    
    // Navigate to category detail page
    await navigateTo(`/category/${categoryId}`);
  } catch (err: any) {
    error.value = err.message || "Failed to load category products";
  } finally {
    isLoading.value = false;
  }
};

const isFavorite = (productId: number) => {
  return favoriteStore.favorites.some(f => f.id === productId);
};

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

const getCategoryProductCount = (categoryId: number) => {
  // This would ideally come from the API
  return Math.floor(Math.random() * 20) + 5; // Mock count for demo
};

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
    <!-- Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Shop by
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Category
            </span>
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products organized by categories
          </p>
        </div>
      </div>
    </section>

    <!-- Search Bar -->
    <section class="py-8 bg-white border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg transition-all duration-300"
          />
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="categoryStore.loading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <svg class="animate-spin h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600">Loading categories...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="categoryStore.error" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Categories</h3>
        <p class="text-gray-600 mb-6">{{ categoryStore.error }}</p>
        <button
          @click="categoryStore.fetchCategories()"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Categories Grid -->
    <section v-else class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Featured Categories -->
        <div v-if="!searchQuery && featuredCategories.length > 0" class="mb-16">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Categories</h2>
            <p class="text-gray-600">Explore our most popular product categories</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="category in featuredCategories"
              :key="category.id"
              @click="selectCategory(category.id)"
              class="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <!-- Category Image -->
              <div class="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  v-if="category.image_url"
                  :src="category.image_url"
                  :alt="category.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <span class="text-white text-4xl font-bold">{{ category.name.charAt(0) }}</span>
                </div>
                
                <!-- Overlay with category name -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div class="text-white">
                    <h3 class="text-xl font-bold mb-1">{{ category.name }}</h3>
                    <p class="text-sm opacity-90">{{ getCategoryProductCount(category.id) }} products</p>
                  </div>
                </div>
              </div>
              
              <!-- Category Info -->
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
                <p class="text-gray-600 line-clamp-2">{{ category.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- All Categories -->
        <div>
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              {{ searchQuery ? 'Search Results' : 'All Categories' }}
            </h2>
            <p class="text-gray-600">
              {{ searchQuery ? `Found ${filteredCategories.length} categories` : `Browse all ${categories.length} categories` }}
            </p>
          </div>

          <!-- Empty State -->
          <div v-if="filteredCategories.length === 0" class="text-center py-16">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p class="text-gray-600 mb-8">
              {{ searchQuery ? 'Try adjusting your search terms' : 'No categories available at the moment' }}
            </p>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>

          <!-- Categories Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              @click="selectCategory(category.id)"
              class="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-accent-200 transition-all duration-300"
            >
              <div class="flex items-center space-x-4">
                <!-- Category Icon/Image -->
                <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    v-if="category.image_url"
                    :src="category.image_url"
                    :alt="category.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                    <span class="text-white text-xl font-bold">{{ category.name.charAt(0) }}</span>
                  </div>
                </div>
                
                <!-- Category Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">{{ category.name }}</h3>
                  <p class="text-sm text-gray-600 truncate">{{ category.description }}</p>
                  <p class="text-xs text-accent-600 mt-1">{{ getCategoryProductCount(category.id) }} products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <svg class="animate-spin h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-700">Loading category...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
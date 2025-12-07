<script setup lang="ts">
import { useCategoryStore } from "~/stores/useCategory";
import ProductsCard from "@/components/ProductsCard.vue"
import CategoryCard from "~/components/CategoryCard.vue";
import { ref } from "vue";
import type { Product } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const store = useAuthStore();
const categoriesStore = useCategoryStore();
const productsStore = useProductStore();
const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();
const hasError = ref(false);
const errorMessage = ref("Something went wrong");

// Logout
async function handleLogout() {
  await store.logout();
  navigateTo("/login");
}

const isFavorite = (productId: number) => {
  return favoriteStore.favorites.some((f) => f.id === productId);
};

async function favoriteHandler(productId: number) {
  if (isFavorite(productId)) {
    await favoriteStore.removeFavorite(productId); // waits for delete
  } else {
    await favoriteStore.addFavorite(productId); // waits for insert
  }
  await favoriteStore.fetchFavorites();
}

async function addCartHandler(product: Product) {
  await cartStore.addToCart(product);
}

onMounted(async () => {
  await categoriesStore.fetchCategories();
  await productsStore.fetchProducts();
  await favoriteStore.fetchFavorites();
});
</script>

<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <ProductShowcase />
    
    <!-- Categories Section -->
    <CategoryCard />

    <!-- Featured Products Section -->
    <section class="py-20 bg-gradient-to-b from-stone-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
            <span class="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></span>
            Featured Products
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700">
              Collection
            </span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products designed for the modern lifestyle
          </p>
        </div>

        <!-- Error State -->
        <ErrorMessage v-if="hasError" :message="errorMessage" />

        <!-- Products Grid -->
        <div v-if="!hasError" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          <ProductsCard
            v-for="(product, index) in productsStore.latestProducts"
            :key="product.id"
            :product="product"
            @toggle-favorite="favoriteHandler"
            @add-to-cart="addCartHandler"
            :is-favorite="isFavorite(product.id)"
            class="animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          />
        </div>

        <!-- View All Products Button -->
        <div class="text-center mt-12">
          <NuxtLink
            to="/shop"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white font-semibold rounded-xl hover:from-accent-700 hover:to-accent-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Products
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Promotional Banner -->
    <section class="py-16 bg-gradient-to-r from-accent-600 to-accent-700 relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Limited Time Offer
          </h2>
          <p class="text-xl text-accent-100 mb-8">
            Get 20% off on your first order. Use code: <span class="font-mono bg-white/20 px-2 py-1 rounded">LUXE20</span>
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/shop"
              class="inline-flex items-center justify-center px-8 py-4 bg-white text-accent-700 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Shop Now
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </NuxtLink>
            <button class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-accent-700 transform hover:scale-105 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Indicators -->
    <section class="py-16 bg-white border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center group">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors duration-300">
              <svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">Quality Guarantee</h3>
            <p class="text-sm text-gray-600">Premium materials only</p>
          </div>
          <div class="text-center group">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors duration-300">
              <svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
            <p class="text-sm text-gray-600">2-3 business days</p>
          </div>
          <div class="text-center group">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors duration-300">
              <svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">Secure Payment</h3>
            <p class="text-sm text-gray-600">100% protected</p>
          </div>
          <div class="text-center group">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors duration-300">
              <svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">24/7 Support</h3>
            <p class="text-sm text-gray-600">Always here to help</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

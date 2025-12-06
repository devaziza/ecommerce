<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from 'vue-router'; // URL parametrlarini olish uchun
import type { Product } from "~/types/models";
import ProductCard from "~/components/ProductsCard.vue";
import { useFavoriteStore } from "~/stores/useFavorites";
import { useProductStore } from "~/stores/useProducts";
import { useCartStore } from "~/stores/useCart";

definePageMeta({
  middleware: ["auth-role"],
  layout: "user",
});

const favoriteStore = useFavoriteStore();
const productStore = useProductStore();
const cartStore = useCartStore();

// URL'dan qidiruv so'zini olish
const route = useRoute();
const searchTerm = computed(() => (route.query.q as string) || '');

watch(searchTerm, (newValue) => {
  if (newValue) {
    productStore.searchProducts(newValue);
  } else {
    productStore.products = [];
  }
}, { immediate: true }); 

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
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center">
      "{{ searchTerm }}" bo'yicha qidiruv natijalari
    </h1>

    <!-- Mahsulotlar ro'yxati -->
    <div
      v-if="!productStore.loading && !productStore.error"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <!-- Agar mahsulotlar topilmasa -->
      <div
        v-if="productStore.products.length === 0 && searchTerm"
        class="col-span-full text-center py-12 text-gray-500"
      >
        <p class="text-xl">Uzr, "{{ searchTerm }}" bo'yicha hech qanday mahsulot topilmadi.</p>
        <p class="text-md mt-2">Iltimos, boshqa so'zlar bilan urinib ko'ring.</p>
      </div>

      <!-- Mahsulot kartalari -->
      <ProductCard
        v-for="p in productStore.products"
        :key="p.id"
        :product="p"
        :is-favorite="isFavorite(p.id)"
        @toggle-favorite="favoriteHandler"
        @add-to-cart="addCartHandler"
      />
    </div>

    <!-- Yuklanayotganda ko'rsatiladigan animatsiya -->
    <div
      v-if="productStore.loading"
      class="flex justify-center items-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Xatolik bo'lganda xabar -->
    <div
      v-if="productStore.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-2xl text-center"
    >
      {{ productStore.error }}
    </div>
  </div>
</template>

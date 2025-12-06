<script setup lang="ts">
import { useCategoryStore } from "~/stores/useCategory";
import ProductsCard from "@/components/ProductsCard.vue"
import CategoryCard from "~/components/CategoryCard.vue";
import { ref } from "vue";
import type { Product } from "~/types/models";

definePageMeta({
  middleware: ["auth-role"],
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
  <div class="relative min-w-screen bg-[#F5F5F4]">
    <!-- <Navbar />
    <Sidebar /> -->
    <ProductShowcase />
    <CategoryCard />

    <main class="px-4 md:px-10 py-8">
      <!-- ✅ Error holati -->
      <ErrorMessage v-if="hasError" :message="errorMessage" />

<div class="max-w-7xl mx-auto p-6">
        <h1 class="text-4xl md:text-5xl font-light tracking-wide mb-8 text-[#111827]">Premium Products</h1>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <ProductsCard
            v-for="p in productsStore.latestProducts"
            :key="p.id"
            :product="p"
            @toggle-favorite="favoriteHandler"
            @add-to-cart="addCartHandler"
            :is-favorite="isFavorite(p.id)"
          />
        </div>
      </div>
    </main>
  </div>
</template>

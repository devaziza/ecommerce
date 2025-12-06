<script setup lang="ts">
import { useFavoriteStore } from "~/stores/useFavorites";
import ProductsCard from "~/components/ProductsCard.vue";
import { onMounted } from "vue";
import type { Product } from "~/types/models";

definePageMeta({
  middleware: ["auth-role"],
  layout: "user",
});

const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();

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

function addCartHandler(product: Product) {
  cartStore.addToCart(product);
}

onMounted(async () => {
  await favoriteStore.fetchFavorites();
});
</script>

<template>
  <div class="bg-gradient-to-br from-pink-100 via-indigo-100 to-blue-100">
    <div class="max-w-7xl px-4 mx-auto py-4 p-8">
      <!-- TITLE -->
      <div
        class="text-4xl font-extrabold mb-6 flex items-center gap-3 text-indigo-700 drop-shadow"
      >
        ❤️
        <h1
          class="text-4xl font-bold bg-gradient-to-r p-2 from-purple-900 to-pink-700 bg-clip-text text-transparent"
        >
          My Favorites
        </h1>
        <span class="text-4xl text-gray-500">{{
          favoriteStore.favorites.length
        }}</span>
      </div>

      <div
        v-if="!favoriteStore.favorites.length"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
      >
        <div
          class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.1959 6.98709C17.5699 4.89134 14.3061 5.24282 13.1635 7.63669C12.6965 8.61527 11.3035 8.61527 10.8365 7.63669C9.69394 5.24282 6.43011 4.89135 4.8041 6.98709L4.49475 7.38581C3.08665 9.2007 3.28996 11.7888 4.96418 13.3616L11.9168 19.8928C11.9479 19.922 11.9753 19.9477 12 19.9708C12.0247 19.9477 12.0521 19.922 12.0832 19.8928L19.0358 13.3616C20.71 11.7888 20.9133 9.2007 19.5052 7.38581L19.1959 6.98709ZM12 6.62866C13.7697 3.5573 18.1553 3.19885 20.381 6.06759L20.6904 6.46631C22.5728 8.89249 22.301 12.3524 20.0628 14.4548L13.0927 21.0026C12.9885 21.1005 12.8747 21.2075 12.7673 21.2902C12.6438 21.3853 12.4712 21.4954 12.2407 21.5406C12.0818 21.5718 11.9182 21.5718 11.7593 21.5406C11.5288 21.4954 11.3562 21.3853 11.2327 21.2902C11.1253 21.2075 11.0115 21.1005 10.9073 21.0026L3.93717 14.4548C1.69903 12.3524 1.42724 8.8925 3.30962 6.46632L3.61898 6.06759C5.84473 3.19885 10.2303 3.55729 12 6.62866Z"
                fill="#9CA3AF"
              ></path>
            </g>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">No favorites yet</h2>
        <p class="text-gray-600">Start adding products to your favorites</p>
      </div>

      <!-- FAVORITES GRID -->
      <div v-else class="max-w-7xl mx-auto p-6">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <ProductsCard
            v-for="fav in favoriteStore.favorites"
            :key="fav.id"
            :product="fav"
            :is-favorite="true"
            @toggle-favorite="favoriteHandler(fav.id)"
            @add-to-cart="addCartHandler(fav)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

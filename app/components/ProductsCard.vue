<script setup lang="ts">
import type { Product } from "~/types/models";
import { useFavoriteStore } from "~/stores/useFavorites";

const props = defineProps<{ product: Product; isFavorite: boolean }>();
const emit = defineEmits(["add-to-cart", "toggle-favorite"]);

function toggleFavorite() {
  emit("toggle-favorite", props.product.id);
}
function addCart() {
  emit("add-to-cart", props.product);
}
</script>

<template>
  <div
    class="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
  >
    <!-- Image Container -->
    <div class="relative">
      <div class="aspect-square overflow-hidden bg-gray-50">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <!-- Floating Favorite Button -->
      <button
        @click.stop="toggleFavorite"
        class="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90"
      >
        <span class="text-2xl leading-none">
          {{ props.isFavorite ? "❤️" : "🤍" }}
        </span>
      </button>
    </div>

    <!-- Info Section -->
    <div class="p-5 space-y-3">
      <h3
        class="text-lg font-semibold text-gray-800 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
      >
        {{ product.name }}
      </h3>

      <p class="text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Price + Add to Cart -->
      <div class="flex items-center justify-between pt-1">
        <!-- Price -->
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-blue-600 tracking-tight">
            ${{ product.price }}
          </span>
        </div>

        <!-- Add To Cart -->
        <button
          @click="addCart"
          class="bg-blue-600 text-white px-5 py-2 rounded-2xl font-medium shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Add
        </button>
      </div>
    </div>

    <!-- Soft Hover Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    ></div>
  </div>
</template>

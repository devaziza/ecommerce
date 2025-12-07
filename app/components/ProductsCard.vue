<script setup lang="ts">
import type { Product } from "~/types/models";
import { useFavoriteStore } from "~/stores/useFavorites";

const props = defineProps<{
  product: Product;
  isFavorite: boolean;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  inStock?: boolean;
}>();

const emit = defineEmits(["add-to-cart", "toggle-favorite", "quick-view"]);

const isHovered = ref(false);
const isAddingToCart = ref(false);

const discountPercentage = computed(() => {
  if (!props.originalPrice || props.originalPrice <= props.product.price)
    return 0;
  return Math.round(
    ((props.originalPrice - props.product.price) / props.originalPrice) * 100
  );
});

const displayRating = computed(() => props.rating || Math.random() * 2 + 3); // Random 3-5 if not provided
const displayReviews = computed(
  () => props.reviews || Math.floor(Math.random() * 100) + 10
);

function toggleFavorite() {
  emit("toggle-favorite", props.product.id);
}

async function addCart() {
  isAddingToCart.value = true;
  emit("add-to-cart", props.product);
  setTimeout(() => {
    isAddingToCart.value = false;
  }, 1000);
}

function quickView() {
  emit("quick-view", props.product);
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 block cursor-pointer"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Image Container -->
    <div
      class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <!-- Product Image -->
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
      />

      <!-- Overlay Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-2">
        <!-- Discount Badge -->
        <div
          v-if="discountPercentage > 0"
          class="bg-accent-600 text-white px-2 py-1 rounded-lg text-xs font-bold animate-scale-in-bounce"
        >
          -{{ discountPercentage }}%
        </div>
        <!-- New Badge -->
        <div
          v-if="
            product.created_at &&
            new Date(product.created_at) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          "
          class="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold"
        >
          NEW
        </div>
        <!-- Out of Stock Badge -->
        <!-- <div
          v-if="props.inStock === false"
          class="bg-gray-800 text-white px-2 py-1 rounded-lg text-xs font-bold"
        >
          OUT OF STOCK
        </div> -->
      </div>

      <!-- Action Buttons (shown on hover) -->
      <div
        class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
      >
        <!-- Favorite Button -->
        <button
          @click.stop="toggleFavorite"
          class="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 hover:text-accent-600 active:scale-90"
          :class="{ 'text-accent-600': props.isFavorite }"
        >
          <svg
            class="w-5 h-5 transition-all duration-300"
            :class="{ 'fill-current': props.isFavorite }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>

        <!-- Quick View Button -->
        <button
          @click.stop="quickView"
          class="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 hover:text-accent-600 active:scale-90"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Quick Add to Cart (shown on hover) -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="isHovered && props.inStock !== false"
          class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <button
            @click.stop="addCart"
            :disabled="isAddingToCart"
            class="w-full bg-accent-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-accent-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg
              v-if="!isAddingToCart"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span v-if="!isAddingToCart">Add to Cart</span>
            <svg
              v-else
              class="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>
        </div>
      </Transition>
    </div>

    <!-- Product Info -->
    <div class="p-4 space-y-3">
      <!-- Product Name -->
      <h3
        class="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-accent-700 transition-colors duration-300"
      >
        {{ product.name }}
      </h3>

      <!-- Rating and Reviews -->
      <div class="flex items-center space-x-2">
        <div class="flex items-center">
          <div class="flex space-x-0.5">
            <svg
              v-for="i in 5"
              :key="i"
              class="w-4 h-4"
              :class="
                i <= Math.floor(displayRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              "
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
          </div>
          <span class="text-sm text-gray-600">{{
            displayRating.toFixed(1)
          }}</span>
        </div>
        <span class="text-sm text-gray-400">({{ displayReviews }})</span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {{ product.description }}
      </p>

      <!-- Price Section -->
      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-gray-900">
            ${{ product.price }}
          </span>
          <span
            v-if="
              props.originalPrice && props.originalPrice > props.product.price
            "
            class="text-sm text-gray-500 line-through"
          >
            ${{ props.originalPrice }}
          </span>
        </div>

        <!-- Stock Status -->
        <!-- <div
          v-if="props.inStock === false"
          class="text-sm text-red-600 font-medium"
        >
          Out of Stock
        </div> -->
        <div class="text-sm text-green-600 font-medium flex items-center">
          <div class="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
          In Stock
        </div>
      </div>

      <!-- Add to Cart Button (Always Visible) -->
      <div class="pt-3">
        <button
          @click.stop="addCart"
          :disabled="isAddingToCart"
          class="w-full bg-accent-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-accent-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
        >
          <svg
            v-if="!isAddingToCart"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <svg
            v-else
            class="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ isAddingToCart ? "Adding..." : "Add to Cart" }}</span>
        </button>

        <!-- Out of Stock Button -->
        <!-- <button
          v-else
          disabled
          class="w-full bg-gray-200 text-gray-500 py-2.5 px-4 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Out of Stock</span>
        </button> -->
      </div>
    </div>

    <!-- Hover Effect Border -->
    <div
      class="absolute inset-0 rounded-2xl border-2 border-accent-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    ></div>
  </NuxtLink>
</template>

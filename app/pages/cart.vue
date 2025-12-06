<script setup>
import { useCartStore } from "~/stores/useCart";
import { useFavoriteStore } from "~/stores/useFavorites";
import { onMounted, ref, nextTick } from "vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";

definePageMeta({
  middleware: ["auth-role"],
  layout: "user",
});

const cartStore = useCartStore();
const favorites = useFavoriteStore();
const isLoading = ref(true);
const animatedItems = ref(new Set());

onMounted(async () => {
  await cartStore.fetchCart();
  await favorites.fetchFavorites();
  
  // Stagger animation for cart items
  await nextTick();
  cartStore.cart.forEach((item, index) => {
    setTimeout(() => {
      animatedItems.value.add(item.product.id);
    }, index * 150);
  });
  
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

const handleRemoveItem = async (productId) => {
  // Add exit animation
  animatedItems.value.delete(productId);
  
  // Wait for animation to complete before removing
  setTimeout(async () => {
    await cartStore.removeCart(productId);
  }, 300);
};

const handleQuantityChange = async (productId, action) => {
  // Add bounce animation to the item
  const element = document.getElementById(`cart-item-${productId}`);
  if (element) {
    element.classList.add('animate-cart-bounce');
    setTimeout(() => {
      element.classList.remove('animate-cart-bounce');
    }, 600);
  }
  
  await cartStore.updateQuantity(productId, action);
};
</script>

<template>
  <section
    class="min-h-screen py-16 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-accent"></div>
      <div class="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
    </div>

    <div class="mx-auto max-w-screen-xl px-4 2xl:px-0 relative z-10">
      <!-- Title with Animation -->
      <div class="text-center mb-12 animate-slide-up-blur">
        <div class="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-full px-8 py-4 shadow-2xl border border-white/20">
          <span class="text-4xl animate-cart-bounce">🛒</span>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <LoadingSpinner message="Loading your cart..." />
      </div>

      <!-- Empty Cart with Animation -->
      <div
        v-else-if="cartStore.cart.length === 0"
        class="text-gray-600 text-xl bg-white/60 backdrop-blur-md border border-gray-100 py-20 rounded-3xl text-center shadow-xl animate-scale-in-bounce"
      >
        <div class="text-6xl mb-4 animate-heartbeat">🛒</div>
        <p class="font-semibold text-2xl">Your cart is empty 😔</p>
        <p class="text-sm mt-3 text-gray-500">
          Browse items and add your favorites to the cart
        </p>
        <button class="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          Start Shopping
        </button>
      </div>

      <!-- Cart Content -->
      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
<!-- LEFT: Items -->
        <div class="lg:col-span-2 space-y-6">
          <div
            v-for="(item, index) in cartStore.cart"
            :key="item.product.id"
            :id="`cart-item-${item.product.id}`"
            :class="[
              'relative p-5 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-1',
              animatedItems.has(item.product.id) ? 'animate-slide-in-fade opacity-100' : 'opacity-0 transform translate-x-[-30px]'
            ]"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <!-- Shimmer Effect on Hover -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Image with 3D Rotation -->
              <div
                class="relative w-full md:w-40 md:h-32 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 shadow-inner group"
              >
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                />
                <div class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-indigo-600">
                  {{ item.quantity }}x
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <p
                    class="text-sm font-semibold text-indigo-500 uppercase tracking-wide animate-slide-up-blur"
                    :style="{ animationDelay: `${index * 150 + 200}ms` }"
                  >
                    {{ item.product.category }}
                  </p>
                  <h3
                    class="text-xl font-bold text-gray-900 leading-tight mt-1 group-hover:text-indigo-600 transition-colors duration-300"
                  >
                    {{ item.product.name }}
                  </h3>
                </div>

                <div
                  class="flex items-center justify-between mt-4 border-t pt-4 border-gray-200"
                >
                  <!-- Quantity with Enhanced Controls -->
                  <div
                    class="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full py-2 px-4 shadow-inner border border-gray-200"
                  >
                    <button
                      @click="item.quantity > 1 ? handleQuantityChange(item.product.id, '-') : handleRemoveItem(item.product.id)"
                      class="w-8 h-8 rounded-full bg-white shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-300 flex items-center justify-center font-bold text-lg transform hover:scale-110 active:scale-95"
                    >
                      –
                    </button>

                    <span
                      class="w-8 text-center font-bold text-gray-900 text-lg bg-white rounded-full py-1 shadow-sm"
                    >
                      {{ item.quantity }}
                    </span>

                    <button
                      @click="handleQuantityChange(item.product.id, '+')"
                      class="w-8 h-8 rounded-full bg-white shadow-md hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center justify-center font-bold text-lg transform hover:scale-110 active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  <!-- Price with Animation -->
                  <div class="text-right">
                    <p
                      class="text-xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent"
                    >
                      ${{ (item.product.price * item.quantity).toFixed(2) }}
                    </p>
                    <p class="text-sm text-gray-500 mt-1">
                      ${{ item.product.price }} each
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Delete Button -->
            <button
              class="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 flex items-center justify-center shadow-md transform hover:scale-110 active:scale-95"
              @click="handleRemoveItem(item.product.id)"
            >
              ✕
            </button>
          </div>
        </div>

<!-- Order Summary with Enhanced Animation -->
        <div class="lg:w-96">
          <div
            class="rounded-3xl border border-indigo-200 bg-white/80 backdrop-blur-xl p-8 shadow-2xl animate-scale-in-bounce sticky top-8"
            :style="{ animationDelay: '600ms' }"
          >
            <!-- Animated Header -->
            <div class="text-center mb-8">
              <div class="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-full px-6 py-3">
                <div class="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                <h3 class="text-2xl font-bold text-gray-800 tracking-tight">
                  Order Summary
                </h3>
                <div class="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style="animation-delay: '0.5s'"></div>
              </div>
            </div>

            <div class="space-y-5 text-lg">
              <!-- Subtotal with Animation -->
              <div class="flex justify-between items-center group">
                <span class="text-gray-600 group-hover:text-gray-800 transition-colors">Subtotal</span>
                <span class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  ${{ (cartStore.totalPrice - 99).toFixed(2) }}
                </span>
              </div>

              <!-- Shipping with Icon -->
              <div class="flex justify-between items-center group">
                <span class="text-gray-600 group-hover:text-gray-800 transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                  Shipping
                </span>
                <span class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">$99</span>
              </div>

              <!-- Animated Divider -->
              <div class="border-t-2 border-dashed border-indigo-200 pt-6 mt-6 relative">
                <div class="absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-shimmer"></div>
                
                <!-- Total with Glow Effect -->
                <div class="flex justify-between text-3xl font-extrabold items-center">
                  <span class="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Total</span>
                  <span class="text-indigo-600 animate-pulse-glow">
                    ${{ cartStore.totalPrice }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Enhanced Checkout Button -->
            <button
              class="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] active:scale-95 transition-all duration-300 relative overflow-hidden group"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                <svg class="w-5 h-5 group-hover:animate-cart-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9M5 21h14"></path>
                </svg>
                Proceed to Checkout
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <!-- Continue Shopping with Animation -->
            <div class="mt-6 text-center">
              <a
                href="#"
                class="text-indigo-600 hover:text-cyan-600 font-medium flex items-center justify-center gap-2 group transition-all duration-300"
              >
                <span class="group-hover:-translate-x-1 transition-transform duration-300">Continue Shopping</span>
                <svg
                  class="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>

            <!-- Trust Badges -->
            <div class="mt-6 flex justify-center gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-pulse" style="animation-delay: '0.2s'">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center animate-pulse" style="animation-delay: '0.4s'">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

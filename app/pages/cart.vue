<script setup lang="ts">
import { useCartStore } from "~/stores/useCart";
import { useFavoriteStore } from "~/stores/useFavorites";
import { onMounted, ref, nextTick, computed } from "vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const cartStore = useCartStore();
const favorites = useFavoriteStore();
const isLoading = ref(true);
const animatedItems = ref(new Set());
const isUpdating = ref(new Set());

const subtotal = computed(() => {
  return cartStore.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
});

const shipping = computed(() => {
  return subtotal.value > 100 ? 0 : 9.99;
});

const tax = computed(() => {
  return subtotal.value * 0.08; // 8% tax
});

const total = computed(() => {
  return subtotal.value + shipping.value + tax.value;
});

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

const handleRemoveItem = async (productId: number) => {
  // Add exit animation
  animatedItems.value.delete(productId);
  
  // Wait for animation to complete before removing
  setTimeout(async () => {
    await cartStore.removeCart(productId);
  }, 300);
};

const handleQuantityChange = async (productId: number, action: string) => {
  // Add bounce animation to item
  const element = document.getElementById(`cart-item-${productId}`);
  if (element) {
    element.classList.add('animate-cart-bounce');
    setTimeout(() => {
      element.classList.remove('animate-cart-bounce');
    }, 600);
  }
  
  isUpdating.value.add(productId);
  try {
    await cartStore.updateQuantity(productId, action);
  } finally {
    isUpdating.value.delete(productId);
  }
};

const handleCheckout = () => {
  // Navigate to checkout page
  navigateTo('/checkout');
};
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-white">
    <!-- Cart Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p class="text-gray-600">
              {{ cartStore.cart.length }} {{ cartStore.cart.length === 1 ? 'item' : 'items' }} in your cart
            </p>
          </div>
          <NuxtLink
            to="/shop"
            class="flex items-center space-x-2 text-accent-600 hover:text-accent-700 font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Continue Shopping</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Cart Content -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <LoadingSpinner message="Loading your cart..." />
        </div>

        <!-- Empty Cart -->
        <div v-else-if="cartStore.cart.length === 0" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <NuxtLink
            to="/shop"
            class="inline-flex items-center px-8 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
          >
            Start Shopping
          </NuxtLink>
        </div>

        <!-- Cart Items -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items List -->
          <div class="lg:col-span-2 space-y-4">
            <div
              v-for="(item, index) in cartStore.cart"
              :key="item.product.id"
              :id="`cart-item-${item.product.id}`"
              :class="[
                'bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300',
                animatedItems.has(item.product.id) ? 'animate-slide-in-fade opacity-100' : 'opacity-0 transform translate-x-[-30px]'
              ]"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Product Image -->
                <div class="sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    :src="item.product.image"
                    :alt="item.product.name"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <!-- Product Details -->
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ item.product.name }}</h3>
                    <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ item.product.description }}</p>
                    <p class="text-accent-600 font-semibold">${{ item.product.price }}</p>
                  </div>

                  <!-- Quantity and Actions -->
                  <div class="flex items-center justify-between mt-4">
                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2">
                      <button
                        @click="item.quantity > 1 ? handleQuantityChange(item.product.id, '-') : handleRemoveItem(item.product.id)"
                        :disabled="isUpdating.has(item.product.id)"
                        class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
                      <button
                        @click="handleQuantityChange(item.product.id, '+')"
                        :disabled="isUpdating.has(item.product.id)"
                        class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Item Total and Remove -->
                    <div class="flex items-center space-x-4">
                      <div class="text-right">
                        <p class="text-lg font-semibold text-gray-900">
                          ${{ (item.product.price * item.quantity).toFixed(2) }}
                        </p>
                      </div>
                      <button
                        @click="handleRemoveItem(item.product.id)"
                        class="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:w-96">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div class="space-y-4">
                <!-- Subtotal -->
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-medium text-gray-900">${{ subtotal.toFixed(2) }}</span>
                </div>

                <!-- Shipping -->
                <div class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span class="font-medium text-gray-900">
                    {{ shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` }}
                  </span>
                </div>

                <!-- Tax -->
                <div class="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span class="font-medium text-gray-900">${{ tax.toFixed(2) }}</span>
                </div>

                <!-- Free Shipping Notice -->
                <div v-if="shipping > 0" class="bg-accent-50 border border-accent-200 rounded-lg p-3">
                  <p class="text-sm text-accent-700">
                    Add ${{ (100 - subtotal.value).toFixed(2) }} more for free shipping!
                  </p>
                </div>

                <!-- Divider -->
                <div class="border-t pt-4">
                  <div class="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span class="text-accent-600">${{ total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <!-- Checkout Button -->
              <button
                @click="handleCheckout"
                class="w-full mt-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 font-medium"
              >
                Proceed to Checkout
              </button>

              <!-- Security Badge -->
              <div class="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

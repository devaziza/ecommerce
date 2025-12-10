<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useCartStore } from "~/stores/useCart";

const cartStore = useCartStore();
const open = ref(false);
const isAnimating = ref(false);

const itemsInCart = computed(() => cartStore.cart?.length || 0);
const cartTotal = computed(() => cartStore.totalPrice || '0.00');

const toggleDropdown = async () => {
  if (open.value) {
    isAnimating.value = true;
    open.value = false;
    setTimeout(() => {
      isAnimating.value = false;
    }, 300);
  } else {
    open.value = true;
  }
};

const handleRemoveItem = async (productId: number) => {
  await cartStore.removeCart(productId);
};

onMounted(async () => {
  await cartStore.fetchCart();
});
</script>

<template>
  <div class="relative">
    <!-- Enhanced Cart Button with Animation -->
    <button 
      @click="toggleDropdown" 
      class="relative group transform transition-all duration-300 hover:scale-110 active:scale-95"
    >
      <!-- Cart Icon with Hover Effect -->
      <div class="relative">
        <svg 
          class="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9M5 21h14" 
          />
        </svg>
        
        <!-- Animated Badge -->
        <Transition
          enter-active-class="animate-scale-in-bounce"
          leave-active-class="animate-scale-out"
        >
          <span 
            v-if="itemsInCart > 0"
            class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse"
          >
            {{ itemsInCart }}
          </span>
        </Transition>
      </div>
    </button>

    <!-- Enhanced Dropdown with Animation -->
    <Transition
      enter-active-class="animate-slide-up-blur"
      leave-active-class="animate-slide-down-blur"
    >
      <div 
        v-if="open && !isAnimating"
        class="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-50"
      >
        <!-- Dropdown Header -->
        <div class="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4 text-white">
          <h3 class="font-bold text-lg">Shopping Cart</h3>
          <p class="text-sm opacity-90">{{ itemsInCart }} items</p>
        </div>

        <!-- Cart Items -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="itemsInCart === 0" class="p-8 text-center">
            <div class="text-4xl mb-3 animate-float">🛒</div>
            <p class="text-gray-500">Your cart is empty</p>
            <button class="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Start Shopping →
            </button>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="(item, index) in cartStore.cart"
              :key="item.product.id"
              class="p-4 hover:bg-gray-50 transition-colors duration-200 animate-slide-in-fade"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="flex gap-3">
                <!-- Product Image -->
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    :src="item.product.image_url"
                    :alt="item.product.name"
                    class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-gray-900 truncate">{{ item.product.name }}</h4>
                  <p class="text-sm text-gray-500">{{ item.quantity }} × ${{ item.product.price }}</p>
                  <p class="text-sm font-bold text-indigo-600">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
                </div>

                <!-- Remove Button -->
                <button
                  @click="handleRemoveItem(item.product.id)"
                  class="text-gray-400 hover:text-red-500 transition-colors duration-200 transform hover:scale-110 active:scale-95"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Dropdown Footer -->
        <div v-if="itemsInCart > 0" class="p-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <span class="font-semibold text-gray-900">Total:</span>
            <span class="font-bold text-xl text-indigo-600">${{ cartTotal }}</span>
          </div>
          <button
            class="w-full py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            Checkout
          </button>
          <button
            @click="open = false"
            class="w-full mt-2 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition
      enter-active-class="animate-fade-in"
      leave-active-class="animate-fade-out"
    >
      <div
        v-if="open"
        @click="open = false"
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      ></div>
    </Transition>
  </div>
</template>

<style scoped>
@keyframes scale-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}

@keyframes slide-down-blur {
  from {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
    filter: blur(10px);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

.animate-scale-out {
  animation: scale-out 0.3s ease-out;
}

.animate-slide-down-blur {
  animation: slide-down-blur 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-fade-out {
  animation: fade-out 0.2s ease-out;
}
</style>

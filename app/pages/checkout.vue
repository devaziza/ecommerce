<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/useCart";
import { useOrderStore } from "~/stores/useOrders";
import { useAuthStore } from "~/stores/useAuth";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const isProcessing = ref(false);
const error = ref<string | null>(null);

const cartItems = computed(() => cartStore.cart);
const totalPrice = computed(() => cartStore.totalPrice);
const itemCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0));

const shippingCost = computed(() => totalPrice.value > 100 ? 0 : 10);
const tax = computed(() => totalPrice.value * 0.08);
const finalTotal = computed(() => totalPrice.value + shippingCost.value + tax.value);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const handleCheckout = async () => {
  if (cartItems.value.length === 0) {
    error.value = "Your cart is empty";
    return;
  }

  try {
    isProcessing.value = true;
    error.value = null;

    await orderStore.createOrder();
    
    // Redirect to orders page on success
    router.push("/orders?success=true");
  } catch (err: any) {
    error.value = err.message || "Failed to place order";
  } finally {
    isProcessing.value = false;
  }
};

const goToShop = () => {
  router.push("/shop");
};

onMounted(async () => {
  await cartStore.fetchCart();
});
</script>

<template>
  <div class="bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p class="text-gray-600">Review your order and complete your purchase</p>
      </div>

      <div v-if="cartStore.loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
            <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600">Loading your cart...</p>
        </div>
      </div>

      <div v-else-if="cartItems.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p class="text-gray-600 mb-8">Add some items to your cart before checkout</p>
        <button
          @click="goToShop"
          class="inline-flex items-center px-8 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Continue Shopping
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Items -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Cart Items -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Items ({{ itemCount }})</h2>
            
            <div class="space-y-4">
              <div
                v-for="item in cartItems"
                :key="item.product.id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div class="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    v-if="item.product.image_url"
                    :src="item.product.image_url"
                    :alt="item.product.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.product.name }}</h3>
                  <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
                </div>
                
                <div class="text-right">
                  <p class="text-sm text-gray-600">{{ formatPrice(item.product.price) }} each</p>
                  <p class="font-semibold text-gray-900">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ authStore.user?.name }}</p>
                  <p class="text-gray-600">{{ authStore.user?.email }}</p>
                </div>
              </div>
              
              <div class="text-sm text-gray-600">
                <p class="mb-2">📍 Shipping address will be collected in next step</p>
                <p>📧 Order confirmation will be sent to your email</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ itemCount }} items)</span>
                <span>{{ formatPrice(totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span v-if="shippingCost === 0" class="text-green-600">FREE</span>
                <span v-else>{{ formatPrice(shippingCost) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{{ formatPrice(tax) }}</span>
              </div>
              <div v-if="shippingCost === 0" class="text-sm text-green-600 bg-green-50 p-2 rounded">
                🎉 You've qualified for free shipping!
              </div>
            </div>
            
            <div class="flex justify-between text-lg font-semibold text-gray-900 pt-4 border-t border-gray-200 mb-6">
              <span>Total</span>
              <span>{{ formatPrice(finalTotal) }}</span>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {{ error }}
            </div>

            <!-- Checkout Button -->
            <button
              @click="handleCheckout"
              :disabled="isProcessing || cartStore.loading"
              class="w-full bg-accent-600 text-white py-4 rounded-xl font-semibold hover:bg-accent-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isProcessing ? 'Processing...' : 'Place Order' }}</span>
            </button>

            <!-- Security Badge -->
            <div class="mt-6 text-center">
              <div class="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
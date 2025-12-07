<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderStore as useOrdersStore } from "~/stores/useOrders";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const orderStore = useOrdersStore();

const isLoading = ref(true);
const error = ref<string | null>(null);

const getStatusColor = (status: string) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status: string) => {
  const icons = {
    pending: "⏳",
    processing: "🔄",
    shipped: "📦",
    delivered: "✅",
    cancelled: "❌",
  };
  return icons[status as keyof typeof icons] || "📋";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const goBack = () => {
  router.push("/orders");
};

onMounted(async () => {
  try {
    if (id) {
      await orderStore.fetchOrderDetail(id);
    } else {
      error.value = "Order ID not found";
    }
  } catch (err) {
    error.value = "Failed to load order details";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading || orderStore.loading" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600">Loading order details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || orderStore.error" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Order</h3>
        <p class="text-gray-600 mb-6">{{ error || orderStore.error }}</p>
        <button
          @click="goBack"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Back to Orders
        </button>
      </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="orderStore.orderDetail" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="goBack"
          class="inline-flex items-center text-accent-600 hover:text-accent-700 mb-4 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Orders
        </button>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                Order #{{ orderStore.orderDetail.id }}
              </h1>
              <p class="text-gray-600">
                Placed on {{ formatDate(orderStore.orderDetail.created_at || '') }}
              </p>
            </div>
            
            <div class="flex items-center space-x-3">
              <span class="text-3xl">{{ getStatusIcon(orderStore.orderDetail.status) }}</span>
              <span
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                :class="getStatusColor(orderStore.orderDetail.status)"
              >
                {{ orderStore.orderDetail.status.charAt(0).toUpperCase() + orderStore.orderDetail.status.slice(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
        
        <div class="space-y-4">
          <div
            v-for="item in orderStore.orderDetail.items"
            :key="item.id"
            class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <div class="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                v-if="item.product_image"
                :src="item.product_image"
                :alt="item.product_name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 text-lg">{{ item.product_name }}</h3>
              <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
            </div>
            
            <div class="text-right">
              <p class="text-sm text-gray-600">Price per item</p>
              <p class="font-semibold text-gray-900">{{ formatPrice(item.price || 0) }}</p>
              <p class="text-sm text-gray-600 mt-1">Subtotal</p>
              <p class="font-semibold text-lg text-gray-900">
                {{ formatPrice((item.price || 0) * item.quantity) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
        
        <div class="space-y-3">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{{ formatPrice((orderStore.orderDetail.total_price || 0) * 0.9) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{{ formatPrice((orderStore.orderDetail.total_price || 0) * 0.1) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{{ formatPrice(0) }}</span>
          </div>
          <div class="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>{{ formatPrice(orderStore.orderDetail.total_price || 0) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            v-if="orderStore.orderDetail.status === 'delivered'"
            class="flex-1 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 font-medium"
          >
            Reorder Items
          </button>
          <button
            v-if="orderStore.orderDetail.status === 'shipped'"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Track Order
          </button>
          <button
            @click="goBack"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

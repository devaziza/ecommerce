<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useOrderStore } from "~/stores/useOrders";
import { useRouter } from "vue-router";
import type { Order, OrderDetail } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const router = useRouter();
const ordersStore = useOrderStore();

const isLoading = ref(true);
const selectedOrder = ref<OrderDetail | null>(null);
const activeTab = ref("all");
const searchQuery = ref("");
const statusFilter = ref("all");
const showSuccessMessage = ref(false);

const orders = computed(() => ordersStore.orders);

const filteredOrders = computed(() => {
  let filtered = orders.value;
  
  // Filter by status
  if (statusFilter.value !== "all") {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }
  
  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(order => 
      order.id.toString().includes(searchQuery.value) ||
      order.items?.some(item => item.product_name?.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }
  
  // Filter by tab
  if (activeTab.value === "recent") {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(order => new Date(order.created_at || '') > thirtyDaysAgo);
  }
  
  return filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
});

const statusOptions = [
  { value: "all", label: "All Orders", color: "gray" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "processing", label: "Processing", color: "blue" },
  { value: "shipped", label: "Shipped", color: "purple" },
  { value: "delivered", label: "Delivered", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "red" },
];

const getStatusColor = (status: string) => {
  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption?.color || "gray";
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
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const viewOrderDetails = async (orderId: number) => {
  try {
    const orderDetail = await ordersStore.fetchOrderDetail(orderId);
    selectedOrder.value = orderDetail;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
  }
};

const closeOrderDetails = () => {
  selectedOrder.value = null;
};

const trackOrder = (order: Order) => {
  // In a real app, this would open tracking page or external tracking
  console.log("Tracking order:", order.id);
};

const cancelOrder = async (orderId: number) => {
  if (confirm("Are you sure you want to cancel this order?")) {
    try {
      await ordersStore.cancelOrder(orderId);
      await ordersStore.fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  }
};

const reorderItems = async (items: any[]) => {
  // In a real app, this would add items to cart
  console.log("Reordering items:", items);
};

const goToOrderDetail = (id: number) => {
  router.push(`/orders/${id}`);
};

onMounted(async () => {
  try {
    await ordersStore.fetchOrders();
    
    // Check if user just completed checkout
    if (route.query.success === 'true') {
      showSuccessMessage.value = true;
      // Remove query param
      router.replace({ query: {} });
      // Hide message after 5 seconds
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 5000);
    }
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-gray-50">
    <!-- Success Message -->
    <div v-if="showSuccessMessage" class="bg-green-50 border-b border-green-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-green-800">Order placed successfully!</h3>
              <p class="text-sm text-green-700">Your order has been received and is being processed.</p>
            </div>
          </div>
          <button
            @click="showSuccessMessage = false"
            class="text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Orders Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p class="text-gray-600">
              {{ filteredOrders.length }} {{ filteredOrders.length === 1 ? 'order' : 'orders' }}
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink
              to="/checkout"
              class="inline-flex items-center px-6 py-3 border border-accent-600 text-accent-600 rounded-lg hover:bg-accent-50 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Checkout
            </NuxtLink>
            <NuxtLink
              to="/shop"
              class="inline-flex items-center px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Orders Content -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
              <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Loading your orders...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="ordersStore.error" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
          <p class="text-gray-600 mb-6">{{ ordersStore.error }}</p>
          <button
            @click="ordersStore.fetchOrders()"
            class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>

        <!-- Orders List -->
        <div v-else>
          <!-- Filters and Search -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div class="flex flex-col lg:flex-row gap-4">
              <!-- Search -->
              <div class="flex-1">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search orders by ID or product name..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <!-- Status Filter -->
              <div class="lg:w-48">
                <select
                  v-model="statusFilter"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
                >
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div class="flex border-b border-gray-200">
              <button
                v-for="tab in ['all', 'recent']"
                :key="tab"
                @click="activeTab = tab"
                class="px-6 py-3 font-medium text-sm capitalize transition-colors duration-200"
                :class="activeTab === tab ? 'text-accent-600 border-b-2 border-accent-600' : 'text-gray-500 hover:text-gray-700'"
              >
                {{ tab === 'all' ? 'All Orders' : 'Recent Orders' }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredOrders.length === 0" class="text-center py-16">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p class="text-gray-600 mb-8 max-w-md mx-auto">
              {{ searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : "You haven't placed any orders yet" }}
            </p>
            <NuxtLink
              to="/shop"
              class="inline-flex items-center px-8 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
            >
              Start Shopping
            </NuxtLink>
          </div>

          <!-- Orders Grid -->
          <div v-else class="space-y-6">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
            >
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <!-- Order Info -->
                <div class="flex-1">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div>
                      <p class="text-sm text-gray-500">Order #</p>
                      <p class="font-semibold text-gray-900">{{ order.id }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Date</p>
                      <p class="font-medium text-gray-900">{{ formatDate(order.created_at || '') }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Total</p>
                      <p class="font-semibold text-gray-900">{{ formatPrice(order.total_price) }}</p>
                    </div>
                  </div>

                  <!-- Status Badge -->
                  <div class="flex items-center space-x-2">
                    <span class="text-2xl">{{ getStatusIcon(order.status) }}</span>
                    <div>
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        :class="{
                          'bg-yellow-100 text-yellow-800': order.status === 'pending',
                          'bg-blue-100 text-blue-800': order.status === 'processing',
                          'bg-purple-100 text-purple-800': order.status === 'shipped',
                          'bg-green-100 text-green-800': order.status === 'delivered',
                          'bg-red-100 text-red-800': order.status === 'cancelled',
                        }"
                      >
                        {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-3 lg:ml-6">
                  <button
                    @click="viewOrderDetails(order.id)"
                    class="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 font-medium"
                  >
                    View Details
                  </button>
                  <button
                    v-if="order.status === 'shipped'"
                    @click="trackOrder(order)"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Track Order
                  </button>
                  <button
                    v-if="order.status === 'delivered'"
                    @click="reorderItems(order.items || [])"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Reorder
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    @click="cancelOrder(order.id)"
                    class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <!-- Order Items Preview -->
              <div v-if="order.items && order.items.length > 0" class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium text-gray-900">Order Items</h4>
                  <span class="text-sm text-gray-500">{{ order.items.length }} items</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    v-for="item in order.items.slice(0, 3)"
                    :key="item.id"
                    class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        v-if="item.product_image"
                        :src="item.product_image"
                        :alt="item.product_name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ item.product_name }}</p>
                      <p class="text-sm text-gray-500">Qty: {{ item.quantity }} × {{ formatPrice(item.price || 0) }}</p>
                    </div>
                  </div>
                  <!-- Show more indicator -->
                  <div
                    v-if="order.items.length > 3"
                    class="flex items-center justify-center p-3 bg-gray-50 rounded-lg text-sm text-gray-500"
                  >
                    +{{ order.items.length - 3 }} more
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Order Details Modal -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click="closeOrderDetails"
    >
      <div
        class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Order Details #{{ selectedOrder.id }}</h2>
          <button
            @click="closeOrderDetails"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6">
          <!-- Order Status Timeline -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <div class="flex items-center space-x-4">
              <span class="text-3xl">{{ getStatusIcon(selectedOrder.status) }}</span>
              <div>
                <p class="font-medium text-gray-900 capitalize">{{ selectedOrder.status }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(selectedOrder.created_at || '') }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div class="space-y-4">
              <div
                v-for="item in selectedOrder.items"
                :key="item.id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    v-if="item.product_image"
                    :src="item.product_image"
                    :alt="item.product_name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.product_name }}</h4>
                  <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{{ formatPrice(item.price || 0) }}</p>
                  <p class="text-sm text-gray-500">{{ formatPrice((item.price || 0) * item.quantity) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t pt-6">
            <div class="space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{{ formatPrice(selectedOrder.total_price * 0.9) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{{ formatPrice(selectedOrder.total_price * 0.1) }}</span>
              </div>
              <div class="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{{ formatPrice(selectedOrder.total_price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

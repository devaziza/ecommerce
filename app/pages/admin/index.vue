<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/useAuth";
import { useProductStore } from "~/stores/useProducts";
import { useOrderStore } from "~/stores/useOrders";
import { useCategoryStore } from "~/stores/useCategory";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: "auth-role",
  layout: "admin",
});

const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();
const orderStore = useOrderStore();
const categoryStore = useCategoryStore();

const isLoading = ref(false);
const error = ref<string | null>(null);
const selectedPeriod = ref("30days");

// Period options
const periodOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "1year", label: "Last Year" },
];

// Computed properties
const user = computed(() => authStore.user);
const products = computed(() => productStore.products);
const orders = computed(() => orderStore.orders);
const categories = computed(() => categoryStore.categories);

// Dashboard statistics
const stats = computed(() => {
  const totalRevenue = orders.value.reduce(
    (sum, order) => sum + (order.total_price || 0),
    0
  );
  const totalOrders = orders.value.length;
  const totalProducts = products.value.length;
  const totalCategories = categories.value.length;

  // Recent orders (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentOrders = orders.value.filter(
    (order) => new Date(order.created_at || "") > thirtyDaysAgo
  );

  // Orders by status
  const ordersByStatus = {
    pending: orders.value.filter((o) => o.status === "pending").length,
    processing: orders.value.filter((o) => o.status === "processing").length,
    shipped: orders.value.filter((o) => o.status === "shipped").length,
    delivered: orders.value.filter((o) => o.status === "delivered").length,
    cancelled: orders.value.filter((o) => o.status === "cancelled").length,
  };

  // Top products (by order frequency - mock data for now)
  const topProducts = products.value.slice(0, 5);

  // Recent orders for display
  const recentOrdersList = orders.value.slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCategories,
    recentOrders: recentOrders.length,
    ordersByStatus,
    topProducts,
    recentOrdersList,
  };
});

// Utility functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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

// Navigation functions
const goToProducts = () => {
  router.push("/admin/products");
};

const goToOrders = () => {
  router.push("/admin/orders");
};

const goToUsers = () => {
  router.push("/admin/users");
};

const goToCategories = () => {
  router.push("/admin/categories");
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

// Load dashboard data
const loadDashboardData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // await Promise.all([
    //   productStore.fetchProducts(),
    //   orderStore.fetchOrders(),
    //   categoryStore.fetchCategories(),
    // ]);
  } catch (err: any) {
    error.value = err.message || "Failed to load dashboard data";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadDashboardData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <div
              class="w-8 h-8 bg-gradient-to-br from-accent-600 to-accent-700 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p class="text-sm text-gray-500">
                Welcome back, {{ user?.name }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Period Selector -->
            <select
              v-model="selectedPeriod"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent"
            >
              <option
                v-for="period in periodOptions"
                :key="period.value"
                :value="period.value"
              >
                {{ period.label }}
              </option>
            </select>

            <!-- User Menu -->
            <div class="relative group">
              <button
                class="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <div
                  class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <span class="text-gray-700 font-medium text-sm">{{
                    user?.name?.charAt(0)?.toUpperCase() || "A"
                  }}</span>
                </div>
                <span class="font-medium">{{ user?.name }}</span>
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
              >
                <div class="py-2">
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4"
        >
          <svg
            class="animate-spin h-8 w-8 text-accent-600"
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
        </div>
        <p class="text-gray-600">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
        >
          <svg
            class="w-8 h-8 text-red-600"
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
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Dashboard
        </h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="loadDashboardData"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <section class="mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Revenue -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600">Total Revenue</h3>
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343.895 3 2 .895 3 2 3 2zm0 8c1.657 0 3-.895 3-2s-1.343-.895-3-2-.895-3-2-3-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">
              {{ formatPrice(stats.totalRevenue) }}
            </p>
            <p class="text-sm text-green-600">+12.5% from last month</p>
          </div>

          <!-- Total Orders -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600">Total Orders</h3>
              <div
                class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalOrders }}
            </p>
            <p class="text-sm text-blue-600">{{ stats.recentOrders }} recent</p>
          </div>

          <!-- Total Products -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600">Total Products</h3>
              <div
                class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4M5 7h14l-7 7 7-7M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalProducts }}
            </p>
            <p class="text-sm text-purple-600">
              Across {{ stats.totalCategories }} categories
            </p>
          </div>

          <!-- Total Categories -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600">Categories</h3>
              <div
                class="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalCategories }}
            </p>
            <p class="text-sm text-accent-600">Active categories</p>
          </div>
        </div>
      </section>

      <!-- Charts and Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Status Chart -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">
              Order Status Overview
            </h2>

            <!-- Status Bars -->
            <div class="space-y-4">
              <div
                v-for="(count, status) in stats.ordersByStatus"
                :key="status"
                class="flex items-center space-x-4"
              >
                <div class="flex items-center space-x-2 w-24">
                  <span class="text-2xl">{{ getStatusIcon(status) }}</span>
                  <span class="text-sm font-medium capitalize">{{
                    status
                  }}</span>
                </div>

                <div class="flex-1">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">{{ count }} orders</span>
                    <span class="font-medium"
                      >{{
                        Math.round((count / stats.totalOrders) * 100)
                      }}%</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-500"
                      :class="{
                        'bg-yellow-500': status === 'pending',
                        'bg-blue-500': status === 'processing',
                        'bg-purple-500': status === 'shipped',
                        'bg-green-500': status === 'delivered',
                        'bg-red-500': status === 'cancelled',
                      }"
                      :style="{
                        width: `${(count / stats.totalOrders) * 100}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>

            <div class="space-y-3">
              <button
                @click="goToProducts"
                class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6V4m0 2h2m0 0v6m0 0h6m-6 4h.01M9 16h.01"
                      ></path>
                    </svg>
                  </div>
                  <span class="font-medium">Add Product</span>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>

              <button
                @click="goToOrders"
                class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      ></path>
                    </svg>
                  </div>
                  <span class="font-medium">Manage Orders</span>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>

              <button
                @click="goToUsers"
                class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h2a6 6 0 016 6v1z"
                      ></path>
                    </svg>
                  </div>
                  <span class="font-medium">Manage Users</span>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>

              <button
                @click="goToCategories"
                class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-accent-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      ></path>
                    </svg>
                  </div>
                  <span class="font-medium">Manage Categories</span>
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <section class="mt-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div
            class="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
          >
            <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button
              @click="goToOrders"
              class="text-accent-600 hover:text-accent-700 font-medium transition-colors duration-200"
            >
              View All
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr
                  v-for="order in stats.recentOrdersList"
                  :key="order.id"
                  class="hover:bg-gray-50"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    #{{ order.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDate(order.created_at || "") }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusColor(order.status)"
                    >
                      {{ getStatusIcon(order.status) }}
                      {{
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ formatPrice(order.total_price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click="goToOrders"
                      class="text-accent-600 hover:text-accent-700 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div
              v-if="stats.recentOrdersList.length === 0"
              class="text-center py-8"
            >
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                No orders yet
              </h3>
              <p class="text-gray-600">
                When you get orders, they'll appear here
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

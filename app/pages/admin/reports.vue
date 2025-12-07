<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useOrderStore } from "~/stores/useOrders";
import { useProductStore } from "~/stores/useProducts";
import { useCategoryStore } from "~/stores/useCategory";
import { useAuthStore } from "~/stores/useAuth";

definePageMeta({
  middleware: "auth-role",
  layout: "admin",
});

const orderStore = useOrderStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const isLoading = ref(false);
const error = ref<string | null>(null);
const selectedPeriod = ref("30days");
const selectedReport = ref("overview");

// Report options
const periodOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "1year", label: "Last Year" },
];

const reportOptions = [
  { value: "overview", label: "Overview" },
  { value: "sales", label: "Sales Report" },
  { value: "products", label: "Products Report" },
  { value: "categories", label: "Categories Report" },
  { value: "orders", label: "Orders Report" },
];

// Computed properties
const orders = computed(() => orderStore.orders);
const products = computed(() => productStore.products);
const categories = computed(() => categoryStore.categories);

// Analytics data
const analytics = computed(() => {
  const period = selectedPeriod.value;
  const daysAgo = period === "7days" ? 7 : period === "30days" ? 30 : period === "90days" ? 90 : 365;
  const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  
  // Filter data by period
  const filteredOrders = orders.value.filter(order => 
    new Date(order.created_at || '') > cutoffDate
  );
  
  // Calculate metrics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Top products (mock data for demonstration)
  const topProducts = products.value.slice(0, 5).map(product => ({
    ...product,
    orderCount: Math.floor(Math.random() * 20) + 1,
    revenue: product.price * (Math.floor(Math.random() * 20) + 1),
  }));
  
  // Orders by status
  const ordersByStatus = {
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    shipped: filteredOrders.filter(o => o.status === 'shipped').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
  };
  
  // Daily sales data (mock)
  const dailySales = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    revenue: Math.floor(Math.random() * 1000) + 500,
    orders: Math.floor(Math.random() * 10) + 2,
  }));
  
  // Category performance
  const categoryPerformance = categories.value.map(category => ({
    ...category,
    productCount: Math.floor(Math.random() * 50) + 5,
    revenue: Math.floor(Math.random() * 5000) + 1000,
  }));
  
  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    topProducts,
    ordersByStatus,
    dailySales,
    categoryPerformance,
    period,
  };
});

// Utility functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatDateFull = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getPercentage = (value: number, total: number) => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

// Load data
const loadAnalyticsData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    await Promise.all([
      orderStore.fetchOrders(),
      productStore.fetchProducts(),
      categoryStore.fetchCategories(),
    ]);
  } catch (err: any) {
    error.value = err.message || "Failed to load analytics data";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadAnalyticsData();
});
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p class="text-gray-600">Track your store performance and sales metrics</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedPeriod"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
        >
          <option v-for="period in periodOptions" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
        
        <select
          v-model="selectedReport"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
        >
          <option v-for="report in reportOptions" :key="report.value" :value="report.value">
            {{ report.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600">Loading analytics data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="loadAnalyticsData"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Analytics Content -->
    <div v-else class="space-y-6">
      <!-- Overview Report -->
      <div v-if="selectedReport === 'overview'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600">Total Revenue</h3>
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343.895 3 2 .895 3 2 3 2zm0 8c1.657 0 3-.895 3-2s-1.343-.895-3-2-.895-3-2-3-2z"></path>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ formatPrice(analytics.totalRevenue) }}</p>
          <p class="text-sm text-green-600">+15.2% from last period</p>
        </div>

        <!-- Total Orders -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600">Total Orders</h3>
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ analytics.totalOrders }}</p>
          <p class="text-sm text-blue-600">{{ analytics.period }} performance</p>
        </div>

        <!-- Average Order Value -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600">Avg Order Value</h3>
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 0v2m0 0h6m-6 4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ formatPrice(analytics.averageOrderValue) }}</p>
          <p class="text-sm text-purple-600">Per order</p>
        </div>

        <!-- Conversion Rate -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600">Conversion Rate</h3>
            <div class="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v2m0 0h6m-6 4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900">3.2%</p>
          <p class="text-sm text-accent-600">Visitors to orders</p>
        </div>
      </div>

      <!-- Sales Report -->
      <div v-else-if="selectedReport === 'sales'" class="space-y-6">
        <!-- Sales Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Sales Trend</h2>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Sales chart would be displayed here</p>
            <p class="text-sm text-gray-400">Integrate with Chart.js for visualization</p>
          </div>
        </div>

        <!-- Daily Sales Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Daily Sales Breakdown</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="day in analytics.dailySales" :key="day.date.toISOString()" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ formatDate(day.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ formatPrice(day.revenue) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ day.orders }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatPrice(day.revenue / day.orders) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Products Report -->
      <div v-else-if="selectedReport === 'products'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="product in analytics.topProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        v-if="product.image_url"
                        :src="product.image_url"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M9 16h.01"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ product.name }}</p>
                      <p class="text-sm text-gray-500">ID: {{ product.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatPrice(product.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ product.orderCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatPrice(product.revenue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full bg-green-500"
                        :style="{ width: `${Math.min(product.orderCount / 20 * 100, 100)}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-600">{{ product.orderCount }} orders</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Categories Report -->
      <div v-else-if="selectedReport === 'categories'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Category Performance</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="category in analytics.categoryPerformance"
            :key="category.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    v-if="category.image_url"
                    :src="category.image_url"
                    :alt="category.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                    <span class="text-white font-bold">{{ category.name.charAt(0) }}</span>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
                  <p class="text-sm text-gray-500">{{ category.productCount }} products</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">{{ formatPrice(category.revenue) }}</p>
                <p class="text-sm text-green-600">Total revenue</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full bg-accent-500"
                  :style="{ width: `${Math.min(category.revenue / 10000 * 100, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-sm text-gray-600 mt-2">
                <span>{{ getPercentage(category.revenue, analytics.categoryPerformance.reduce((sum, cat) => sum + cat.revenue, 0)) }}% of total</span>
                <span>{{ category.productCount }} products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Report -->
      <div v-else-if="selectedReport === 'orders'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Order Status Breakdown</h2>
        
        <!-- Status Overview -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            v-for="(count, status) in analytics.ordersByStatus"
            :key="status"
            class="text-center p-4 border border-gray-200 rounded-lg"
          >
            <div class="text-3xl font-bold mb-2">{{ count }}</div>
            <div class="text-sm font-medium capitalize mb-1">{{ status }}</div>
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
                :style="{ width: `${getPercentage(count, analytics.totalOrders)}%` }"
              ></div>
            </div>
            <div class="text-xs text-gray-500 mt-2">
              {{ getPercentage(count, analytics.totalOrders) }}% of total orders
            </div>
          </div>
        </div>

        <!-- Order Status Table -->
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Orders by Status</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="order in orders.slice(0, 10)" :key="order.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ order.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Customer {{ order.id % 5 + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
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
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ formatPrice(order.total_price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDateFull(new Date(order.created_at || '')) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
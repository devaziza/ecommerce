<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/useAuth";
import { useOrderStore } from "~/stores/useOrders";
import { useFavoriteStore } from "~/stores/useFavorites";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: "auth-role",
  layout: "user",
});

const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const favoriteStore = useFavoriteStore();

// Profile data
const isEditing = ref(false);
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Form data
const formData = ref({
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// UI state
const activeTab = ref("profile");
const isChangingPassword = ref(false);

// Computed properties
const user = computed(() => authStore.user);
const totalOrders = computed(() => orderStore.orders.length);
const totalFavorites = computed(() => favoriteStore.favorites.length);

// Stats
const userStats = computed(() => ({
  totalOrders: orderStore.orders.length,
  totalSpent: orderStore.orders.reduce((sum, order) => sum + (order.total_price || 0), 0),
  favoriteItems: favoriteStore.favorites.length,
  memberSince: user.value?.created_at ? new Date(user.value.created_at).toLocaleDateString() : '',
}));

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Initialize form data
const initializeFormData = () => {
  if (user.value) {
    formData.value.name = user.value.name || "";
    formData.value.email = user.value.email || "";
  }
};

// Edit profile
const startEditing = () => {
  isEditing.value = true;
  successMessage.value = "";
  errorMessage.value = "";
  initializeFormData();
};

const cancelEditing = () => {
  isEditing.value = false;
  isChangingPassword.value = false;
  successMessage.value = "";
  errorMessage.value = "";
  initializeFormData();
};

// Update profile
const updateProfile = async () => {
  if (!formData.value.name.trim() || !formData.value.email.trim()) {
    errorMessage.value = "Name and email are required";
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = "";

    const updateData: any = {
      name: formData.value.name.trim(),
      email: formData.value.email.trim(),
    };

    // Add password if changing
    if (isChangingPassword.value && formData.value.newPassword) {
      updateData.password = formData.value.newPassword;
    }

    const data = await $fetch(`${useRuntimeConfig().public.apiBase}/api/users/me`, {
      method: "PUT",
      credentials: "include",
      body: updateData,
    });

    // Update user in store
    authStore.user = { ...authStore.user, ...data.user };
    
    successMessage.value = "Profile updated successfully!";
    isEditing.value = false;
    isChangingPassword.value = false;
    
    // Clear password fields
    formData.value.currentPassword = "";
    formData.value.newPassword = "";
    formData.value.confirmPassword = "";

  } catch (err: any) {
    errorMessage.value = err.data?.statusMessage || "Failed to update profile";
  } finally {
    isLoading.value = false;
  }
};

// Validate password change
const validatePasswordChange = () => {
  if (isChangingPassword.value) {
    if (!formData.value.currentPassword) {
      errorMessage.value = "Current password is required";
      return false;
    }
    if (formData.value.newPassword.length < 6) {
      errorMessage.value = "New password must be at least 6 characters";
      return false;
    }
    if (formData.value.newPassword !== formData.value.confirmPassword) {
      errorMessage.value = "Passwords do not match";
      return false;
    }
  }
  return true;
};

// Start password change
const startPasswordChange = () => {
  isChangingPassword.value = true;
  errorMessage.value = "";
};

// Cancel password change
const cancelPasswordChange = () => {
  isChangingPassword.value = false;
  formData.value.currentPassword = "";
  formData.value.newPassword = "";
  formData.value.confirmPassword = "";
  errorMessage.value = "";
};

// Handle form submission
const handleSubmit = () => {
  if (isChangingPassword.value) {
    if (validatePasswordChange()) {
      updateProfile();
    }
  } else {
    updateProfile();
  }
};

// Navigation
const goToOrders = () => {
  router.push("/orders");
};

const goToFavorites = () => {
  router.push("/favorites");
};

const goToAddresses = () => {
  // Future feature
  alert("Address management coming soon!");
};

const goToPaymentMethods = () => {
  // Future feature
  alert("Payment methods coming soon!");
};

// Load data
onMounted(async () => {
  try {
    await Promise.all([
      authStore.fetchUser(),
      orderStore.fetchOrders(),
      favoriteStore.fetchFavorites(),
    ]);
    initializeFormData();
  } catch (error) {
    console.error("Failed to load profile data:", error);
  }
});
</script>

<template>
  <div class="bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p class="text-gray-600">Manage your account settings and preferences</p>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm text-gray-500">Member since</p>
              <p class="font-medium text-gray-900">{{ userStats.memberSince }}</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <span class="text-white text-xl font-bold">
                {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-50 border-b border-green-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-green-800 font-medium">{{ successMessage }}</p>
          </div>
          <button
            @click="successMessage = ''"
            class="text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <!-- User Info -->
              <div class="text-center mb-6">
                <div class="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-white text-2xl font-bold">
                    {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">{{ user?.name }}</h3>
                <p class="text-gray-600">{{ user?.email }}</p>
                <span class="inline-flex items-center px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full mt-2">
                  {{ user?.role === 'admin' ? 'Admin' : 'Customer' }}
                </span>
              </div>

              <!-- Quick Stats -->
              <div class="space-y-4 border-t border-gray-100 pt-6">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Total Orders</span>
                  <span class="font-semibold text-gray-900">{{ userStats.totalOrders }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Total Spent</span>
                  <span class="font-semibold text-gray-900">{{ formatPrice(userStats.totalSpent) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Favorites</span>
                  <span class="font-semibold text-gray-900">{{ userStats.favoriteItems }}</span>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="space-y-2 border-t border-gray-100 pt-6 mt-6">
                <button
                  @click="goToOrders"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent rounded-lg transition-colors duration-200"
                >
                  📦 View Orders
                </button>
                <button
                  @click="goToFavorites"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent rounded-lg transition-colors duration-200"
                >
                  ❤️ Favorites
                </button>
                <button
                  @click="goToAddresses"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent rounded-lg transition-colors duration-200"
                >
                  📍 Addresses
                </button>
                <button
                  @click="goToPaymentMethods"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent rounded-lg transition-colors duration-200"
                >
                  💳 Payment Methods
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Profile Information -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  v-if="!isEditing"
                  @click="startEditing"
                  class="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 font-medium"
                >
                  Edit Profile
                </button>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {{ errorMessage }}
              </div>

              <!-- View Mode -->
              <div v-if="!isEditing" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <p class="text-gray-900">{{ user?.name || 'Not set' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <p class="text-gray-900">{{ user?.email || 'Not set' }}</p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <span class="inline-flex items-center px-3 py-1 bg-accent-100 text-accent-700 text-sm font-medium rounded-full">
                    {{ user?.role === 'admin' ? 'Administrator' : 'Customer' }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <p class="text-gray-900">{{ userStats.memberSince }}</p>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-else class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      v-model="formData.email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <!-- Password Change Section -->
                <div class="border-t border-gray-100 pt-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Change Password</h3>
                    <button
                      v-if="!isChangingPassword"
                      @click="startPasswordChange"
                      class="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors duration-200"
                    >
                      Change Password
                    </button>
                  </div>

                  <div v-if="isChangingPassword" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        v-model="formData.currentPassword"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          v-model="formData.newPassword"
                          type="password"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          v-model="formData.confirmPassword"
                          type="password"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <button
                      @click="cancelPasswordChange"
                      class="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
                    >
                      Cancel Password Change
                    </button>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                  <button
                    @click="cancelEditing"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    @click="handleSubmit"
                    :disabled="isLoading"
                    class="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <button
                  @click="goToOrders"
                  class="text-accent-600 hover:text-accent-700 font-medium transition-colors duration-200"
                >
                  View All
                </button>
              </div>

              <div v-if="orderStore.orders.length === 0" class="text-center py-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p class="text-gray-600 mb-4">You haven't placed any orders yet</p>
                <NuxtLink
                  to="/shop"
                  class="inline-flex items-center px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
                >
                  Start Shopping
                </NuxtLink>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="order in orderStore.orders.slice(0, 3)"
                  :key="order.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">Order #{{ order.id }}</p>
                    <p class="text-sm text-gray-600">{{ formatDate(order.created_at || '') }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">{{ formatPrice(order.total_price) }}</p>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
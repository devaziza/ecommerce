<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Admin Sidebar -->
    <aside
      class="w-64 bg-white shadow-md border-r border-gray-200 flex-shrink-0"
    >
      <div class="p-6">
        <!-- Logo -->
        <div class="flex items-center space-x-3 mb-8">
          <div
            class="w-10 h-10 bg-gradient-to-br from-accent-600 to-accent-700 rounded-lg flex items-center justify-center"
          >
            <span class="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p class="text-sm text-gray-500">E-commerce Management</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <NuxtLink
            to="/admin"
            class="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors duration-200 group"
            :class="{ 'bg-accent/10 text-accent': $route.path === '/admin' }"
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
                d="M3 12l2-2m0 0l7-7 7 7m5-5v6a2 2 0 002 2h-2a2 2 0 01-2-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2v-6l-2-2m0 0l7-7 7 7"
              ></path>
            </svg>
            <span class="font-medium">Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/products"
            class="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors duration-200 group"
            :class="{
              'bg-accent/10 text-accent':
                $route.path.startsWith('/admin/products'),
            }"
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
                d="M20 7l-8-4-8 4M5 7h14l-1 12H4L5 9z"
              ></path>
            </svg>
            <span class="font-medium">Products</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors duration-200 group"
            :class="{
              'bg-accent/10 text-accent':
                $route.path.startsWith('/admin/orders'),
            }"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            <span class="font-medium">Orders</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/users"
            class="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors duration-200 group"
            :class="{
              'bg-accent/10 text-accent':
                $route.path.startsWith('/admin/users'),
            }"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h2a6 6 0 016 6v1zm0 0h-1v-1h1v1z"
              ></path>
            </svg>
            <span class="font-medium">Users</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/categories"
            class="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors duration-200 group"
            :class="{
              'bg-accent/10 text-accent':
                $route.path.startsWith('/admin/categories'),
            }"
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <span class="font-medium">Categories</span>
          </NuxtLink>
        </nav>

        <!-- User Info -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <span class="text-gray-600 font-medium">{{
                user?.name?.charAt(0)?.toUpperCase() || "A"
              }}</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- Logout Button -->
        <div class="mt-6">
  <UiBaseButton @click="handleLogout">
    Save
  </UiBaseButton>

          <!-- <button
            @click="handleLogout"
            class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
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
                d="M17 16l4-4m0 0l-4 4m4-4H7m6 4v1a3 3 0 01-3 3H4a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1z"
              ></path>
            </svg>
            <span>Logout</span>
          </button> -->
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="">
        <AdminNavbar />
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "~/stores/useAuth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

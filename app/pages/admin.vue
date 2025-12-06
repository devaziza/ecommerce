<script setup lang="ts">
import { useAuthStore } from "@/stores/useAuth";

const store = useAuthStore();

const handleLogout = async () => {
  await store.logout();
  return navigateTo("/login");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <AdminNavbar />
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-6 space-y-4">
      <h1 class="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav class="space-y-2">
        <NuxtLink to="/admin" class="block py-2 px-3 rounded hover:bg-gray-200">📊 Dashboard</NuxtLink>
        <NuxtLink to="/admin/products" class="block py-2 px-3 rounded hover:bg-gray-200">🛍 Products</NuxtLink>
        <NuxtLink to="/admin/orders" class="block py-2 px-3 rounded hover:bg-gray-200">📦 Orders</NuxtLink>
        <NuxtLink to="/admin/users" class="block py-2 px-3 rounded hover:bg-gray-200">👥 Users</NuxtLink>
      </nav>

      <button
        @click="handleLogout"
        class="mt-10 bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>



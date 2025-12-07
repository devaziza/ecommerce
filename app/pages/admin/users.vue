<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/useAuth";
import type { User } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "admin",
});

const authStore = useAuthStore();
const isLoading = ref(false);
const error = ref<string | null>(null);

// Mock users data (in real app, this would come from backend)
const users = ref<User[]>([
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    created_at: "2024-01-20T14:22:00Z",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    created_at: "2024-01-10T09:15:00Z",
  },
]);

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getRoleColor = (role: string) => {
  return role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
};

const getRoleIcon = (role: string) => {
  return role === "admin" ? "👑" : "👤";
};

// Load users
onMounted(() => {
  // In a real app, you would fetch users from backend
  // await userStore.fetchUsers();
});
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Users Management</h1>
      <p class="text-gray-600">{{ users.length }} total users</p>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span class="text-gray-600 font-medium">{{ user.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getRoleColor(user.role)"
                >
                  {{ getRoleIcon(user.role) }} {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(user.created_at || '') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="text-accent-600 hover:text-accent-700 font-medium">Edit</button>
                <button class="text-red-600 hover:text-red-700 font-medium ml-2">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
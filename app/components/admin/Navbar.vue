<template>
  <header
    class="w-full h-16 px-6 flex items-center justify-between bg-white border-b border-gray-200"
  >
    <!-- LEFT SIDE -->
    <div class="flex items-center gap-4">
      <h1 class="text-xl font-semibold text-gray-800">
        {{ pageTitle }}
      </h1>
    </div>

    <UiBaseButton>Add to cart</UiBaseButton>
    <!-- RIGHT SIDE -->
    <div class="flex items-center gap-6">
      <!-- Notifications -->
      <button class="relative text-gray-600 hover:text-gray-900 transition">
        🔔
        <span
          class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
        ></span>
      </button>

      <!-- User Info -->
      <div class="flex items-center gap-3 cursor-pointer">
        <!-- Avatar -->
        <div
          class="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium"
        >
          {{ user?.name?.charAt(0) || "A" }}
        </div>

        <!-- Name -->
        <div class="hidden md:flex flex-col text-sm">
          <span class="font-medium text-gray-800">
            {{ user?.name || "Admin" }}
          </span>
          <span class="text-gray-500 text-xs"> Administrator </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/useAuth";

const route = useRoute();
const store = useAuthStore();

const pageTitle = computed(() => {
  return route.name
    ? route.name.toString().replace("admin-", "").toUpperCase()
    : "ADMIN";
});

const user = store.getUser;
</script>

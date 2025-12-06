<template>
  <aside class="w-64 bg-white shadow-lg flex flex-col">
    <div class="p-4 font-bold text-lg border-b">🛍️ Admin Panel</div>

    <nav class="flex-1 p-4 space-y-2">
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="block px-4 py-2 rounded hover:bg-green-100"
        :class="{ 'bg-green-600 text-white': route.path === link.path }"
      >
        {{ link.name }}
      </NuxtLink>
    </nav>

    <div class="p-4 border-t">
      <button
        class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/useAuth"

const route = useRoute()
const router = useRouter()
const store = useAuthStore()

const links = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Products", path: "/admin/products" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Users", path: "/admin/users" },
]

const logout = async () => {
  await store.logout()
  router.push("/login")
}
</script>

<!-- 💬 COMMENT:
Sidebar’da sahifalar ro‘yxati bor.
Keyinchalik linklar sonini oshirish mumkin (settings, stats, categories va h.k.). -->

<template>
  <header >
   
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "@/stores/useAuth"

const route = useRoute()
const store = useAuthStore()

const pageTitle = computed(() => {
  return route.name ? route.name.toString().replace("admin-", "").toUpperCase() : "ADMIN"
})

const user = store.getUser
</script>

<!-- 💬 COMMENT:
Bu header har bir admin sahifada ko‘rinadi.
Avatar o‘rniga keyinchalik profil rasmi yoki dropdown menyu qo‘shish mumkin. -->

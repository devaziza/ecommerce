<template>
  <div class="min-h-screen">
    <Navbar />
    <main class="pt-16">
      <slot />
    </main>
    <FooterPage />
  </div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
import FooterPage from "~/components/FooterPage.vue";
</script>

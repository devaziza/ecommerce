<script>
import Navbar from "~/components/Navbar.vue";
import Sidebar from "~/components/Sidebar.vue";
import FooterPage from "~/components/FooterPage.vue";
</script>
<template>
  <div class="min-h-screen">
    <Navbar />
    <Sidebar />
    <main class="pt-16">
      <slot />
    </main>
    <FooterPage />
  </div>
</template>

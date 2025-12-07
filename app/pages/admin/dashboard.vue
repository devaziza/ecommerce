<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="font-bold text-xl mb-2">Total Sales</h2>
      <p class="text-3xl font-semibold">$15,230</p>
    </div>

    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="font-bold text-xl mb-2">Orders</h2>
      <p class="text-3xl font-semibold">320</p>
    </div>

    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="font-bold text-xl mb-2">Users</h2>
      <p class="text-3xl font-semibold">89</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth-role",
  layout: "admin",
});
</script>

<!-- 💬 COMMENT:
Dashboard — statistik kartochkalar.
Keyinchalik chart.js yoki Recharts bilan grafik qo‘shish mumkin. -->

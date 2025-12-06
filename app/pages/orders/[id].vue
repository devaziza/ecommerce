<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useOrderStore } from "~/stores/useOrders";

const route = useRoute();
const id = Number(route.params.id);
const orderStore = useOrderStore();

onMounted(async () => {
  if (id) {
    await orderStore.fetchOrderDetail(id);
  } else {
    console.error("Order ID topilmadi!");
  }
});
</script>

<template>
  <div class="p-6">
    <div v-if="orderStore.loading">⏳ Yuklanmoqda...</div>
    <div v-if="orderStore.error" class="text-red-500">{{ orderStore.error }}</div>

    <div v-if="orderStore.orderDetail">
      <h1 class="text-2xl font-bold mb-4">
        Order #{{ orderStore.orderDetail.id }}
      </h1>
      <p><strong>Status:</strong> {{ orderStore.orderDetail.status }}</p>
      <p><strong>Total:</strong> ${{ orderStore.orderDetail.total_price }}</p>

      <h2 class="text-xl mt-4 font-semibold">Items:</h2>
      <ul class="list-disc ml-6 mt-2">
        <li v-for="item in orderStore.orderDetail.items" :key="item.id">
          {{ item.product_name }} — {{ item.quantity }} × ${{ item.price }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from "@/stores/useOrders";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const orderStore = useOrderStore();
const { orders, fetchOrders, loading, error } = orderStore;
const router = useRouter();

// Sahifa ochilganda buyurtmalarni yuklash
onMounted(() => {
  fetchOrders();
});

// Har bir buyurtma ustiga bosilganda tafsilot sahifasiga o‘tish
function goToDetail(id: number) {
  router.push(`/orders/${id}`);
}
function statusColor(status: string) {
  return {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  }[status];
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleString() : "-";
}
</script>


<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🧾 My Orders</h1>

    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

    <div v-if="loading">⏳ Loading orders...</div>

    <div v-else class="grid gap-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer"
        @click="goToDetail(order.id)"
      >
        <div class="flex justify-between">
          <p><strong>Order #{{ order.id }}</strong></p>
          <span
            class="px-2 py-1 rounded text-white text-sm"
            :class="statusColor(order.status)"
          >
            {{ order.status }}
          </span>
        </div>

        <p class="text-gray-500 text-sm">
          {{ formatDate(order.created_at) }}
        </p>

        <p class="mt-2">💰 Total: <strong>${{ order.total_price }}</strong></p>
      </div>
    </div>
  </div>
</template>

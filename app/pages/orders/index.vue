<script setup lang="ts">
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/useOrders";
import { useRouter } from "vue-router";

const router = useRouter();
const orderStore = useOrderStore();

onMounted(async () => {
  await orderStore.fetchOrders();
});

function goToOrderDetail(id: number) {
  router.push(`/orders/${id}`);
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">📦 Buyurtmalar ro‘yxati</h1>

    <div v-if="orderStore.loading">⏳ Yuklanmoqda...</div>
    <div v-if="orderStore.error" class="text-red-500">
      {{ orderStore.error }}
    </div>

    <table
      v-if="orderStore.orders.length"
      class="w-full border border-gray-300 rounded-lg shadow-md text-sm"
    >
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Foydalanuvchi</th>
          <th class="border p-2">Holati</th>
          <th class="border p-2">Jami narx</th>
          <th class="border p-2">Sana</th>
          <th class="border p-2">Harakat</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orderStore.orders"
          :key="order.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="border p-2">{{ order.id }}</td>
          <td class="border p-2">
            {{ order.user_id ? `User #${order.user_id}` : "-" }}
          </td>
          <td class="border p-2 capitalize">{{ order.status }}</td>
          <td class="border p-2">${{ order.total_price }}</td>
          <td class="border p-2">
            {{
              order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "-"
            }}
          </td>
          <td class="border p-2 text-center">
            <button
              class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              @click="goToOrderDetail(order.id)"
            >
              Ko‘rish
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="text-gray-500 mt-4">Hech qanday buyurtma topilmadi.</p>
  </div>
</template>

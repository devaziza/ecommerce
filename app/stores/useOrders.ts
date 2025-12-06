import { defineStore } from "pinia";
import { ref } from "vue";
import type { Order, OrderDetail } from "~/types/models";
import { useCartStore } from "./useCart";
import { useRuntimeConfig } from "#app";

export const useOrderStore = defineStore("orders", () => {
    const apiBase = useRuntimeConfig().public.apiBase;
  
  // 🔹 State (holat)
  const orders = ref<Order[]>([]);
  const orderDetail = ref<OrderDetail | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ======================
  // 🔹 1️⃣ Barcha orderlarni olish
  // ======================
  async function fetchOrders() {
    try {
      const token = useCookie("token").value;
      loading.value = true;
      error.value = null;
      const data = await $fetch<Order[]>(`${apiBase}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      orders.value = data;
    } catch (err: any) {
      error.value = err.statusMessage || "Failed to load orders.";
    } finally {
      loading.value = false;
    }
  }

  // ======================
  // 🔹 2️⃣ Bitta order tafsilotini olish
  // ======================
  async function fetchOrderDetail(id: number) {
    try {
      const token = useCookie("token").value;
      loading.value = true;
      error.value = null;
      const data = await $fetch<OrderDetail>(`${apiBase}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      orderDetail.value = { ...data };
    } catch (err: any) {
      error.value = err.statusMessage || "Failed to load order details.";
    } finally {
      loading.value = false;
    }
  }

  // ======================
  // 🔹 3️⃣ Yangi order yaratish (checkout)
  // ======================
  async function createOrder() {
  try {
    const token = useCookie("token").value;
    const cartStore = useCartStore();
    console.log("Creating order with cart items:", cartStore);
    loading.value = true;
    error.value = null;
    if (!cartStore.cartItems.length) {
      throw new Error("Savatcha bo‘sh");
    }

    const data = await $fetch(`${apiBase}/api/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        items: cartStore.cartItems.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
      },
    });

    cartStore.clearCart();
    return data;
  } catch (err: any) {
    console.error("❌ Order yaratishda xato:", err);
  } finally {
      loading.value = false;
    }
  }

  // ======================
  // 🔹 4️⃣ Admin — order statusini yangilash
  // ======================
  async function updateOrderStatus(id: number, status: Order["status"]) {
    try {
      loading.value = true;
      error.value = null;
      const updated = await $fetch<Order>(`${apiBase}/api/orders/${id}/status`, {
        method: "PUT",
        body: { status },
      });

      // Local state-ni yangilaymiz
      const index = orders.value.findIndex((ord) => ord.id === id);
      if (index !== -1) {
        orders.value[index] = updated;
        console.log("-----", updated);
      }

      // Agar tafsilot oynasi ochiq bo‘lsa, uni ham yangilaymiz
      if (orderDetail.value && orderDetail.value.id === id) {
        orderDetail.value.status = updated.status;
      }
    } catch (err: any) {
      error.value = err.statusMessage || "Error while updating order status.";
    } finally {
      loading.value = false;
    }
  }

  return {
    orders,
    orderDetail,
    loading,
    error,

    fetchOrders,
    fetchOrderDetail,
    createOrder,
    updateOrderStatus,
  };
});

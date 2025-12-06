import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Product } from "~/types/models";
import { useRuntimeConfig } from "#app";

export const useCartStore = defineStore("cart", () => {
  const apiBase = useRuntimeConfig().public.apiBase;

  const cart = ref<{ product: Product; quantity: number }[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const totalPrice = computed(() =>
    cart.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  async function addToCart(product: Product) {
    try {
      loading.value = true;
      error.value = null;
      const newItem = await $fetch<{
        cartItem: {
          product_id: number;
          quantity: number;
        };
      }>(`${apiBase}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        body: {
          product_id: product.id,
          quantity: 1,
        },
      });
      console.log("Added to cart:", newItem);
      const existing = cart.value.find(
        (item) => item.product.id === product.id
      );
      if (existing) {
        existing.quantity++;
      } else {
        cart.value.push({
          product,
          quantity: 1,
        });
      }
    } catch (err: any) {
      error.value = err?.data?.message || "Failed to add to cart";
    } finally {
      loading.value = false;
    }
  }
  async function removeCart(productId: number) {
    try {
      loading.value = true;
      error.value = null;
      await $fetch(`${apiBase}/api/cart/${productId} `, {
        method: "DELETE",
        credentials: "include",
      });
      cart.value = cart.value.filter((item) => item.product.id !== productId);
      console.log("Removed from cart:", productId);
      console.log("Updated cart:", cart.value);
    } catch (err: any) {
      error.value = err?.data?.message || "Failed to remove from cart";
    } finally {
      loading.value = false;
    }
  }

  async function updateQuantity(cartItemId: number, action: "+" | "-") {
    try {
      loading.value = true;
      error.value = null;
      const updatedItem = await $fetch(`${apiBase}/api/cart/${cartItemId}`, {
        method: "PUT",
        credentials: "include",
        body: { action },
      });

      if (action === "+") {
        increase(cartItemId);
      } else if (action === "-") {
        decrease(cartItemId);
      }
      console.log("Updated cart item:", updatedItem);
    } catch (err: any) {
      error.value = err?.data?.message || "Failed to update cart item";
    } finally {
      loading.value = false;
    }
  }

  async function fetchCart() {
    try {
      const token = useCookie("token").value;
      const data = await $fetch<{
        items: {
          id: number;
          product_id: number;
          name: string;
          price: string | number;
          quantity: number;
          image_url: string;
          description: string;
          category_id: number;
          category: string;
        }[];
      }>(`${apiBase}/api/cart`, {
        credentials: "include",
      });

      cart.value = data.items.map((item) => ({
        product: {
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          price: Number(item.price),
          image: item.image_url,
          category_id: item.category_id,
          description: item.description,
          category: item.category,
        },
        quantity: item.quantity,
      }));
    } catch (err) {
      console.error("Savatchani yuklashda xato:", err);
    }
  }

  // 🔹 Savatchani tozalash
  function clearCart() {
    cart.value = [];
  }

  function increase(productId: number) {
    const item = cart.value.find((i) => i.product.id === productId);
    if (item) item.quantity++;
  }

  // 🔹 Quantity -1
  function decrease(productId: number) {
    const item = cart.value.find((i) => i.product.id === productId);
    if (!item) return;

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart.value = cart.value.filter((i) => i.product.id !== productId);
    }
  }

  return {
    cart,
    totalPrice,
    loading,
    error,

    increase,
    decrease,
    addToCart,
    removeCart,
    clearCart,
    fetchCart,
    updateQuantity,
  };
});

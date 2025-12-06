import { defineStore } from "pinia";
import { ref } from "vue";
import type { Product } from "~/types/models";
import { useRuntimeConfig } from "#app";

export const useFavoriteStore = defineStore("favorites", () => {
  const apiBase = useRuntimeConfig().public.apiBase;

  const favorites = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchFavorites() {
    try {
      loading.value = true;
      const data = await $fetch<{ favorites: Product[] }>(
        `${apiBase}/api/favorites`,
        {
          credentials: "include",
        } 
      );
      favorites.value = data.favorites || [];
      console.log("Fetched favorites:", favorites.value);
    } catch (err: any) {
      error.value = err?.data?.message || "Failed to load favorites";
    } finally {
      loading.value = false;
    }
  }

  async function addFavorite(productId: number) {
    try {
      await $fetch<Product>(`${apiBase}/api/favorites`, {
        method: "POST",
        credentials: "include",
        body: { product_id: productId },
      });
      console.log("Added favorite with ID:", productId);
    } catch (err: any) {
      error.value = err?.data?.message || "Failed to add favorite";
    }
  }

  // 🔹 Sevimlilardan o‘chirish
  async function removeFavorite(productId: number) {
    try {
      await $fetch<Product>(`${apiBase}/api/favorites/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      console.log("Removed favorite with ID:", productId);
    } catch (err: any) {
      error.value = err?.data?.message || "Failed to remove favorite";
    }
  }

  function isFavorite(productId: number) {
    return favorites.value.some((f) => f.id === productId);
  }

  return {
    favorites,
    loading,
    error,

    isFavorite,
    fetchFavorites,
    addFavorite,
    removeFavorite,
  };
});

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Product } from "~/types/models"; 
import { useRuntimeConfig } from "#app";

export const useProductStore = defineStore("products", () => {
  const apiBase = useRuntimeConfig().public.apiBase;

  // STATE
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // GETTERS
  const getProducts = computed(() => products.value);
  const getLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // ACTIONS
  async function fetchProducts() {
    try {
      loading.value = true;
      const res = await $fetch<Product[]>(`${apiBase}/api/products`, {
        credentials: "include",
      });
      products.value = res;

      console.log(res);
    } catch (err: any) {
      error.value = err.message || "Mahsulotlarni olishda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function createProduct(data: FormData) {
    try {
      loading.value = true;
      const newProduct = await $fetch<Product>(
        `${apiBase}/api/products/create`,
        {
          method: "POST",
          body: data,
        }
      );
      products.value.push(newProduct);
    } catch (err: any) {
      error.value = err.message || "Mahsulot qo‘shishda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(id: number, data: Partial<Product>) {
    try {
      loading.value = true;
      const updated = await $fetch<Product>(`${apiBase}/api/products/${id}`, {
        method: "PUT",
        body: data,
      });
      if (!updated) throw new Error("Yangilandi");

      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = updated;
      }
    } catch (err: any) {
      error.value = err.message || "Yangilashda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id: number) {
    try {
      loading.value = true;
      await $fetch(`${apiBase}/api/products/delete?id=${id}`, {
        method: "DELETE",
      });
      products.value = products.value.filter((p) => p.id !== id);
    } catch (err: any) {
      error.value = err.message || "O‘chirishda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function ProductsByCategory(categoryId: number) {
    try {
      loading.value = true;
      const res = await $fetch<Product[]>(
        `${apiBase}/api/products/by-category/${categoryId}`,
        {
          credentials: "include",
        }
      );
      products.value = res;
    } catch (err: any) {
      error.value = err.message || "Mahsulotlarni olishda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function searchProducts(searchText: string) {
    try {
      loading.value = true;

      const res = await $fetch<Product[]>(`${apiBase}/api/products?search=${searchText}`, {
        query: { search: searchText },
        credentials: "include",
      });

      products.value = res;
    } catch (err: any) {
      error.value = err.message || "Error while searching!";
    } finally {
      loading.value = false;
    }
  }

  async function fetchProductById(id: number): Promise<Product | null> {
    try {
      loading.value = true;
      error.value = null;
      const product = await $fetch<Product>(`${apiBase}/api/products/${id}`, {
        credentials: "include",
      });
      return product;
    } catch (err: any) {
      error.value = err.message || "Product not found";
      return null;
    } finally {
      loading.value = false;
    }
  }

  function isNewProduct(created_at?: string | null) {
    if (!created_at) return false;

    const days = 2;
    const diff =
      (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24);

    return diff <= days;
  }

  const latestProducts = computed(() =>
    [...products.value].reverse().slice(0, 8)
  );

  return {
    products,
    loading,
    error,

    getProducts,
    getLoading,
    getError,
    latestProducts,

    isNewProduct,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    ProductsByCategory,
    searchProducts,
  };
});

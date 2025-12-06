import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Category } from "@/types/models";
import { useRuntimeConfig } from "#app";

export const useCategoryStore = defineStore("categories", () => {
  const apiBase = useRuntimeConfig().public.apiBase;

  // STATE
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // GETTERS
  const getCategories = computed(() => categories.value);
  const getLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // ACTIONS
  async function fetchCategories() {
    try {
      loading.value = true;
      const res = await $fetch<Category[]>(`${apiBase}/api/categories`, {
        credentials: "include",
      });
      categories.value = res;
    } catch (err: any) {
      error.value = err.message || "Mahsulotlarni olishda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function createCategory(data: Omit<Category, "id">) {
    try {
      loading.value = true;
      const newCategory = await $fetch<Category>(
        `${apiBase}/api/categories`,
        {
          method: "POST",
          body: data,
        }
      );

      categories.value.push(newCategory);
    } catch (err: any) {
      error.value = err.message || "Mahsulot qo‘shishda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function updateCategory(id: number, data: Partial<Category>) {
    try {
      loading.value = true;
      const updated = await $fetch<Category>(
        `${apiBase}/api/categories/${id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      if (!updated) throw new Error("Yangilandi");

      const index = categories.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        categories.value[index] = updated;
      }
    } catch (err: any) {
      error.value = err.message || "Yangilashda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  async function deleteCategory(id: number) {
    try {
      loading.value = true;
      await $fetch(`${apiBase}/api/products/delete?id=${id}`, {
        method: "DELETE",
      });
      categories.value = categories.value.filter((p) => p.id !== id);
    } catch (err: any) {
      error.value = err.message || "O‘chirishda xatolik!";
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    loading,
    error,

    getCategories,
    getLoading,
    getError,

    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
});

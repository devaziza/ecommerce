import { defineStore } from "pinia";
import { ref } from "vue";
import { useRuntimeConfig } from "#app";

export const useProfileStore = defineStore("profile", () => {
  const apiBase = useRuntimeConfig().public.apiBase;

  // State
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function updateProfile(updateData: {
    name?: string;
    email?: string;
    password?: string;
  }) {
    try {
      loading.value = true;
      error.value = null;

      const data = await $fetch<{ user: any; message: string }>(
        `${apiBase}/api/users/me`,
        {
          method: "PUT",
          credentials: "include",
          body: updateData,
        }
      );

      return data;
    } catch (err: any) {
      error.value = err.data?.statusMessage || "Failed to update profile";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    updateProfile,
  };
});
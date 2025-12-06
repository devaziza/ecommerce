import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  User,
  RegisterBody,
  LoginBody,
  AuthResponse,
} from "~/types/models";
import { useRuntimeConfig } from "#app";

export const useAuthStore = defineStore("auth", () => {
  const apiBase = useRuntimeConfig().public.apiBase;

  // State
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => user.value !== null);
  const getUser = computed(() => user.value);
  const getUserRole = computed(() => user.value?.role);
  const getLoading = computed(() => loading.value);
  const getError = computed(() => error.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  // Actions
  async function registerUser(userData: RegisterBody) {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<AuthResponse>(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userData,
        credentials: "include", // cookie will be set
      });

      user.value = res.user;
      return res.user;
    } catch (err: any) {
      error.value = err?.data?.message || "Registration failed";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loginUser(userData: LoginBody) {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<AuthResponse>(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userData,
        credentials: "include", 
      });

      user.value = res.user;
      console.log("Logged in user:", user.value?.role); 
      return res.user;
    } catch (err: any) {
      error.value = err?.data?.message || "Login failed";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() { 
    loading.value = true;
    try {
      const res = await $fetch<{ user: User }>(`${apiBase}/api/users/me`, {
        method: "GET",
        credentials: "include",   
      });
      user.value = res.user;
    } catch (err) {
      user.value = null; 
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
  try {
    await $fetch<User>(`${apiBase}/api/auth/logout`, {
      method: "POST",
      credentials: "include", 
    });
    user.value = null;
  } catch (err) {
    console.error("Logout error:", err);
  }
}
  return {
    user,
    loading,
    error,
    isAuthenticated,
    getUser,
    getLoading,
    getUserRole,
    getError,
    isAdmin,

    registerUser,
    loginUser,
    fetchUser,
    logout,
  };
});

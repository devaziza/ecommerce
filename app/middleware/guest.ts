import { useAuthStore } from "~/stores/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  const store = useAuthStore();

  // Fetch user if not available
  if (!store.user) {
    await store.fetchUser();
  }

  const user = store.user;

  // Redirect unauthenticated users to login
  if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Allow admin access to admin pages
  if (user && user.role === "admin" && to.path.startsWith("/admin")) {
    return;
  }

  // Redirect non-admin users from admin pages
  if (user && user.role !== "admin" && to.path.startsWith("/admin")) {
    return navigateTo("/");
  }

  // Allow authenticated users to access other pages
  return;
});

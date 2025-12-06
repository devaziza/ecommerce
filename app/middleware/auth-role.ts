import { useAuthStore } from "~/stores/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAuthStore();

  // Agar foydalanuvchi hali fetch qilinmagan bo‘lsa (refresh holati)
  if (!store.user) {
    await store.fetchUser();
  }

  const user = store.user;

  // Agar login qilmagan bo‘lsa va sahifa login bo‘lmasa → login sahifasiga yo‘naltirish
  if (!user && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Agar foydalanuvchi login bo‘lsa va login sahifaga kirsa → roliga qarab yo‘naltirish
  if (user && to.path === "/login") {
    if (user.role === "admin") return navigateTo("/admin");
    else return navigateTo("/");
  }

  // Agar admin bo‘lsa → /admin sahifalarga ruxsat beriladi
  if (user?.role === "admin") {
    // hech narsa qilmaymiz, admin har sahifaga kira oladi
    return;
  }

  // Agar admin bo‘lmagan foydalanuvchi /admin sahifaga kirsa → / ga yo‘naltirish
  if (store.user?.role !== "admin" && to.path.startsWith("/admin")) {
    return navigateTo("/");
  }

  // Aks holda → foydalanuvchi sahifada qoladi
});

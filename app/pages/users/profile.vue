<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/useAuth";
import { useRouter } from "vue-router";

const userStore = useAuthStore();
const router = useRouter();

// Inputlar uchun reactive state
const name = ref("");
const email = ref("");
const password = ref("");

onMounted(async () => {
  await userStore.fetchUser();
  if (userStore.user) {
    name.value = userStore.user.name || "";
    email.value = userStore.user.email || "";
  }
});

// Profile update funksiyasi
// async function updateProfile() {
//   try {
//     const updatedUser = await userStore.updateUser({
//       name: name.value,
//       email: email.value,
//       password: password.value || undefined, // agar bo‘sh bo‘lsa yubormaydi
//     });

//     if (updatedUser) {
//       alert("✅ Profile muvaffaqiyatli yangilandi!");
//       password.value = ""; // password inputini tozalash

//       // Yangilanishdan keyin profile sahifaga yo‘naltirish
//       router.push("/users/profile");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("❌ Profile yangilashda xatolik yuz berdi");
//   }
// }
</script>

<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">👤 Profile</h1>

    <div class="flex flex-col gap-3">
      <input
        v-model="name"
        placeholder="Name"
        class="border p-2 rounded"
      />
      <input
        v-model="email"
        placeholder="Email"
        class="border p-2 rounded"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 rounded"
      />

      <!-- <button
        @click="updateProfile"
        class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Update Profile
      </button> -->
    </div>
  </div>
</template>

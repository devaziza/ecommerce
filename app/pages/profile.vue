<!-- <script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const email = ref("");
const password = ref("");

async function updateProfile() {
  try {
    const res = await $fetch("/api/users/profile", {
      method: "PUT",
      body: { name: name.value, email: email.value, password: password.value },
    });
    alert(res.message);
  } catch (err: any) {
    alert(err.statusMessage || "Update failed");
  }
}
</script>

<template>
  <div>
    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="updateProfile">Update Profile</button>
  </div>
</template> -->

<template>Aziza</template>
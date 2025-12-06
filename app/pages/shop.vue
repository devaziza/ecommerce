<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Sidebar from "~/components/Sidebar.vue";
import StoreItem from "~/components/StoreItem.vue";
import ErrorMessage from "~/components/ErrorMessage.vue";
import { ref } from "vue";

// ✅ Filterlangan productlar uchun
const products = ref([
  { name: "Nike Air Max", price: 200, image: "/images/nike.png" },
  { name: "Adidas Ultraboost", price: 180, image: "/images/adidas.png" },
]);

const activeCategory = ref("All");

// Filter logikasi uchun function
function onCategoryChange() {
  console.log("Selected category:", activeCategory.value);
  // TODO: bu yerga API call yoki filter logic qo'yasan
}
// ✅ Error handling
const hasError = ref(false);
const errorMessage = ref("Unable to load shop data.");

// ✅ Bu joyda sen filter logikasini yoki API call’ni yozasan
// onMounted(async () => {
//   try {
//     const { data } = await useFetch(`/api/shop?category=${activeCategory.value}`)
//     products.value = data.value
//   } catch (e) {
//     hasError.value = true
//   }
// })
</script>

<template>
  <div class="relative min-h-screen bg-gray-50">
    <Navbar />
    <Sidebar />

    <main class="px-4 md:px-10 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Shop</h1>

        <!-- ✅ Filter dropdown (sen real filter logikasini bu yerda yozasan) -->
        <select
          v-model="activeCategory"
          class="border rounded px-3 py-2"
          @change="onCategoryChange"
        >
          <option value="All">All</option>
          <option value="Shoes">Shoes</option>
          <option value="Clothes">Clothes</option>
          <option value="Electronics">Electronics</option>
        </select>
      </div>

      <ErrorMessage v-if="hasError" :message="errorMessage" />

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <StoreItem
          v-for="(product, i) in products"
          :key="i"
          :name="product.name"
          :price="product.price"
          :image="product.image"
        />
      </div>
    </main>
  </div>
</template>

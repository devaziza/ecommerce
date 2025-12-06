<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProductStore } from "@/stores/useProducts";
import type { Product } from "~/types/models";

const newProduct = ref<Omit<Product, "id">>({
  name: "",
  price: 0,
  description: "",
  category: "",
  image: "",
});

const productStore = useProductStore();
const showForm = ref(false);
const editingProduct = ref<Product | null>(null);

onMounted(() => {
  productStore.fetchProducts();
});

const addProduct = async () => {
  await productStore.createProduct(newProduct.value);
  resetForm();
};

const updateProduct = async (id: number) => {
  await productStore.updateProduct(id, newProduct.value);
  resetForm();
};

const deleteProduct = async (id: number) => {
  await productStore.deleteProduct(id);
};

const startEdit = (p: Product) => {
  showForm.value = true;
  editingProduct.value = p;
  newProduct.value = { ...p };
};

const resetForm = () => {
  newProduct.value = {
    name: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    created_at: "",
  };
  editingProduct.value = null;
  showForm.value = false;
  productStore.fetchProducts();
};
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">🛠 Product Management</h1>
        <p class="text-gray-500">Add, edit or delete products easily</p>
      </div>
      <button
        @click="showForm = !showForm"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        {{ showForm ? "Close Form" : "Add Product" }}
      </button>
    </div>

    <div
      v-if="showForm"
      class="bg-white shadow-md rounded-lg p-6 mb-10 border border-gray-200"
    >
      <h2 class="text-xl font-semibold mb-4">
        {{ editingProduct ? "✏️ Edit Product" : "➕ Add New Product" }}
      </h2>

      <form
        @submit.prevent="
          editingProduct ? updateProduct(editingProduct.id) : addProduct()
        "
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input
            v-model="newProduct.name"
            type="text"
            placeholder="Product name"
            class="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Price</label>
          <input
            v-model.number="newProduct.price"
            type="number"
            placeholder="Product price"
            class="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select
            v-model="newProduct.category"
            class="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option disabled value="">Select category</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Home & Garden</option>
            <option>Sports</option>
            <option>Books</option>
            <option>Food</option>
            <option>Beauty</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Image URL</label>
          <input
            v-model="newProduct.image"
            type="text"
            placeholder="https://example.com/image.jpg"
            class="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="newProduct.description"
            placeholder="Product description"
            class="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          ></textarea>
        </div>

        <div class="md:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            @click="resetForm"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            {{ editingProduct ? "Update" : "Add" }}
          </button>
        </div>
      </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="p in productStore.getProducts"
        :key="p.id"
        class="bg-white shadow-md border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition"
      >
        <img
          v-if="p.image"
          :src="p.image"
          alt="Product image"
          class="w-full h-40 object-cover rounded-md mb-3"
        />
        <div
          v-else
          class="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md mb-3 text-gray-400"
        >
          No image
        </div>

        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ p.name }}</h2>
          <p class="text-sm text-gray-500 italic">
            {{ p.category || "No category" }}
          </p>
          <p class="text-gray-600 mt-1">
            {{ p.description || "No description" }}
          </p>
          <p class="text-indigo-600 font-bold mt-2">{{ p.price }} so‘m</p>
        </div>

        <div class="flex justify-end gap-3 mt-5">
          <button
            @click="startEdit(p)"
            class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow-sm"
          >
            Edit
          </button>
          <button
            @click="deleteProduct(p.id)"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

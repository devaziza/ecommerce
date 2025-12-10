<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "~/stores/useProducts";
import { useCategoryStore } from "~/stores/useCategory";
import { useAuthStore } from "~/stores/useAuth";
import type { Product, Category } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "admin",
});

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const selectedCategory = ref("all");
const sortBy = ref("newest");
const showCreateModal = ref(false);
const editingProduct = ref<Product | null>(null);
const deleteConfirmId = ref<number | null>(null);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
    imagePreview.value = URL.createObjectURL(target.files[0]);
  }
};

// Form data
const formData = ref({
  name: "",
  description: "",
  price: 0,
  category_id: "",
  stock: 0,
});

// Computed properties
const products = computed(() => productStore.products);
const categories = computed(() => categoryStore.categories);

const filteredProducts = computed(() => {
  let filtered = products.value;

  const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files[0]) {
      imageFile.value = target.files[0];
      imagePreview.value = URL.createObjectURL(target.files[0]);
    }
  };

  // Filter by category
  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (product) => product.category_id === parseInt(selectedCategory.value)
    );
  }

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  // Sort products
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
        );
      case "oldest":
        return (
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
        );
      default:
        return 0;
    }
  });
});

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
];

// Utility functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category?.name || "Unknown";
};

// Modal functions
const openCreateModal = () => {
  editingProduct.value = null;
  formData.value = {
    name: "",
    description: "",
    price: 0,
    category_id: "",
    stock: 0,
  };
  showCreateModal.value = true;
};

const openEditModal = (product: Product) => {
  editingProduct.value = product;
  formData.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category_id: product.category_id.toString(),
    stock: product.stock,
  };
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingProduct.value = null;
  error.value = null;
};

const confirmDelete = (productId: number) => {
  deleteConfirmId.value = productId;
};

const cancelDelete = () => {
  deleteConfirmId.value = null;
};

// CRUD operations
const handleSave = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const fd = new FormData();
    fd.append("name", formData.value.name);
    fd.append("description", formData.value.description);
    fd.append("price", formData.value.price.toString());
    fd.append("category", formData.value.category_id);
    fd.append("stock", formData.value.stock.toString());

    if (imageFile.value) {
      fd.append("image", imageFile.value); // 👈 req.file
    }
    console.log(fd);
    console.log("----", products);
    await productStore.createProduct(fd);

    closeModal();
    await loadProducts();
  } catch (err: any) {
    error.value = err.message || "Failed to save product";
  } finally {
    isLoading.value = false;
  }
};


const handleDelete = async (productId: number) => {
  try {
    isLoading.value = true;
    await productStore.deleteProduct(productId);
    deleteConfirmId.value = null;
    await loadProducts();
  } catch (err: any) {
    error.value = err.message || "Failed to delete product";
  } finally {
    isLoading.value = false;
  }
};

// Load products
const loadProducts = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    await productStore.fetchProducts();
  } catch (err: any) {
    error.value = err.message || "Failed to load products";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadProducts(), categoryStore.fetchCategories()]);
});
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products Management</h1>
        <p class="text-gray-600">
          {{ filteredProducts.length }} of {{ products.length }} products
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="openCreateModal"
          class="px-4 py-2 shrink-0 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 font-medium"
        >
          Add Product
        </button>

        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />

          <select
            v-model="selectedCategory"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
          >
            <option value="all">All Categories</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id.toString()"
            >
              {{ category.name }}
            </option>
          </select>
          <!-- <div class="relative lg:w-48">
              <select
                v-model="selectedCategory"
                class="block w-full appearance-none px-3 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 hover:ring-pink-500 focus:border-transparent transition-all duration-300"
              >
                <option
                  v-for="option in sortOptions"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.name }}
                </option>
              </select>

               Custom icon 
              <div
                class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div> -->

          <div class="relative lg:w-48">
            <select
              v-model="sortBy"
              class="block w-full appearance-none px-3 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 hover:ring-pink-500 focus:border-transparent transition-all duration-300"
            >
              <option
                v-for="option in sortOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <!-- Custom icon -->
            <div
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4"
        >
          <svg
            class="animate-spin h-8 w-8 text-pink-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p class="text-gray-600">Loading products...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
        >
          <svg
            class="w-8 h-8 text-pink-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Products
        </h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="loadProducts"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div
      v-else
      class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <img
                      v-if="product.image_url"
                      :src="product.image_url"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gray-300 flex items-center justify-center"
                    >
                      <svg
                        class="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M9 16h.01M5 9h14l1 12H4L5 9z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">ID: {{ product.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ getCategoryName(product.category_id) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ formatPrice(product.price) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ product.stock }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Active
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(product.created_at || "") }}
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex space-x-2">
                  <button
                    @click="openEditModal(product)"
                    class="text-accent-600 hover:text-accent-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(product.id)"
                    class="text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-16">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
        >
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4M5 7h14l-7 7 7-7M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p class="text-gray-600 mb-8">
          {{
            searchQuery || selectedCategory !== "all"
              ? "Try adjusting your filters"
              : "No products available"
          }}
        </p>
        <button
          @click="openCreateModal"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Add First Product
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingProduct ? "Edit Product" : "Create New Product" }}
          </h2>
        </div>

        <form @submit.prevent="handleSave" class="p-6 space-y-4">
          <!-- Error Message -->
          <div
            v-if="error"
            class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          >
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Product Name</label
            >
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Description</label
            >
            <textarea
              v-model="formData.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Price</label
              >
              <input
                v-model.number="formData.price"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Stock</label
              >
              <input
                v-model.number="formData.stock"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Category</label
              >
              <select
                v-model="formData.category_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
              >
                <option value="">Select a category</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id.toString()"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <!-- Image upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                @change="handleImageChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />

              <!-- Preview -->
              <img
                v-if="imagePreview"
                :src="imagePreview"
                class="mt-3 w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          </div>
        </form>

        <div class="flex justify-end space-x-3 p-6 border-t border-gray-100">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg
              v-if="isLoading"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{
              isLoading
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Create Product"
            }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deleteConfirmId !== null"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
          >
            <svg
              class="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Delete Product
          </h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>

          <div class="flex justify-center space-x-4">
            <button
              @click="cancelDelete"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              @click="handleDelete(deleteConfirmId)"
              :disabled="isLoading"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg
                v-if="isLoading"
                class="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isLoading ? "Deleting..." : "Delete Product" }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

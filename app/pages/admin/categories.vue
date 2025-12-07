<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "~/stores/useCategory";
import { useAuthStore } from "~/stores/useAuth";
import type { Category } from "~/types/models";

definePageMeta({
  middleware: "auth-role",
  layout: "admin",
});

const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const isLoading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const sortBy = ref("newest");
const showCreateModal = ref(false);
const editingCategory = ref<Category | null>(null);
const deleteConfirmId = ref<number | null>(null);

// Form data
const formData = ref({
  name: "",
  description: "",
  image_url: "",
});

// Computed properties
const categories = computed(() => categoryStore.categories);

const filteredCategories = computed(() => {
  let filtered = categories.value;
  
  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Sort categories
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case "oldest":
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      default:
        return 0;
    }
  });
});

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name", label: "Name (A-Z)" },
];

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Modal functions
const openCreateModal = () => {
  editingCategory.value = null;
  formData.value = {
    name: "",
    description: "",
    image_url: "",
  };
  showCreateModal.value = true;
};

const openEditModal = (category: Category) => {
  editingCategory.value = category;
  formData.value = {
    name: category.name,
    description: category.description,
    image_url: category.image_url || "",
  };
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingCategory.value = null;
  error.value = null;
};

const confirmDelete = (categoryId: number) => {
  deleteConfirmId.value = categoryId;
};

const cancelDelete = () => {
  deleteConfirmId.value = null;
};

// CRUD operations
const handleSave = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    if (editingCategory.value) {
      // Update existing category
      await categoryStore.updateCategory(editingCategory.value.id, formData.value);
    } else {
      // Create new category
      await categoryStore.createCategory(formData.value);
    }

    closeModal();
    await loadCategories();
  } catch (err: any) {
    error.value = err.message || "Failed to save category";
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async (categoryId: number) => {
  try {
    isLoading.value = true;
    await categoryStore.deleteCategory(categoryId);
    deleteConfirmId.value = null;
    await loadCategories();
  } catch (err: any) {
    error.value = err.message || "Failed to delete category";
  } finally {
    isLoading.value = false;
  }
};

// Load categories
const loadCategories = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    await categoryStore.fetchCategories();
  } catch (err: any) {
    error.value = err.message || "Failed to load categories";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categories Management</h1>
        <p class="text-gray-600">{{ filteredCategories.length }} categories</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200 font-medium"
        >
          Add Category
        </button>
        
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          
          <select
            v-model="sortBy"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600">Loading categories...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Categories</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="loadCategories"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      >
        <!-- Category Image -->
        <div class="aspect-video bg-gray-100 relative">
          <img
            v-if="category.image_url"
            :src="category.image_url"
            :alt="category.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
            <span class="text-white text-4xl font-bold">{{ category.name.charAt(0) }}</span>
          </div>
          
          <!-- Category Name Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <h3 class="text-white text-xl font-bold">{{ category.name }}</h3>
          </div>
        </div>
        
        <!-- Category Info -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
            <div class="flex space-x-2">
              <button
                @click="openEditModal(category)"
                class="text-accent-600 hover:text-accent-700 font-medium text-sm"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(category.id)"
                class="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          <p class="text-gray-600 text-sm line-clamp-3">{{ category.description }}</p>
          <p class="text-xs text-gray-500 mt-2">Created: {{ formatDate(category.created_at || '') }}</p>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredCategories.length === 0" class="col-span-full text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">No categories found</h3>
        <p class="text-gray-600 mb-8">
          {{ searchQuery ? 'Try adjusting your search terms' : 'No categories available' }}
        </p>
        <button
          @click="openCreateModal"
          class="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Create First Category
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
          </h2>
        </div>
        
        <form @submit.prevent="handleSave" class="p-6 space-y-4">
          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ error }}
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
              placeholder="Enter category name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="formData.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
              placeholder="Enter category description"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
            <input
              v-model="formData.image_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent"
              placeholder="https://example.com/image.jpg"
            />
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
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirmId !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Delete Category</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
          
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
              <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Deleting...' : 'Delete Category' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
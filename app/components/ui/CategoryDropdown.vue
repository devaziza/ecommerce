<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>


<template>
    <!-- Dropdown Menu -->
            <div
              class="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
            >
              <div class="py-2 max-h-64 overflow-y-auto">
                <!-- Loading State -->
                <div
                  v-if="loading"
                  class="px-4 py-3 text-sm text-gray-500 flex items-center space-x-2"
                >
                  <ChevronUp />
                  <span>Loading...</span>
                </div>

                <!-- Categories List -->
                <template v-else>
                  <!-- All Categories Link -->
                  <NuxtLink
                    to="/categories"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-200 font-medium border-b border-gray-100"
                  >
                    📂 All Categories
                  </NuxtLink>

                  <!-- Individual Categories -->
                  <NuxtLink
                    v-for="category in categories"
                    :key="category.id"
                    :to="`/category/${category.id}`"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-200"
                  >
                    <div class="flex items-center space-x-3">
                      <!-- Category Icon/Image -->
                      <div
                        class="w-6 h-6 bg-gray-100 rounded overflow-hidden flex-shrink-0"
                      >
                        <img
                          v-if="category.image_url"
                          :src="category.image_url"
                          :alt="category.name"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-else
                          class="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center"
                        >
                          <span class="text-white text-xs font-bold">{{
                            category.name.charAt(0)
                          }}</span>
                        </div>
                      </div>
                      <span class="flex-1 truncate">{{ category.name }}</span>
                    </div>
                  </NuxtLink>

                  <!-- No Categories State -->
                  <div
                    v-if="categories.length === 0"
                    class="px-4 py-3 text-sm text-gray-500"
                  >
                    No categories available
                  </div>
                </template>
              </div>
            </div>
</template>
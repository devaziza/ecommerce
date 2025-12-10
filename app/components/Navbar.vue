<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuth";
import { useCartStore } from "~/stores/useCart";
import { useCategoryStore } from "~/stores/useCategory";
import { useFavoriteStore } from "~/stores/useFavorites";
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MenuIcon,
  SearchIcon,
} from "lucide-vue-next";
import Search from "./Search.vue";

const user = useAuthStore();
const cartStore = useCartStore();
const categoryStore = useCategoryStore();
const router = useRouter();
const favoriteStore = useFavoriteStore();

const isMobileMenuOpen = ref(false);
const isSearchOpen = ref(false);
const searchQuery = ref("");
const isScrolled = ref(false);

const favoriteItemCount = computed(() => favoriteStore.favorites.length || 0);
const isLoggedIn = computed(() => user.isAuthenticated);
const categories = computed(() => categoryStore.categories);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
    isSearchOpen.value = false;
    searchQuery.value = "";
  }
};

const handleLogout = async () => {
  await user.logout();
  router.push("/login");
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  // Fetch categories on component mount
  categoryStore.fetchCategories();
  cartStore.fetchCart();
  favoriteStore.fetchFavorites();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-300"
    :class="[
      isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
        : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50',
    ]"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex justify-between items-center h-full">
        <!-- Left Section: Logo & Mobile Menu -->
        <div class="flex items-center space-x-4">
          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden p-2 rounded-lg text-gray-600 hover:text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            <MenuIcon v-if="!isMobileMenuOpen" />
            <svg
              v-else
              class="h-6 w-6 transition-transform duration-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2 group">
            <div
              class="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110"
            >
              <span class="text-white font-bold text-lg">L</span>
            </div>
            <span
              class="text-xl pr-4 font-bold bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent"
            >
              Luxe
            </span>
          </NuxtLink>
        </div>

        <!-- Center Section: Navigation Links (Desktop) -->
        <div class="hidden lg:flex items-center space-x-8">
          <NuxtLink
            to="/shop"
            class="text-gray-700 hover:text-accent font-medium transition-colors duration-200 relative group"
          >
            Shop
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"
            ></span>
          </NuxtLink>
          <div class="relative group">
            <button
              class="text-gray-700 hover:text-accent font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <span>Categories</span>
              <ChevronDown class="text-gray-700 h-4 w-4" />
            </button>
            <!-- Dropdown Menu -->
            <div
              class="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
            >
              <div class="py-2 max-h-64 overflow-y-auto">
                <!-- Loading State -->
                <div
                  v-if="categoryStore.loading"
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
          </div>

          <NuxtLink
            to="/orders"
            class="text-gray-700 hover:text-accent font-medium transition-colors duration-200 relative group"
          >
            Orders
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"
            ></span>
          </NuxtLink>
        </div>

        <!-- Center Section: Search Bar (Desktop) -->
        <div class="hidden lg:flex flex-1 max-w-xl mx-8">
          <div class="relative w-full group">
            <Search
              class="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300 group-hover:border-gray-300"
            />
            <button
              class="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-purple-700 text-white rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            >
              <SearchIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Right Section: Actions -->
        <div class="flex items-center space-x-2">
          <!-- Search Icon (Mobile) -->
          <button
            @click="toggleSearch"
            class="lg:hidden p-2 rounded-lg text-gray-600 hover:text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
            aria-label="Search"
          >
            <SearchIcon class="h-5 w-5" />
          </button>

          <!-- Wishlist -->
          <NuxtLink
            to="/favorites"
            class="hidden sm:flex p-2 rounded-full text-gray-600 hover:text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300 relative group"
            aria-label="Wishlist"
          >
            <Heart />
            <span
              v-if="favoriteItemCount > 0"
              class="absolute -top-1 -right-1 h-5 w-5 bg-purple-700 text-white text-xs rounded-full flex items-center justify-center font-medium animate-scale-in-bounce"
            >
              {{ favoriteItemCount }}
            </span>
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink
            to="/cart"
            class="relative p-2 rounded-lg text-gray-600 hover:text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300 group"
            aria-label="Shopping cart"
          >
            <svg
              class="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:animate-cart-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span
              v-if="cartStore.cart.length > 0"
              class="absolute -top-1 -right-1 h-5 w-5 bg-purple-700 text-white text-xs rounded-full flex items-center justify-center font-medium animate-scale-in-bounce"
            >
              {{ cartStore.cart.length }}
            </span>
          </NuxtLink>

          <!-- Account -->
          <div class="relative group">
            <button
              class="hidden sm:flex p-2 rounded-lg text-gray-600 hover:text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
              aria-label="Account"
            >
              <svg
                class="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </button>
            <!-- Account Dropdown -->
            <div
              class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
            >
              <div class="py-2">
                <template v-if="isLoggedIn">
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-200"
                  >
                    My Profile
                  </NuxtLink>
                  <NuxtLink
                    to="/orders"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-200"
                  >
                    My Orders
                  </NuxtLink>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-200"
                  >
                    Logout
                  </button>
                </template>
                <template v-else>
                  <NuxtLink
                    to="/login"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-200"
                  >
                    Login
                  </NuxtLink>
                  <NuxtLink
                    to="/register"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-200"
                  >
                    Register
                  </NuxtLink>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Search Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isSearchOpen"
        class="lg:hidden bg-white border-t border-gray-200 px-4 py-4"
      >
        <div class="relative">
          <Search
            class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white transition-all duration-300"
          />
        </div>
      </div>
    </Transition>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden bg-white border-t border-gray-200"
      >
        <div class="px-4 py-4 space-y-2">
          <NuxtLink
            to="/shop"
            @click="toggleMobileMenu"
            class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
          >
            🛍️ Shop All
          </NuxtLink>
          <NuxtLink
            to="/categories"
            @click="toggleMobileMenu"
            class="block px-4 py-3 text-base font-medium text-accent hover:bg-accent/10 rounded-lg transition-all duration-200 border-b border-gray-100"
          >
            📂 All Categories
          </NuxtLink>
          <div class="space-y-1">
            <div
              class="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider"
            >
              Categories
            </div>

            <!-- Loading State -->
            <div
              v-if="categoryStore.loading"
              class="px-4 py-3 text-base text-gray-500 flex items-center space-x-2"
            >
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
              <span>Loading categories...</span>
            </div>

            <!-- All Categories Link -->
            <NuxtLink
              v-if="!categoryStore.loading"
              to="/categories"
              @click="toggleMobileMenu"
              class="block px-4 py-3 text-base font-medium text-accent hover:bg-accent/10 rounded-lg transition-all duration-200 border-b border-gray-100"
            >
              📂 View All Categories
            </NuxtLink>

            <!-- Individual Categories -->
            <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.id}`"
              @click="toggleMobileMenu"
              class="block px-4 py-2 text-base text-gray-700 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
            >
              <div class="flex items-center space-x-3">
                <!-- Category Icon/Image -->
                <div
                  class="w-5 h-5 bg-gray-100 rounded overflow-hidden flex-shrink-0"
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
                <span class="flex-1">{{ category.name }}</span>
              </div>
            </NuxtLink>

            <!-- No Categories State -->
            <div
              v-if="!categoryStore.loading && categories.length === 0"
              class="px-4 py-3 text-base text-gray-500"
            >
              No categories available
            </div>
          </div>
          <NuxtLink
            to="/orders"
            @click="toggleMobileMenu"
            class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
          >
            My Orders
          </NuxtLink>
          <div class="border-t border-gray-200 pt-4 space-y-2">
            <template v-if="isLoggedIn">
              <NuxtLink
                to="/profile"
                @click="toggleMobileMenu"
                class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
              >
                My Profile
              </NuxtLink>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                @click="toggleMobileMenu"
                class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/register"
                @click="toggleMobileMenu"
                class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
              >
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        @click="toggleMobileMenu"
        class="lg:hidden fixed inset-0 bg-black/50 z-30"
      ></div>
    </Transition>
  </header>
</template>

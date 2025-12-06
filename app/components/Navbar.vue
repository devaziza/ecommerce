<script setup lang="ts">
import { useUI } from "~/composables/useUI";
import { useAuthStore } from "~/stores/useAuth";
const user = useAuthStore();

// ✅ Bu yerga category list API dan keladigan dynamic list qilasan
const categories = ["Electronics", "Fashion", "Home", "Books"];
const { isNav } = useUI();

const sidebarClasses = computed(
  () =>
    `fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300
    ${isNav ? "translate-x-0" : "-translate-x-full"}`
);
</script>

<template>
  <!-- <aside :class="sidebarClasses">
    <div class="p-6 flex justify-between items-center border-b">
      <h2 class="text-xl font-bold">Categories</h2>
      <button @click="isNav = false">✕</button>
    </div>
    <ul class="mt-4 flex flex-col gap-2">
      <li
        v-for="cat in categories"
        :key="cat"
        class="hover:bg-gray-100 p-2 rounded cursor-pointer"
      >
        {{ cat }}
      </li>
    </ul>
  </aside> -->
  <!-- Overlay for mobile -->
  <header class="sticky top-0 z-50">
    <nav
      class="bg-[#FAFAFA] backdrop-blur-md border-b border-gray-200/50 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Left Section: Logo & Mobile Menu -->
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button
              id="mobile-menu-button"
              class="lg:hidden p-2 rounded-md text-gray-700 hover:text-accent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-all duration-300"
            >
              <!-- Hamburger Icon -->
              <svg
                id="hamburger-icon"
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <!-- Close Icon (hidden by default) -->
              <svg
                id="close-icon"
                class="h-6 w-6 hidden"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
            <a
              href="#"
              class="ml-2 lg:ml-0 text-2xl font-bold text-[#111827] tracking-tight hover:text-accent transition-colors duration-300"
            >
              Luxe
            </a>
          </div>

          <!-- Center Section: Search Bar (Desktop Only) -->
          <div class="hidden lg:flex flex-1 max-w-lg mx-8">
            <div class="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              />
              <button
                class="absolute right-0 top-0 mt-1.5 mr-1.5 p-1.5 bg-accent text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-300"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Right Section: Icons -->
          <div class="flex items-center space-x-4">
            <!-- Account Icon (Desktop Only) -->
            <a
              href="#"
              class="hidden lg:flex items-center text-gray-700 hover:text-accent transition-colors duration-300"
            >
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="ml-2 text-sm font-medium">Account</span>
            </a>

            <!-- Wishlist Icon (Desktop Only) -->
            <NuxtLink
              to="/favorites"
              class="hidden lg:flex items-center text-gray-700 hover:text-accent transition-colors duration-300"
            >
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </NuxtLink>

            <!-- Cart Icon -->
            <NuxtLink
              to="/cart"
              class="relative p-2 text-gray-700 hover:text-accent transition-colors duration-300"
            >
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <!-- Cart Badge -->
              <span
                class="absolute top-1 right-1 h-4 w-4 bg-accent text-white text-xs rounded-full flex items-center justify-center"
                >2</span
              >
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div id="mobile-menu" class="lg:hidden hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <!-- Mobile Search -->
          <div class="pt-3 pb-2">
            <div class="relative">
              <input
                type="text"
                placeholder="Search..."
                class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <button class="absolute right-0 top-0 mt-2 mr-3">
                <svg
                  class="h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <!-- Mobile Links -->
          <a
            href="#"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-100 transition-all duration-300"
            >Shop All</a
          >
          <a
            href="#"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-100 transition-all duration-300"
            >New Arrivals</a
          >
          <a
            href="#"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-100 transition-all duration-300"
            >Best Sellers</a
          >
          <a
            href="#"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-100 transition-all duration-300"
            >Account</a
          >
          <a
            href="#"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-100 transition-all duration-300"
            >Wishlist</a
          >
        </div>
      </div>
    </nav>
  </header>
</template>

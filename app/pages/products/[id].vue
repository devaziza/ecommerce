<template>
  <div class="bg-white">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <svg class="animate-spin h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600">Loading product details...</p>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
        <p class="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <NuxtLink
          to="/shop"
          class="inline-flex items-center px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Back to Shop
        </NuxtLink>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <NuxtLink to="/" class="hover:text-accent-600 transition-colors">Home</NuxtLink>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <NuxtLink to="/shop" class="hover:text-accent-600 transition-colors">Shop</NuxtLink>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="text-gray-900 font-medium">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            
            <!-- Discount Badge -->
            <div
              v-if="discountPercentage > 0"
              class="absolute top-4 left-4 bg-accent-600 text-white px-3 py-1.5 rounded-full text-sm font-bold"
            >
              -{{ discountPercentage }}%
            </div>
            
            <!-- Favorite Button -->
            <button
              @click="handleToggleFavorite"
              :disabled="isTogglingFavorite"
              class="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <svg
                v-if="!isTogglingFavorite"
                class="w-6 h-6 transition-all duration-300"
                :class="isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <svg v-else class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>

          <!-- Thumbnail Images -->
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(image, index) in [product.image_url]"
              :key="index"
              @click="handleImageSelect(index)"
              class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200"
              :class="selectedImage === index ? 'border-accent-600' : 'border-transparent hover:border-gray-300'"
            >
              <img
                :src="image"
                :alt="`${product.name} ${index + 1}`"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Product Title and Rating -->
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
            
            <!-- Rating -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="flex space-x-0.5">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-5 h-5"
                    :class="i <= Math.floor(displayRating) ? 'text-yellow-400' : 'text-gray-300'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-600 ml-2">{{ displayRating.toFixed(1) }}</span>
              </div>
              <span class="text-sm text-gray-400">({{ displayReviews }} reviews)</span>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-center space-x-4">
            <span class="text-3xl font-bold text-gray-900">${{ product.price }}</span>
            <span
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="text-xl text-gray-500 line-through"
            >
              ${{ product.originalPrice }}
            </span>
            <div
              v-if="discountPercentage > 0"
              class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium"
            >
              Save ${{ ((product.originalPrice || product.price * 1.2) - product.price).toFixed(2) }}
            </div>
          </div>

          <!-- Description -->
          <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>

          <!-- Product Options -->
          <div class="space-y-6">
            <!-- Size Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Size</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in availableSizes"
                  :key="size"
                  @click="selectedSize = size"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="selectedSize === size ? 'border-accent-600 bg-accent-50 text-accent-700' : 'hover:border-gray-400'"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Color Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Color</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in availableColors"
                  :key="color.value"
                  @click="selectedColor = color.value"
                  class="relative w-10 h-10 rounded-lg border-2 transition-all duration-200"
                  :class="selectedColor === color.value ? 'border-accent-600' : 'border-gray-300 hover:border-gray-400'"
                  :style="{ backgroundColor: color.hex }"
                  :title="color.name"
                >
                  <div
                    v-if="selectedColor === color.value"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <svg class="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Quantity Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
              <div class="flex items-center space-x-4">
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button
                    @click="handleQuantityChange('decrease')"
                    :disabled="selectedQuantity <= 1"
                    class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <span class="px-4 py-2 font-medium">{{ selectedQuantity }}</span>
                  <button
                    @click="handleQuantityChange('increase')"
                    :disabled="selectedQuantity >= stockCount"
                    class="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
                <span class="text-sm text-gray-500">
                  {{ stockCount }} available
                </span>
              </div>
            </div>
          </div>

          <!-- Stock Status -->
          <div class="flex items-center space-x-2">
            <div
              v-if="inStock"
              class="flex items-center text-green-600"
            >
              <div class="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
              <span class="font-medium">In Stock</span>
            </div>
            <div
              v-else
              class="flex items-center text-red-600"
            >
              <div class="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
              <span class="font-medium">Out of Stock</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              @click="handleAddToCart"
              :disabled="!inStock || isAddingToCart"
              class="w-full bg-accent-600 text-white py-4 rounded-xl font-semibold hover:bg-accent-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="!isAddingToCart" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isAddingToCart ? 'Adding to Cart...' : 'Add to Cart' }}</span>
            </button>

            <div class="grid grid-cols-2 gap-4">
              <button class="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"></path>
                </svg>
                Add to Wishlist
              </button>
              <button class="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0"></path>
                </svg>
                Share
              </button>
            </div>
          </div>

          <!-- Product Features -->
          <div class="border-t pt-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-gray-700">Free Shipping</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-gray-700">30-Day Returns</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span class="text-sm text-gray-700">Secure Payment</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span class="text-sm text-gray-700">Authentic Product</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="mt-16">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8">
            <button
              v-for="tab in ['description', 'specifications', 'reviews']"
              :key="tab"
              @click="activeTab = tab"
              class="py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200"
              :class="activeTab === tab ? 'border-accent-600 text-accent-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              {{ tab }}
            </button>
          </nav>
        </div>

        <div class="py-8">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="prose max-w-none">
            <h3 class="text-xl font-semibold mb-4">Product Description</h3>
            <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
            <div class="mt-6 space-y-3">
              <h4 class="font-semibold text-gray-900">Key Features:</h4>
              <ul class="list-disc list-inside space-y-2 text-gray-600">
                <li>Premium quality materials</li>
                <li>Modern and stylish design</li>
                <li>Comfortable fit for all-day wear</li>
                <li>Easy to care for and maintain</li>
                <li>Available in multiple sizes and colors</li>
              </ul>
            </div>
          </div>

          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specifications'" class="space-y-6">
            <h3 class="text-xl font-semibold mb-4">Specifications</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Material</span>
                  <span class="font-medium">Premium Cotton</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Care Instructions</span>
                  <span class="font-medium">Machine Wash</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Origin</span>
                  <span class="font-medium">Made in USA</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Weight</span>
                  <span class="font-medium">200g</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Dimensions</span>
                  <span class="font-medium">30cm x 20cm x 5cm</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Warranty</span>
                  <span class="font-medium">1 Year</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <h3 class="text-xl font-semibold mb-4">Customer Reviews</h3>
            
            <!-- Review Summary -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
              <div class="flex items-center space-x-6">
                <div class="text-center">
                  <div class="text-4xl font-bold text-gray-900">{{ displayRating.toFixed(1) }}</div>
                  <div class="flex space-x-0.5 mt-2">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-5 h-5"
                      :class="i <= Math.floor(displayRating) ? 'text-yellow-400' : 'text-gray-300'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">{{ displayReviews }} reviews</div>
                </div>
                
                <div class="flex-1 space-y-2">
                  <div v-for="i in 5" :key="i" class="flex items-center space-x-3">
                    <span class="text-sm text-gray-600 w-12">{{ 6 - i }} star</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-yellow-400 h-2 rounded-full"
                        :style="{ width: `${Math.random() * 80 + 10}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-600 w-12 text-right">{{ Math.floor(Math.random() * 50 + 5) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Write Review Button -->
            <button class="w-full md:w-auto px-6 py-3 border border-accent-600 text-accent-600 rounded-lg font-medium hover:bg-accent-50 transition-colors duration-200">
              Write a Review
            </button>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section v-if="relatedProducts.length > 0" class="mt-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">You Might Also Like</h2>
          <p class="text-gray-600">Similar products you might be interested in</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductsCard
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
            :is-favorite="favoriteStore.favorites.some(f => f.id === relatedProduct.id)"
            @toggle-favorite="favoriteStore.removeFavorite(relatedProduct.id)"
            @add-to-cart="cartStore.addToCart(relatedProduct)"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from "~/stores/useProducts";
import { useCartStore } from "~/stores/useCart";
import { useFavoriteStore } from "~/stores/useFavorites";
import type { Product } from "~/types/models";

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

const productId = computed(() => parseInt(route.params.id as string));

const product = ref<Product | null>(null);
const isLoading = ref(true);
const isAddingToCart = ref(false);
const isTogglingFavorite = ref(false);

const selectedImage = ref(0);
const selectedSize = ref("M");
const selectedColor = ref("black");
const selectedQuantity = ref(1);
const activeTab = ref("description");

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const availableColors = [
  { name: "Black", value: "black", hex: "#000000" },
  { name: "White", value: "white", hex: "#FFFFFF" },
  { name: "Gray", value: "gray", hex: "#6B7280" },
  { name: "Blue", value: "blue", hex: "#3B82F6" },
  { name: "Red", value: "red", hex: "#EF4444" },
];

const stockCount = ref(50);
const displayRating = ref(4.5);
const displayReviews = ref(128);

const relatedProducts = ref<Product[]>([]);

const isFavorite = computed(() => 
  favoriteStore.favorites.some(f => f.id === product.value?.id)
);

const discountPercentage = computed(() => {
  if (!product.value) return 0;
  const originalPrice = product.value.price * 1.2;
  const discount = ((originalPrice - product.value.price) / originalPrice) * 100;
  return Math.round(discount);
});

const inStock = computed(() => stockCount.value > 0);

async function fetchProduct() {
  try {
    isLoading.value = true;
    const fetchedProduct = await productStore.fetchProductById(productId.value);
    product.value = fetchedProduct;
    
    if (fetchedProduct) {
      await fetchRelatedProducts(fetchedProduct.category_id);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchRelatedProducts(categoryId: number) {
  try {
    const products = await $fetch<Product[]>(`${useRuntimeConfig().public.apiBase}/api/products/by-category/${categoryId}`, {
      credentials: "include",
    });
    relatedProducts.value = products.filter(p => p.id !== productId.value).slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
  }
}

async function handleAddToCart() {
  if (!product.value || !inStock.value) return;
  
  try {
    isAddingToCart.value = true;
    await cartStore.addToCart(product.value);
    
    await cartStore.fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
  } finally {
    isAddingToCart.value = false;
  }
}

async function handleToggleFavorite() {
  if (!product.value) return;
  
  try {
    isTogglingFavorite.value = true;
    
    if (isFavorite.value) {
      await favoriteStore.removeFavorite(product.value.id);
    } else {
      await favoriteStore.addFavorite(product.value.id);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  } finally {
    isTogglingFavorite.value = false;
  }
}

function handleQuantityChange(action: "increase" | "decrease") {
  if (action === "increase" && selectedQuantity.value < stockCount.value) {
    selectedQuantity.value++;
  } else if (action === "decrease" && selectedQuantity.value > 1) {
    selectedQuantity.value--;
  }
}

function handleImageSelect(index: number) {
  selectedImage.value = index;
}

onMounted(() => {
  fetchProduct();
});

watch(() => route.params.id, () => {
  fetchProduct();
});
</script>
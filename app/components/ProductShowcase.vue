<template>
  <section class="relative bg-gradient-to-br from-accent-50 via-white to-stone-50 overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-stone-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-accent"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8 animate-slide-in-fade"> 
          <div class="space-y-4">
            <div class="inline-flex items-center px-4 py-2 bg-accent-100 text-[#ce297e] rounded-full text-sm font-medium">
              <span class="w-2 h-2 bg-[#ce297e] rounded-full mr-2 animate-pulse"></span>
              New Collection 2024
            </div>
            <h1 class="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Discover
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Premium Fashion
              </span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed max-w-lg">
              Elevate your style with our curated collection of premium fashion. 
              Where elegance meets contemporary design.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              to="/shop"
              class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Now
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </NuxtLink>
            <button class="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-accent-300 hover:text-accent-700 transform hover:scale-105 transition-all duration-300">
              View Lookbook
            </button>
          </div>

          <!-- Trust Indicators -->
          <div class="grid grid-cols-3 gap-6 pt-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">10K+</div>
              <div class="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">500+</div>
              <div class="text-sm text-gray-600">Products</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">4.9★</div>
              <div class="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        <!-- Right Content - Hero Images -->
        <div class="relative space-y-6 animate-scale-in-bounce">
          <!-- Main Product Image -->
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
            <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div class="absolute top-4 left-4 z-10">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                  Best Seller
                </span>
              </div>
              <img
                src="/product-f-12.webp"
                alt="Featured Product"
                class="w-full h-[400px] lg:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <!-- Floating Product Cards -->
          <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <img
              src="/product-m-men.webp"
              alt="Product 1"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-2xl shadow-xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <img
              src="/product-f-15.webp"
              alt="Product 2"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="relative bg-white/80 backdrop-blur-sm border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex items-center space-x-4 group">
            <div class="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center group-hover:bg-accent-200 transition-colors duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Premium Quality</h3>
              <p class="text-sm text-gray-600">Handpicked materials</p>
            </div>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center group-hover:bg-accent-200 transition-colors duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Free Shipping</h3>
              <p class="text-sm text-gray-600">On orders over $100</p>
            </div>
          </div>
          <div class="flex items-center space-x-4 group">
            <div class="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center group-hover:bg-accent-200 transition-colors duration-300">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Secure Payment</h3>
              <p class="text-sm text-gray-600">100% secure transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Decoration 1 (Before) */
.float-heading-bg {
  background: color-mix(in srgb, var(--heading-color), transparent 92%);
}

/* Decoration 2 (After) */
.float-accent-bg {
  background: color-mix(in srgb, var(--accent-color), transparent 90%);
}
</style>

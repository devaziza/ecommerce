<template>
  <section class="relative bg-gradient-to-br from-stone-50 to-white py-20">
    <div class="max-w-7xl flex flex-col mx-auto items-center">
      <!-- Header -->
      <div class="text-center" data-aos="fade-down" data-aos-delay="100">
        <h1
          class="text-4xl md:text-6xl font-light tracking-wide mb-6 text-[#111827]"
        >
          Discover
          <span class="text-stone-600 font-light">Premium</span> Collection
        </h1>
        <p
          class="text-stone-500 max-w-2xl mx-auto text-lg font-light leading-relaxed"
        >
          Curated styles that define elegance and comfort for the modern
          lifestyle
        </p>
      </div>
      <!-- Main Content -->
      <div class="flex flex-col w-full lg:flex-row items-center gap-8 px-20">
        <!-- Left Images -->

        <div class="flex flex-col mt-16 pt-10 md:flex-row gap-8 items-center">
          <!-- Main image -->
          <div
            class="relative h-[500px] overflow-hidden rounded-2xl shadow-sm transform transition-all duration-700 hover:scale-105 hover:shadow-xl"
          >
            <span
              class="absolute top-4 left-4 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-full z-10 font-light tracking-wide"
              >Best Seller</span
            >
            <img
              src="/product-f-12.webp"
              alt="Main Product"
              class="h-full w-100 object-cover"
            />
          </div>

          <!-- Secondary Images -->
          <div class="flex flex-col w-48 h-[500px] gap-4">
            <div
              class="rounded-2xl overflow-hidden shadow-sm transform transition-transform duration-700 hover:scale-105 hover:shadow-md"
            >
              <img
                src="/product-m-men.webp"
                alt="Product 1"
                class="w-full h-45 object-cover"
              />
            </div>
            <div
              class="rounded-2xl overflow-hidden shadow-sm transform transition-transform duration-700 hover:scale-105 hover:shadow-md"
            >
              <img
                src="/product-f-15.webp"
                alt="Product 2"
                class="w-full h-45 object-cover"
              />
            </div>
            <div
              class="relative rounded-2xl overflow-hidden shadow-sm border border-stone-300 transform transition-transform duration-700 hover:scale-105 hover:shadow-md"
            >
              <span
                class="absolute top-3 right-3 bg-stone-900 text-white text-xs px-2.5 py-1 rounded-full z-10 font-light tracking-wide"
                >SALE</span
              >
              <img
                src="/product-m-12.webp"
                alt="Product 3"
                class="w-full h-45 object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Right Content -->
        <div
          class="bg-white rounded-3xl p-10 shadow-sm w-[480px] flex flex-col gap-6 border border-stone-100"
        >
          <p
            class="text-stone-600 uppercase text-sm text-center font-light tracking-wider"
          >
            Starting From
          </p>
          <h2 class="text-4xl font-light text-[#8C0D4F] text-center">$89</h2>
          <div
            class="bg-[#8C0D4F] text-white text-center py-3.5 rounded-xl hover:bg-[#a04273] transition-colors duration-300 font-light tracking-wide"
          >
            <button>Shop Collection</button>
          </div>
          <button
            class="border border-stone-300 text-stone-700 py-3.5 rounded-xl hover:bg-stone-50 transition-colors duration-300 font-light tracking-wide"
          >
            View Lookbook
          </button>

          <!-- Features -->
          <ul class="flex flex-col gap-4 mt-6">
            <li class="flex items-center gap-3">
              <div class="bg-stone-100 p-2.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-stone-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p class="font-light text-stone-900">Premium Quality</p>
                <p class="text-stone-400 text-sm font-light">
                  Handpicked materials
                </p>
              </div>
            </li>

            <li class="flex items-center gap-3">
              <div class="bg-stone-100 p-2.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-stone-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p class="font-light text-stone-900">Customer Love</p>
                <p class="text-stone-400 text-sm font-light">4.9/5 rating</p>
              </div>
            </li>

            <li class="flex items-center gap-3">
              <div class="bg-stone-100 p-2.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-stone-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 10h2l1 12h12l1-12h2"
                  />
                </svg>
              </div>
              <div>
                <p class="font-light text-stone-900">Global Shipping</p>
                <p class="text-stone-400 text-sm font-light">
                  Worldwide delivery
                </p>
              </div>
            </li>
          </ul>
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

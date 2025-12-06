<template>
  <div class="flex flex-col items-center justify-center py-12">
    <!-- Main Loading Spinner -->
    <div class="relative mb-4">
      <div class="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
      <div class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-8   h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full animate-pulse"></div>
      </div>
    </div>

    <!-- Loading Text -->
    <p class="text-gray-600 font-medium animate-pulse">{{ message }}</p>

    <!-- Loading Dots -->
    <div class="flex gap-1 mt-2">
      <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: '0ms'"></div>
      <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: '150ms'"></div>
      <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style="animation-delay: '300ms'"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...'
});
</script>
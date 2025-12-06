<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  items: string[]
  label: string
}
const props = defineProps<Props>()
const open = ref(false)
</script>

<template>
  <div class="relative">
    <button @click="open = !open" class="hover:text-blue-600 flex items-center gap-1">
      {{ props.label }}
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <ul v-if="open" class="absolute top-full left-0 bg-white shadow-md mt-2 rounded w-40">
      <li v-for="item in props.items" :key="item" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}
const props = defineProps<Props>()
</script>

<template>
  <div class="p-4 bg-red-100 text-red-700 border border-red-300 rounded flex items-center gap-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
    </svg>
    <span>{{ props.message }}</span>
  </div>
</template>

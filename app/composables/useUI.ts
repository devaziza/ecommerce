// ~/composables/useUI.ts
import { ref } from 'vue'

const isNav = ref(false)

export const useUI = () => {
  return { isNav }
}

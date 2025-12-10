<script setup>
defineProps({
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
  },
  disabled: Boolean,
});

defineEmits(["click"]);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="`base-button--${variant}`"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  font-weight: 600;
}

.base-button--primary {
  background: #2563eb;
  color: white;
}

.base-button--secondary {
  background: #e5e7eb;
  color: black;
}

.base-button--danger {
  background: #dc2626;
  color: white;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


<!-- <script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary' // primary | secondary | danger
  },
  disabled: Boolean
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['base-button', `base-button--${variant}`]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.base-button--primary {
  background: #2563eb;
  color: white;
}

.base-button--secondary {
  background: #e5e7eb;
}

.base-button--danger {
  background: #dc2626;
  color: white;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
  -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      :class="strokeColor ?? 'stroke-current'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m5 13l4 4L19 7"
    />
  </svg>
</template>

<script setup lang="ts">
type Props = {
  strokeColor?: string
}

defineProps<Props>()
</script>

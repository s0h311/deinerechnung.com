<template>
  <button
    class="btn"
    :class="[
      {
        'btn-wide': wide,
        'btn-md': medium,
        'btn-sm': small,
        'btn-outline': outline,
        'btn-disabled': disabled,
      },
      color,
    ]"
    :type="type ? type : 'button'"
    @click="emits('handleClick')"
  >
    <span
      v-if="isLoading"
      class="loading loading-spinner"
    />
    <p
      v-else
      class="flex items-center gap-1"
    >
      <slot />
    </p>
  </button>
</template>

<script setup lang="ts">
type Props = {
  primary?: boolean
  secondary?: boolean
  accent?: boolean
  neutral?: boolean
  outline?: boolean
  error?: boolean
  wide?: boolean
  isLoading?: boolean
  medium?: boolean
  small?: boolean
  type?: 'submit' | 'button'
  disabled?: boolean
}

type Emits = {
  handleClick: []
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const color = computed(() =>
  props.primary
    ? 'btn-primary'
    : props.secondary
      ? 'btn-secondary'
      : props.accent
        ? 'btn-accent'
        : props.error
          ? 'btn-error'
          : 'btn-neutral'
)
</script>

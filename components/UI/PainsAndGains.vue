<template>
  <div>
    <h2 class="text-3xl text-center mb-14">{{ title }}</h2>

    <div class="grid grid-cols-2 gap-10">
      <ul class="bg-red-100 p-5 rounded-lg shadow-md">
        <li
          v-for="(pain, index) in pains"
          :key="'pain' + index"
          class="flex items-center gap-2"
        >
          <IconX stroke-color="stroke-error" /> {{ pain }}
        </li>
      </ul>

      <ul class="bg-green-100 p-5 rounded-lg shadow-md">
        <li
          v-for="(gain, index) in gains"
          :key="'gain' + index"
          class="flex items-center gap-2"
        >
          <IconCheck stroke-color="stroke-primary" /> {{ gain }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title: string
  pains: string[]
  gains: string[]
}

defineProps<Props>()
</script>

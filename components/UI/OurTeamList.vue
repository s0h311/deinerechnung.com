<template>
  <section>
    <h2 class="text-3xl mb-5">{{ title }}</h2>

    <p class="max-w-lg tracking-wide leading-7 mb-20">
      {{ text }}
    </p>

    <ul
      class="grid gap-20 w-fit mx-auto text-center"
      :class="`grid-cols-${people.length}`"
    >
      <li
        v-for="({ name, role, image }, index) in people"
        :key="'person' + index"
      >
        <NuxtImg
          class="rounded-full mx-auto mb-5 size-24 object-cover"
          :src="image"
          width="100"
          height="100"
          :alt="name"
        />

        <p class="font-semibold">{{ name }}</p>

        <p class="text-sm">{{ role }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
type Props = {
  title: string
  text: string
  people: {
    name: string
    role: string
    image: string
  }[]
}

defineProps<Props>()
</script>

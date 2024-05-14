<template>
  <section>
    <h2 class="text-3xl mb-5">{{ title }}</h2>

    <p class="max-w-lg tracking-wide leading-7 mb-20">
      {{ text }}
    </p>

    <ul class="grid gap-20 tablet:grid-cols-3 w-fit mx-auto text-center">
      <li
        v-for="({ name, role, image, link }, index) in people"
        :key="'person' + index"
      >
        <NuxtLink
          :to="link ? link : ''"
          target="_blank"
        >
          <NuxtImg
            class="rounded-full mx-auto mb-5 size-24 object-cover hover:ring-4"
            :src="image"
            width="96"
            height="96"
            :alt="name"
          />
        </NuxtLink>

        <p class="font-semibold">{{ name }}</p>

        <p
          v-if="role"
          class="text-sm"
        >
          {{ role }}
        </p>
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
    role?: string
    image: string
    link?: string
  }[]
}

defineProps<Props>()
</script>

<style scoped>
img:hover {
  transform: translateY(-20%);
  animation: 1s linear;
}
</style>

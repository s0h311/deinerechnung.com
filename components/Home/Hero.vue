<template>
  <div class="hero">
    <div class="hero-content text-center">
      <div class="space-y-3">
        <h1 class="text-5xl font-bold">Mehr Zeit, weniger Kopfschmerzen</h1>

        <h2 class="text-3xl">Rechnungen Einfacher, Schneller, Zuverlässiger</h2>

        <ul class="py-6 w-fit mx-auto">
          <li
            v-for="(gain, index) in gains"
            :key="'gain' + index"
            class="flex items-center gap-2"
          >
            <IconCheck /> {{ gain }}
          </li>
        </ul>

        <NuxtLink
          class="btn btn-primary"
          to="/#demo"
        >
          Wie funktioniert's ?
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gains = [
  'Rechnungen einfach per E-Mail senden',
  'Vorgespeicherte Positionen nutzen',
  'Immer den Überblick behalten',
]
</script>

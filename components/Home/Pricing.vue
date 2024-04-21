<template>
  <div class="space-y-10">
    <h2 class="text-3xl text-center">Preise</h2>

    <div class="border border-accent p-8 rounded-xl space-y-10">
      <p class="line-through text-sm -mb-8">69,99€</p>
      <div class="flex items-center gap-2">
        <p class="text-3xl font-semibold">39,99€</p>
        <p class="text-sm">/ einmalig</p>
      </div>

      <ul>
        <li
          v-for="(benefit, index) in benefits"
          :key="'benefit' + index"
          class="flex items-center gap-2 text-sm"
        >
          <IconCheck /> {{ benefit }}
        </li>
      </ul>

      <button class="btn btn-primary w-full">Jetzt holen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const benefits = ['Automatische Verbesserungen', '24/7 Kundenservice', 'Einmal zahlen, für immer benutzen']
</script>

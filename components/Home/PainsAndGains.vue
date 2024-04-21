<template>
  <div class="text-center w-fit space-y-14">
    <h2 class="text-3xl">QBlock macht Dir das Leben einfacher</h2>
    <div class="grid grid-cols-2 gap-10">
      <ul class="bg-red-100 p-5 rounded-lg shadow-md">
        <li
          v-for="(pain, index) in pains"
          :key="'pain' + index"
          class="flex items-center gap-2"
        >
          <IconX /> {{ pain }}
        </li>
      </ul>

      <ul class="bg-green-100 p-5 rounded-lg shadow-md">
        <li
          v-for="(gain, index) in gains"
          :key="'gain' + index"
          class="flex items-center gap-2"
        >
          <IconCheck /> {{ gain }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const pains = [
  'Immer die gleichen Positionen eintippen',
  'Immer wieder die gleiche Adressen eintippen',
  'Unstrukturiert',
  'Manuell per E-Mail senden',
]

const gains = [
  'Vorgespeicherte Positionen',
  'Vorgespeicherte Kunden',
  'Seriöse Struktur',
  'Einfach per E-Mail senden',
  'Automatische Rechnungsnummer',
]
</script>

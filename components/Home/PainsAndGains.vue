<template>
  <UIPainsAndGains
    title="Es macht dir das Leben einfacher"
    :pains="pains"
    :gains="gains"
  />
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

<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Kontoeinstellungen',
})
</script>

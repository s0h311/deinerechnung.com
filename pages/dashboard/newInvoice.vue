<template>
  <div class="flex gap-10 h-full">
    <div class="space-y-7 pr-10 border-r h-full">
      <h2>Daten</h2>

      <InvoiceRecipientForm />

      <div class="divider" />

      <InvoicePositionForm />
      <InvoiceVatForm />

      <InvoiceNextSteps />
    </div>

    <InvoicePreview />

    <InvoiceCurrentPositions />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})
</script>

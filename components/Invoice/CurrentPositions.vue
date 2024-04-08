<template>
  <section class="space-y-7 w-full">
    <h2>Positionen</h2>

    <ul class="space-y-2 w-full">
      <li
        v-for="(invoicePosition, index) in currentInvoicePositions"
        class="grid grid-flow-col items-center"
        :key="invoicePosition.id"
      >
        <p>{{ invoicePosition.description }}</p>
        <button
          class="btn btn-sm btn-outline btn-error w-fit justify-self-end"
          @click="handleRemoveInvoicePosition(index)"
        >
          <IconDelete />
        </button>
      </li>
    </ul>
  </section>
</template>
<script setup lang="ts">
const currentInvoicePositions = useCurrentInvoicePositions()

function handleRemoveInvoicePosition(index: number): void {
  currentInvoicePositions.value.splice(index, 1)
}
</script>

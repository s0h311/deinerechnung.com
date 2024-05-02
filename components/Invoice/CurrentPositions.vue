<template>
  <section class="space-y-7 w-full">
    <h2>Positionen</h2>

    <ul class="space-y-2 w-full">
      <li
        v-for="(invoicePosition, index) in currentInvoice.positions"
        :key="invoicePosition.id"
        class="grid grid-flow-col items-center"
      >
        <p>{{ invoicePosition.description }}</p>

        <UICta
          class="justify-self-end"
          small
          outline
          error
          @handle-click="handleRemoveInvoicePosition(index)"
        >
          <IconDelete />
        </UICta>
      </li>
    </ul>
  </section>
</template>
<script setup lang="ts">
const currentInvoice = await useCurrentInvoice()

function handleRemoveInvoicePosition(index: number): void {
  currentInvoice.value.positions.splice(index, 1)
}
</script>

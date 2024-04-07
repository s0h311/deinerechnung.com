<template>
  <div class="flex gap-10 h-full">
    <div class="space-y-7 pr-10 border-r h-full">
      <select
        class="select select-bordered w-full max-w-xs"
        @change="handleRecipientChange"
      >
        <option
          disabled
          selected
        >
          Kunde auswählen
        </option>

        <option
          v-for="recipient in recipients"
          :key="recipient.id"
          :value="recipient.id"
        >
          {{ recipient.name }}
        </option>
      </select>

      <div class="divider"></div>

      <div class="flex flex-col w-full border-opacity-50">
        <select class="select select-bordered w-full max-w-xs">
          <option
            disabled
            selected
          >
            Position wählen
          </option>

          <option
            v-for="invoicePosition in invoicePositions"
            :key="invoicePosition.id"
          >
            {{ invoicePosition.description }} {{ invoicePosition.price }} €
          </option>
        </select>

        <div class="divider my-8">oder hinzufügen</div>

        <InvoicePositionForm />
      </div>
    </div>

    <InvoicePreview />
  </div>
</template>

<script setup lang="ts">
import { useCurrentRecipient } from '~/composables/states'

definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

const recipients = await useRecipients()
const currentRecipient = useCurrentRecipient()
const invoicePositions = await useInvoicePositions()

function handleRecipientChange(event: Event): void {
  const select = event.target as HTMLSelectElement

  console.log(select)
}
</script>

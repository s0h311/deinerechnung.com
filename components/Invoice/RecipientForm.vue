<template>
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
</template>
<script setup lang="ts">
const recipients = await useRecipients()
const currentRecipient = await useCurrentRecipient()

function handleRecipientChange(event: Event): void {
  const select = event.target as HTMLSelectElement
  const recipientId = Number(select.value)

  const recipient = recipients.value.find((recipient) => recipient.id === recipientId)

  if (recipient) {
    currentRecipient.value = recipient
  }
}
</script>

<template>
  <form
    v-if="sender"
    class="grid gap-7"
    @submit.prevent="handleSubmit"
  >
    <h2>Adresse</h2>

    <input
      class="input input-bordered"
      type="text"
      v-model="sender.name"
      placeholder="Name"
    />

    <input
      class="input input-bordered"
      type="text"
      v-model="sender.addressLine"
      placeholder="Straße und Hausnummer"
    />

    <input
      class="input input-bordered"
      type="number"
      v-model="sender.zipCode"
      placeholder="PZL"
    />

    <input
      class="input input-bordered"
      type="text"
      v-model="sender.city"
      placeholder="Ort"
    />

    <input
      class="input input-bordered"
      type="text"
      v-model="sender.country"
      placeholder="Land"
    />

    <button
      class="btn btn-wide btn-primary"
      type="submit"
    >
      <span
        v-if="isLoading"
        class="loading loading-spinner"
      />

      <p v-else>{{ sender.addressLine ? 'Aktualisieren' : 'Hinzufügen' }}</p>
    </button>
  </form>
</template>

<script setup lang="ts">
const sender = await useSender()
const isLoading = ref<boolean>(false)

async function handleSubmit(): Promise<void> {
  alert('moin')
}
</script>

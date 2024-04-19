<template>
  <input
    class="input input-bordered"
    v-model="invoice.vatRate"
    type="number"
    :min="0"
    :max="99"
    :step="1"
    placeholder="USt. %"
  />
</template>

<script setup lang="ts">
const invoice = await useCurrentInvoice()
</script>

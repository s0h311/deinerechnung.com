<template>
  <input
    v-model="invoice.vatRate"
    class="input input-bordered"
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

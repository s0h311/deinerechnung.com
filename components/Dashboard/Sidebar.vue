<template>
  <aside class="flex flex-col gap-5 p-10 bg-base-200 text-slate-200 h-screen w-fit">
    <NuxtLink
      v-for="{ title, path } in links"
      class="hover:bg-slate-200 hover:text-base-200 rounded-xl px-3 py-2 text-nowrap"
      :key="path"
      :to="path"
    >
      {{ title }}
    </NuxtLink>
  </aside>
</template>

<script setup lang="ts">
const links = [
  { title: 'Übersicht', path: '/dashboard' },
  { title: 'Neue Rechnung', path: '/dashboard/newInvoice' },
  { title: 'Rechnungen', path: '/dashboard/invoices' },
  { title: 'Kunden', path: '/dashboard/customers' },
  { title: 'Einstellungen', path: '/dashboard/settings' },
]
</script>

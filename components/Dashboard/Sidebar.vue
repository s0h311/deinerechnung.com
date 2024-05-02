<template>
  <aside class="flex flex-col gap-5 p-10 border-r h-screen w-fit">
    <NuxtLink
      v-for="{ title, path } in links"
      :key="path"
      class="px-3 py-2 rounded-lg"
      :class="route.path === path ? 'bg-neutral text-base-200' : 'hover:bg-base-200'"
      :to="path"
    >
      {{ title }}
    </NuxtLink>

    <div class="grid justify-items-start gap-2 text-sm mt-auto">
      <NuxtLink
        v-for="{ title, path } in bottomLinks"
        :key="path"
        class="px-3 py-2 rounded-lg"
        :class="route.path === path ? 'bg-neutral text-base-200' : 'hover:bg-base-200'"
        :to="path"
      >
        {{ title }}
      </NuxtLink>
      <button
        class="px-3 py-2 rounded-lg hover:bg-base-200"
        @click="handleSignout"
      >
        Abmelden
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

const supabase = useSupabaseClient()
const sender = await useSender()

const links = [
  { title: 'Neue Rechnung', path: '/dashboard/newInvoice' },
  { title: 'Rechnungen', path: '/dashboard/invoices' },
  { title: 'Positionen', path: '/dashboard/invoicePositions' },
  { title: 'Kunden', path: '/dashboard/customers' },
]

const bottomLinks = [
  { title: 'Rechnungeinstellungen', path: '/dashboard/invoiceSettings' },
  { title: 'Kontoeinstellungen', path: '/dashboard/accountSettings' },
]

async function handleSignout(): Promise<void> {
  await supabase.auth.signOut()
  sender.value = null
  navigateTo('/')
}
</script>

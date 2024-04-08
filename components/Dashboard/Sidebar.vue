<template>
  <aside class="flex flex-col gap-5 p-10 border-r h-screen w-fit">
    <NuxtLink
      v-for="{ title, path } in links"
      class="px-3 py-2 rounded-lg"
      :class="route.path === path ? 'bg-neutral text-base-200' : 'hover:bg-base-200'"
      :key="path"
      :to="path"
    >
      {{ title }}
    </NuxtLink>

    <button
      class="mt-auto mr-auto px-3 py-2 rounded-lg hover:bg-base-200"
      @click="handleSignout"
    >
      Abmelden
    </button>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const sender = await useSender()

const links = [
  { title: 'Übersicht', path: '/dashboard' },
  { title: 'Neue Rechnung', path: '/dashboard/newInvoice' },
  { title: 'Rechnungen', path: '/dashboard/invoices' },
  { title: 'Kunden', path: '/dashboard/customers' },
  { title: 'Einstellungen', path: '/dashboard/settings' },
]

async function handleSignout(): Promise<void> {
  await supabase.auth.signOut()
  sender.value = null
  navigateTo('/')
}
</script>

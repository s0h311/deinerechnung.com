<template>
  <UISidebar
    :links="links"
    :bottom-links="bottomLinks"
    :bottom-btns="bottomBtns"
  />
</template>

<script setup lang="ts">
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

const bottomBtns = [{ title: 'Abmelden', handleFn: handleSignout }]

async function handleSignout(): Promise<void> {
  await supabase.auth.signOut()
  sender.value = null
  navigateTo('/')
}
</script>

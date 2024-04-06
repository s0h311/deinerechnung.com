<template>
  <div class="grid grid-flow-col gap-10">
    <CustomerForm />
    <CustomerList />
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/server/data/models/database.types'

definePageMeta({
  layout: 'dashboard-grid',
  middleware: ['auth'],
})

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
</script>

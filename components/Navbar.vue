<template>
  <div class="relative navbar bg-gray-300 rounded-xl">
    <button
      class="btn btn-md btn-neutral absolute right-4"
      @click="handleSignout"
    >
      Abmelden
    </button>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

async function handleSignout(): Promise<void> {
  await supabase.auth.signOut()

  navigateTo('/')
}
</script>

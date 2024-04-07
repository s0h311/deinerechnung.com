<template>
  <div class="relative navbar gap-10 px-10 bg-base-200 rounded-xl">
    <NuxtLink to="login"> Anmelden </NuxtLink>

    <NuxtLink to="signup"> Registrieren </NuxtLink>

    <button
      v-if="user"
      class="btn btn-md btn-neutral absolute right-10"
      @click="handleSignout"
    >
      Abmelden
    </button>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const sender = await useSender()

async function handleSignout(): Promise<void> {
  await supabase.auth.signOut()

  sender.value = null
  navigateTo('/')
}
</script>

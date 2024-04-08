<template>
  <div class="navbar gap-10 px-10 bg-base-200 rounded-xl">
    <NuxtLink
      v-if="!user"
      to="login"
    >
      Anmelden
    </NuxtLink>

    <NuxtLink
      v-if="!user"
      to="signup"
    >
      Registrieren
    </NuxtLink>

    <NuxtLink
      class="ml-auto"
      v-if="user"
      to="/dashboard"
      >Dashboard</NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <nav class="navbar px-10 grid grid-cols-3 place-items-center">
    <HomeLogo />

    <div class="space-x-7">
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
      >
        {{ link.title }}
      </NuxtLink>
    </div>

    <div class="space-x-3 justify-self-end">
      <NuxtLink
        v-if="!user"
        to="/login"
      >
        Anmelden
      </NuxtLink>

      <NuxtLink
        v-if="user"
        to="/dashboard/newInvoice"
      >
        Dashboard
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

const links = [
  {
    title: 'Preise',
    path: '/#pricing',
  },
  {
    title: "Wie funktioniert's",
    path: '/#demo',
  },
  {
    title: 'Wer sind wir',
    path: '/#about',
  },
]
</script>

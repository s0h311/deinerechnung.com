<template>
  <div class="mt-20 grid grid-cols-2 place-items-center gap-10">
    <div class="space-y-5">
      <h1 class="text-5xl">Danke für Ihr Vertrauen.</h1>
      <p>Sie erhalten in kürze Ihr Passwort per E-Mail</p>
      <span class="flex items-center gap-5"
        >Sie werden nun zur Anmeldeseite weitergeleitet
        <div class="loading loading-spinner" />
      </span>
    </div>

    <NuxtImg
      class="rounded-lg -scale-x-100"
      src="alvan-nee-brFsZ7qszSY.jpg"
      :width="500"
      :height="700"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  setTimeout(() => navigateTo('/login'), 1000 * 5)
})
</script>

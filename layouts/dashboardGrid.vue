<template>
  <section class="grid">
    <DashboardSidebar />

    <main class="p-10">
      <slot />
    </main>
  </section>
</template>
<style scoped>
section {
  grid-template-columns: auto 1fr;
}
</style>

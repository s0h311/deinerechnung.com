<template>
  <div>
    <div class="px-5 py-3 md:px-10 md:py-7 lg:px-[10dvw] space-y-10">
      <HomeNavbar class="px-[10dvw]" />

      <main>
        <slot />
      </main>
    </div>

    <HomeFooter class="mt-52" />
  </div>
</template>

<template>
  <aside class="flex flex-col gap-5 p-10 border-r h-screen w-fit">
    <NuxtLink
      v-for="{ title, path } in links"
      :key="path"
      class="px-3 py-2 rounded-lg"
      :class="route.path === path ? 'bg-neutral text-base-200' : 'hover:bg-base-200'"
      :to="path"
    >
      {{ title }}
    </NuxtLink>

    <div
      v-if="bottomLinks.length > 0 || bottomBtns.length > 0"
      class="grid justify-items-start gap-2 text-sm mt-auto"
    >
      <NuxtLink
        v-for="{ title, path } in bottomLinks"
        :key="path"
        class="px-3 py-2 rounded-lg"
        :class="route.path === path ? 'bg-neutral text-base-200' : 'hover:bg-base-200'"
        :to="path"
      >
        {{ title }}
      </NuxtLink>

      <button
        v-for="(btn, btnIndex) in bottomBtns"
        :key="'btn' + btnIndex"
        class="px-3 py-2 rounded-lg hover:bg-base-200"
        @click="btn.handleFn"
      >
        {{ btn.title }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
type Link = {
  title: string
  path: string
}

type Btn = {
  title: string
  handleFn: () => void
}
type Props = {
  links: Link[]
  bottomLinks?: Link[]
  bottomBtns?: Btn[]
}

defineProps<Props>()

const route = useRoute()
</script>

<template>
  <section class="space-y-7">
    <h2>Fußnoten</h2>

    <form
      v-if="sender"
      class="grid gap-7"
      @submit.prevent="submit(handleSubmit)"
    >
      <textarea
        class="textarea textarea-bordered"
        placeholder="Spalte 1"
        v-model="fields.column1"
        cols="30"
        rows="4"
        spellcheck="true"
      ></textarea>

      <textarea
        class="textarea textarea-bordered"
        placeholder="Spalte 2"
        v-model="fields.column2"
        cols="30"
        rows="4"
        spellcheck="true"
      ></textarea>

      <textarea
        class="textarea textarea-bordered"
        placeholder="Spalte 2"
        v-model="fields.column3"
        cols="30"
        rows="4"
        spellcheck="true"
      ></textarea>

      <button
        class="btn btn-wide btn-primary"
        type="submit"
      >
        <span
          v-if="isLoading"
          class="loading loading-spinner"
        />

        <p v-else>{{ sender.addressLine ? 'Aktualisieren' : 'Hinzufügen' }}</p>
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { Database } from '~/supabase/database.types'

const sender = await useSender()
const supabase = useSupabaseClient<Database>()
const isLoading = ref<boolean>(false)

const { fields, submit } = useForm({
  initialValue: {
    column1: sender.value && sender.value.footnotes ? sender.value.footnotes[0] : '',
    column2: sender.value && sender.value.footnotes ? sender.value.footnotes[1] : '',
    column3: sender.value && sender.value.footnotes ? sender.value.footnotes[2] : '',
  },
  resolver: z.object({
    column1: z.string(),
    column2: z.string(),
    column3: z.string(),
  }),
})

async function handleSubmit(fields: Record<`column${number}`, string>): Promise<void> {
  if (!sender.value) {
    return
  }

  isLoading.value = true

  const columns = [fields.column1, fields.column2, fields.column3]

  const { data, error } = await supabase
    .from('sender')
    .update({
      footnotes: columns,
    })
    .eq('id', sender.value.id)
    .select()
    .single()

  if (error) {
    console.error(error)
    return
  }

  sender.value.footnotes = data.footnotes

  isLoading.value = false
}
</script>

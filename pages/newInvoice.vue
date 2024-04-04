<template>
  <div class="flex gap-10 w-full h-full">
    <div class="flex flex-col gap-7 pr-10 border-r h-full">
      <select class="select select-bordered w-full max-w-xs">
        <option
          disabled
          selected
        >
          Kunde auswählen
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select>

      <div class="divider"></div>

      <div class="flex flex-col w-full border-opacity-50">
        <select class="select select-bordered w-full max-w-xs">
          <option
            disabled
            selected
          >
            Position wählen
          </option>
          <option>Han Solo</option>
          <option>Greedo</option>
        </select>

        <div class="divider my-8">oder hinzufügen</div>

        <div class="flex flex-col gap-7">
          <textarea
            class="textarea textarea-bordered"
            placeholder="Beschreibung"
          ></textarea>

          <input
            type="number"
            placeholder="Einzelpreis"
            class="input input-bordered"
          />

          <input
            type="number"
            placeholder="Menge"
            class="input input-bordered"
          />

          <button class="btn btn-neutral">Hinzufügen</button>
        </div>
      </div>
    </div>

    <div>PREVIEW HERE</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-grid',
})
</script>

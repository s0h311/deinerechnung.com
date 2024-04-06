<template>
  <div>
    <button
      class="btn btn-neutral"
      @click="handleSave"
    >
      SAVE
    </button>
  </div>
</template>

<script setup lang="ts">
import { jsPDF } from 'jspdf'

// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF()

function handleSave(): void {
  doc.text('Hello world!', 10, 10)
  doc.save('a4.pdf')
}
</script>

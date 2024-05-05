<template>
  <div>
    <h2>Abo Status</h2>

    <table class="table w-fit">
      <tr>
        <th>Kunde seit</th>
        <td>
          {{ formatDate(new Date(subscription.createdAt)) }}
        </td>
      </tr>

      <tr>
        <th>Zahlungszyklus</th>
        <td>{{ subscriptionType }}</td>
      </tr>

      <tr>
        <th>letzte Zahlung</th>
        <td>
          {{ subscription.lastPayment ? formatDate(new Date(subscription.lastPayment)) : 'noch keine' }}
        </td>
      </tr>
    </table>

    <p class="text-xs max-w-md text-gray-500">
      Falls Sie Änderungen an Ihrem Abo vornehmen möchten, dann kontakieren Sie uns gerne über
      <a
        class="text-secondary"
        href="mailto:support@reffect.org"
        >support@reffect.org</a
      >
    </p>
  </div>
</template>

<script setup lang="ts">
const subscription = (await useSubscription()).value!

const subscriptionType = computed(() =>
  subscription.type === 'monthly'
    ? 'monatlich'
    : subscription.type === 'yearly'
      ? 'jährlich'
      : subscription.type === 'lifetime'
        ? 'für immer'
        : 'error'
)
</script>

<style scoped>
th {
  @apply pl-0 pt-0;
}

td {
  @apply pr-0 pt-0;
}

table tr:last-child {
  th,
  td {
    @apply pb-0;
  }
}
</style>

<template>
  <UIFooter
    :links-column1="otherProdcutsLinks"
    :links-column2="contactLinks"
    :links-column3="legalLinks"
  >
    <HomeLogo />
  </UIFooter>
</template>

<script setup lang="ts">
const otherProdcutsLinks = {
  title: 'Andere Produkte',
  links: [
    {
      title: 'FeedX AI',
      path: 'feedx.ai',
    },
  ],
}

const contactLinks = {
  title: 'Kontakt',
  links: [
    {
      title: 'Hilfe',
      path: '/help',
    },
    {
      title: 'Feedback',
      path: '/feedback',
    },
  ],
}

const legalLinks = {
  title: 'Rechtlich',
  links: [
    {
      title: 'Impressum',
      path: '/imprint',
    },
    {
      title: 'Datenschutz',
      path: '/privacyPolicy',
    },
    {
      title: 'AGB',
      path: '/terms',
    },
  ],
}
</script>

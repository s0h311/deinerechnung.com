<template>
  <div
    id="about"
    class="space-y-10"
  >
    <UIHeroWithMultipleImages
      title="Wir nutzen Technologie um dein Leben einfacher zu machen"
      text="
      Tagtäglich machen wir uns Gedanken darüber, wie wir deinen Leben einfacher machen können.
      Was wir am Besten können ist die Software-Entwicklung. Damit versuchen wir deine Arbeit zu erleichtern.
      Wir sind von unseren Produkten überzeugt, denn wir entwickeln sie mit Spaß und denken an deine Bedürfnisse.
    "
      :images="[
        'annie-spratt-MChSQHxGZrQ.jpg',
        'brooke-cagle-g1Kr4Ozfoac.jpg',
        'disruptivo-iQ15DTx-63k.jpg',
        'jason-goodman-fznQW-kn5VU.jpg',
        'surface-coCGW4SsxX4.jpg',
      ]"
    />

    <UIOurTeamList
      title="Unser Team"
      text="Jede Menge Kreativität und Leidenschaft. Wir lieben unsere Arbeit und die Herausforderung."
      :people="[
        {
          name: 'Maximilian Buchmann',
          image: 'person-1.png',
        },

        {
          name: 'Fahram Tehrani',
          image: 'person-2.png',
        },

        {
          name: 'Soheil Nazari',
          image: 'person-3.png',
          link: 'https://soheilnazari.de',
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts"></script>

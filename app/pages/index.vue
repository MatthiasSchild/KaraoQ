<script setup lang="ts">
import CenterSheet from '~/components/CenterSheet.vue'
import Column from '~/components/Column.vue'

definePageMeta({
  middleware: ['auth-redirect'],
});
</script>

<template>
  <CenterSheet>
    <Column>
      <h1>KaraoQ</h1>
      <v-btn to="/host">
        Create a party
      </v-btn>
      <v-btn to="/join">
        Join a party
      </v-btn>
    </Column>
  </CenterSheet>
</template>

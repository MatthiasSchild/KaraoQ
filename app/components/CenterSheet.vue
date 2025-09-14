<template>
  <div class="CenterSheet">
    <v-sheet class="pa-8" :elevation="24" rounded>
      <slot />
    </v-sheet>
  </div>
</template>

<style scoped lang="scss">
.CenterSheet {
  display: flex;
  min-height: 100%;
  justify-content: center;
  align-items: center;
}
</style>

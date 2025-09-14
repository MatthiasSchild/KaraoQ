<script setup lang="ts">


</script>

<template>
  <VApp id="app">
    <Header id="header" />
    <VMain id="main">
      <slot />
    </VMain>
    <Footer id="footer" />
  </VApp>
</template>

<style scoped lang="scss">
#app {
  min-height: 100dvh;

  #header {
    flex: 0;
  }

  #main {
    flex: 1;
  }

  #footer {
    flex: 0;
  }
}
</style>
<script setup lang="ts">
</script>

<template>
  <div class="Column">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.Column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

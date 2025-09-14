<script setup lang="ts">
const { checkAuthAndRedirect, authState } = useAuth();
const singers = useSingerStore();
const partyStore = usePartyStore();

// Check authentication on mount
onMounted(async () => {
  const isAuthenticated = await checkAuthAndRedirect();
  if (!isAuthenticated) {
    return; // Will redirect to join page
  }
  
  // Load party details and start fetching singers
  try {
    await partyStore.fetchPartyDetails();
    singers.startAutoFetch();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
});

// Stop auto-fetching when component unmounts
onUnmounted(() => {
  singers.stopAutoFetch();
});

// Handle skip singer action
const handleSkipSinger = async (singerId: string) => {
  try {
    await $fetch(`/api/singers/${singerId}/skip`, {
      method: 'PATCH'
    });
    // Refresh the singer list
    await singers.fetchSingers();
  } catch (error) {
    console.error('Failed to skip singer:', error);
  }
};

// Handle finish singer action
const handleFinishSinger = async (singerId: string) => {
  try {
    await $fetch(`/api/singers/${singerId}/finish`, {
      method: 'PATCH'
    });
    // Refresh the singer list
    await singers.fetchSingers();
  } catch (error) {
    console.error('Failed to finish singer:', error);
  }
};
</script>

<template>
  <VContainer fluid class="pa-4 dashboard-container">
    <VRow>
      <VCol cols="12" md="4" lg="3">
        <QRCode 
          v-if="partyStore.party?.joinCode"
          :join-code="partyStore.party.joinCode"
          :party-name="partyStore.party.name"
        />
      </VCol>

      <VCol cols="12" md="8" lg="9">
        <DashboardSingerList 
          :singers="singers.singers"
          :is-loading="singers.isLoading"
          @skip="handleSkipSinger"
          @finish="handleFinishSinger"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.singer-count-chip {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>

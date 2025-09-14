<script setup lang="ts">
const route = useRoute();
const partyStore = usePartyStore();

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    });
    // Clear party store on logout
    partyStore.clearParty();
    // Redirect to index page after successful logout
    await navigateTo('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const shouldShowPartyInfo = computed(() => {
  return route.path === '/dashboard' || route.path === '/app';
});

onMounted(async () => {
  if (shouldShowPartyInfo.value) {
    try {
      await partyStore.fetchPartyDetails();
    } catch (error) {
      console.error('Failed to fetch party details:', error);
    }
  }
});
</script>

<template>
    <VAppBar>
      <VAppBarTitle>
        <VBtn to="/" variant="text" class="text-h5 font-weight-bold">
          KaraoQ
        </VBtn>
        
        <!-- Party info next to title - hidden on mobile -->
        <span v-if="shouldShowPartyInfo && partyStore.party" class="text-h6 ml-4 d-none d-md-inline">
          {{ partyStore.party.name }} (Join code: {{ partyStore.party.joinCode }})
        </span>
      </VAppBarTitle>
      
      <!-- Spacer to push logout button to the right -->
      <VSpacer v-if="shouldShowPartyInfo" />
      
      <!-- Logout button -->
      <VBtn
        v-if="shouldShowPartyInfo"
        @click="handleLogout"
        icon
        variant="text"
      >
        <VIcon>mdi-logout</VIcon>
      </VBtn>
    </VAppBar>
</template>
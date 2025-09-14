<script setup lang="ts">
import type { FormData } from '../components/AddSingerForm.vue';

const singers = useSingerStore();
const tab = ref('add');
const successMessage = ref<string>('');
const currentSessionId = ref<string>('');
const addSingerFormRef = ref();

async function onSubmit(data: FormData, rememberSinger: boolean) {
  try {
    const response = await $fetch('/api/singers', {
      method: 'POST',
      body: data,
    });
    
    // Show success message with singers before count
    const singersBefore = response.singersBefore;
    if (singersBefore === 0) {
      successMessage.value = 'You are next in line!';
    } else if (singersBefore === 1) {
      successMessage.value = 'There is 1 singer before you.';
    } else {
      successMessage.value = `There are ${singersBefore} singers before you.`;
    }
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
    
    // Clear the form based on remember singer setting
    if (addSingerFormRef.value) {
      addSingerFormRef.value.clearForm();
    }
    
    // Immediately refresh the singer list to show the new song
    await singers.fetchSingers();
  } catch (error) {
    console.error('Failed to add singer:', error);
  }
}

async function handleDeleteSinger(singerId: string) {
  try {
    await $fetch(`/api/singers/${singerId}`, {
      method: 'DELETE',
    });
    
    // Immediately refresh the singer list to show the deletion
    await singers.fetchSingers();
  } catch (error) {
    console.error('Failed to delete singer:', error);
  }
}

// Start auto-fetching when component mounts
onMounted(async () => {
  const { checkAuthAndRedirect, authState, logoutAndRedirect } = useAuth();
  
  // Check authentication first
  const isAuthenticated = await checkAuthAndRedirect();
  if (!isAuthenticated) {
    return; // Will redirect to join page
  }
  
  // Set current session ID from auth state
  currentSessionId.value = authState.sessionId || '';
  console.log('Setting currentSessionId:', currentSessionId.value);
  console.log('Auth state sessionId:', authState.sessionId);
  
  singers.startAutoFetch();
  
  // Check party details and handle errors
  try {
    await $fetch('/api/party');
  } catch (error: any) {
    console.error('Failed to fetch party details:', error);
    
    // If it's a 500 error or party not found, logout and redirect
    if (error.statusCode === 500 || error.statusCode === 404) {
      await logoutAndRedirect();
    }
  }
});

// Handle logout and redirect to join page
async function handleLogoutAndRedirect() {
  try {
    // Clear party store
    const partyStore = usePartyStore();
    partyStore.clearParty();
    
    // Use auth composable for logout and redirect
    const { logoutAndRedirect } = useAuth();
    await logoutAndRedirect();
  } catch (error) {
    console.error('Failed to logout and redirect:', error);
    // Force redirect even if logout fails
    await navigateTo('/join');
  }
}

// Stop auto-fetching when component unmounts
onUnmounted(() => {
  singers.stopAutoFetch();
});
</script>

<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VTabs
          v-model="tab"
          color="primary"
          align-tabs="start"
          class="tabs-full-width"
        >
          <VTab value="add">
            <VIcon start>mdi-plus</VIcon>
            Add Song
          </VTab>
          <VTab value="queue">
            <VIcon start>mdi-queue-music</VIcon>
            Queue
          </VTab>
        </VTabs>
      </VCol>
    </VRow>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem value="add">
        <VRow>
          <VCol cols="12">
            <!-- Success Message -->
            <VAlert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="successMessage = ''"
            >
              {{ successMessage }}
            </VAlert>
            
            <AddSingerForm ref="addSingerFormRef" @submit="onSubmit" />
          </VCol>
        </VRow>
      </VTabsWindowItem>
      
      <VTabsWindowItem value="queue">
        <VRow>
          <VCol cols="12">
            <SingerQueue 
              :singers="singers.singers" 
              :is-loading="singers.isLoading"
              :current-session-id="currentSessionId"
              @delete="handleDeleteSinger"
            />
          </VCol>
        </VRow>
      </VTabsWindowItem>
    </VTabsWindow>
  </VContainer>
</template>

<style scoped>
.tabs-full-width :deep(.v-tab) {
  flex: 1;
  min-width: 0;
}

.tabs-full-width :deep(.v-tabs) {
  width: 100%;
}
</style>

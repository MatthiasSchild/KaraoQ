<script setup lang="ts">
definePageMeta({
  middleware: ['auth-redirect'],
});

const partyStore = usePartyStore();
const errorMessage = ref<string>('');
const isLoading = ref<boolean>(false);

// Get the code from query parameters
const route = useRoute();
const code = computed(() => route.query.code as string);

// Function to join a party
const joinParty = async (joinCode: string) => {
  // Clear any previous error
  errorMessage.value = '';
  isLoading.value = true;
  
  try {
    const response = await $fetch('/api/party/join', {
      method: 'POST',
      body: {
        joinCode: joinCode,
      },
    });

    // Populate party store with the joined party data
    partyStore.setParty(response.party);

    // Redirect to app page after successful join
    await navigateTo('/app');
  } catch (error: any) {
    console.error('Failed to join party:', error);
    
    // Handle different error types
    if (error.statusCode === 404) {
      errorMessage.value = 'Party not found. Please check your join code.';
    } else if (error.statusCode === 400) {
      errorMessage.value = 'Invalid join code format.';
    } else {
      errorMessage.value = 'Failed to join party. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Auto-join if code is provided in URL
onMounted(async () => {
  if (code.value) {
    await joinParty(code.value);
  }
});

const onSubmit = async (values: { joinCode: string }) => {
  await joinParty(values.joinCode);
};
</script>

<template>
  <Center>
    <VCard class="pa-6" width="100%" max-width="600">
      <VCardTitle class="text-h4 text-center mb-6 text-primary">
        Join a party!
      </VCardTitle>
      
      <!-- Loading state when auto-joining -->
      <div v-if="isLoading && code" class="text-center">
        <VProgressCircular
          indeterminate
          color="primary"
          size="64"
          class="mb-4"
        />
        <p class="text-body-1">Joining party with code: <strong>{{ code }}</strong></p>
      </div>
      
      <!-- Join form -->
      <ClientOnly v-else>
        <JoinForm 
          :error="errorMessage" 
          :initial-code="code"
          @submit="onSubmit" 
        />
      </ClientOnly>
    </VCard>
  </Center>
</template>

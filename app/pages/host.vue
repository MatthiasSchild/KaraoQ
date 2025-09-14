<script setup lang="ts">
definePageMeta({
  middleware: ['auth-redirect'],
});

const partyStore = usePartyStore();

const onSubmit = async (values: { name: string }) => {
  console.log("asdf", values);
  try {
    const response = await $fetch('/api/party', {
      method: 'POST',
      body: {
        name: values.name,
      },
    });

    // Populate party store with the created party data
    partyStore.setParty(response.party);

    // Redirect to dashboard after successful party creation
    await navigateTo('/dashboard');
  } catch (error) {
    console.error('Failed to create party:', error);
    // You could add toast notification here
  }
};
</script>

<template>
  <Center>
    <Column>
      <VCard class="pa-6" max-width="400">
        <VCardTitle class="text-h4 text-center mb-6 text-primary">
          Start hosting a party!
        </VCardTitle>
        
        <ClientOnly>
          <template #default>
            <PartyForm @submit="onSubmit" />
          </template>
          <template #fallback>
            <div class="text-center text-body-2 text-medium-emphasis">
              Loading party form...
            </div>
          </template>
        </ClientOnly>
      </VCard>
    </Column>
  </Center>
</template>

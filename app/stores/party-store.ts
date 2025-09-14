import { defineStore } from "pinia";
import { ref } from "vue";

export interface PartyDetails {
  id: string;
  name: string;
  joinCode: string;
}

export const usePartyStore = defineStore('party', () => {
  const party = ref<PartyDetails | null>(null);
  const isLoading = ref(false);

  const setParty = (partyDetails: PartyDetails) => {
    party.value = partyDetails;
  };

  const clearParty = () => {
    party.value = null;
  };

  const fetchPartyDetails = async () => {
    if (party.value) {
      return party.value; // Already have party details
    }

    isLoading.value = true;
    try {
      const response = await $fetch<PartyDetails>('/api/party');
      party.value = response;
      return response;
    } catch (error) {
      console.error('Failed to fetch party details:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    party,
    isLoading,
    setParty,
    clearParty,
    fetchPartyDetails
  };
});

import { defineStore } from "pinia";
import { ref } from "vue";

export const useSingerStore = defineStore('singers', () => {
    const singers = ref<SingerDto[]>([]);
    const isLoading = ref(false);
    const isAutoFetching = ref(false);
    let fetchInterval: NodeJS.Timeout | null = null;

    const setSingers = (s: SingerDto[]) => {
        singers.value = s;
    };

    const fetchSingers = async () => {
        if (isLoading.value) return; // Prevent multiple simultaneous requests
        
        isLoading.value = true;
        try {
            const response = await $fetch('/api/singers');
            setSingers(response.singers);
        } catch (error) {
            console.error('Failed to fetch singers:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const startAutoFetch = () => {
        if (isAutoFetching.value) return; // Already running
        
        isAutoFetching.value = true;
        
        // Fetch immediately
        fetchSingers();
        
        // Then fetch every 10 seconds
        fetchInterval = setInterval(() => {
            fetchSingers();
        }, 10000);
    };

    const stopAutoFetch = () => {
        if (fetchInterval) {
            clearInterval(fetchInterval);
            fetchInterval = null;
        }
        isAutoFetching.value = false;
    };

    return {
        singers,
        isLoading,
        isAutoFetching,
        setSingers,
        fetchSingers,
        startAutoFetch,
        stopAutoFetch
    };
});
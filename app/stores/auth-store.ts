import { defineStore } from "pinia";
import { ref } from "vue";

export interface AuthState {
  authenticated: boolean;
  isAdmin: boolean;
  partyId: string | null;
  partyName: string | null;
  joinCode: string | null;
  sessionId: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  const authState = ref<AuthState>({
    authenticated: false,
    isAdmin: false,
    partyId: null,
    partyName: null,
    joinCode: null,
    sessionId: null,
  });

  const isLoading = ref(false);

  const setAuthState = (state: AuthState) => {
    authState.value = state;
  };

  const clearAuthState = () => {
    authState.value = {
      authenticated: false,
      isAdmin: false,
      partyId: null,
      partyName: null,
      joinCode: null,
      sessionId: null,
    };
  };

  const checkAuth = async (): Promise<AuthState> => {
    isLoading.value = true;
    try {
      const response = await $fetch('/api/auth/check') as any;
      const newState: AuthState = {
        authenticated: response.authenticated || false,
        isAdmin: response.isAdmin || false,
        partyId: response.partyId || null,
        partyName: response.partyName || null,
        joinCode: response.joinCode || null,
        sessionId: response.sessionId || null,
      };
      
      setAuthState(newState);
      return newState;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      clearAuthState();
      return authState.value;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      clearAuthState();
    }
  };

  return {
    authState,
    isLoading,
    setAuthState,
    clearAuthState,
    checkAuth,
    logout
  };
});

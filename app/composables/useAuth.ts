export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const checkAuthAndRedirect = async () => {
    const authState = await authStore.checkAuth();
    
    if (!authState.authenticated) {
      // User is not authenticated, redirect to join page
      await router.push('/join');
      return false;
    }
    
    return true;
  };

  const logoutAndRedirect = async () => {
    await authStore.logout();
    await router.push('/join');
  };

  return {
    authState: authStore.authState,
    isLoading: authStore.isLoading,
    checkAuth: authStore.checkAuth,
    checkAuthAndRedirect,
    logoutAndRedirect
  };
};

export default defineNuxtRouteMiddleware(async (to) => {
  const redirectPages = ['/', '/host', '/join'];

  if (!redirectPages.includes(to.path)) {
    return;
  }

  // Check authentication via server-side API call
  try {
    const response = await $fetch('/api/auth/check', {
      method: 'GET',
      server: true
    })

    if (response.authenticated) {
      if (response.isAdmin) {
        return navigateTo('/dashboard');
      } else {
        return navigateTo('/app');
      }
    }
  } catch (error) {
    return;
  }
});

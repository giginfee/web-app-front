export default defineNuxtRouteMiddleware((to, from) => {
  const currentUser = useCurrentUser();
  if (!currentUser.isAuthenticated) {
    return navigateTo("log-in");
  }
});

import { useCurrentUser } from "vuefire";

export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useCurrentUser();

  // Wait for auth state to be determined
  return new Promise((resolve) => {
    let unsubscribe: (() => void) | null = null;

    unsubscribe = watch(user, (currentUser) => {
      if (currentUser === undefined) {
        // Still loading
        return;
      }

      if (!currentUser && to.path !== "/login" && to.path !== "/register") {
        if (unsubscribe) unsubscribe();
        if (_from.path === "/register") resolve(navigateTo("/register"));
        resolve(navigateTo("/login"));
      }
      else {
        if (unsubscribe) unsubscribe();
        resolve(undefined);
      }
    }, { immediate: true });
  });
});

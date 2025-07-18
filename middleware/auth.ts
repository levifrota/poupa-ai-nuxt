import { getAuth } from '~/lib/firebase';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login');
  }
})

import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from '~/lib/firebase';
import type { RouteLocationNormalized } from 'vue-router';

const auth = getAuth();

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth,(user) => {
      if (!user && to.path !== '/login' && to.path !== '/register') {
        return navigateTo('/login');
      } else {
        resolve(user)
      }
    })
  }).then((user) => {
    if (!user) {
      return navigateTo('/login');
    }
  })

})

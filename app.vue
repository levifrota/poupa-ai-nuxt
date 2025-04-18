<script setup>
import { Button } from '@/app/_components/ui/button'
import { db } from './lib/firebase';
import { collection, getDocs } from "firebase/firestore"; 
import { ref } from 'vue'

const users = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    console.log('Fetching users from Firestore...')
    const querySnapshot = await getDocs(collection(db, "users", "user_2rSVhqngUjGL0zVLiBXfXixKAG3", "transactions"));
    
    if (querySnapshot.empty) {
      console.warn('No users found in Firestore collection')
    } else {
      console.log(`Found ${querySnapshot.size} users`)
    }
    
    querySnapshot.forEach((doc) => {
      console.log('User document:', doc.id, doc.data())
      users.value.push({ 
        id: doc.id, 
        ...doc.data(),
        // Add transactions if they exist at root level
        transactions: doc.data().transactions || [] 
      });
    });
  } catch (err) {
    console.error('Firestore error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
});

</script>

<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->

    <div v-if="loading">Loading users...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error }}</div>
    <div v-else>
      <h2>Users ({{ users.length }})</h2>
      <div v-for="user in users" :key="user.id" class="mb-4 p-2 border">
        <h3>User ID: {{ user.id }}</h3>
        <pre>{{ JSON.stringify(user, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

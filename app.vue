<script setup lang="ts">
import { ref } from 'vue'
import { getDashboard } from '@/data/get-dashboard'

const month = 3 // Março
const loading = ref(false)
const dashboard = ref<any>(null)
const error = ref('')

const loadDashboard = async () => {
  loading.value = true
  error.value = ''
  try {
    const result = await getDashboard(month)
    dashboard.value = result
  } catch (err: any) {
    error.value = 'Erro ao buscar dashboard'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <button
      @click="loadDashboard"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Carregar Dashboard
    </button>

    <div v-if="loading">Carregando...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <pre v-if="dashboard" class="bg-gray-100 p-4 rounded overflow-auto text-sm">
      {{ dashboard }}
    </pre>
  </div>
</template>

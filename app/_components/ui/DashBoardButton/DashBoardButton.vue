<template>
  <div class="flex flex-col items-center justify-center p-6">
    <Button @click="loadDashboard">Carregar Dashboard</Button>

    <div v-if="loading" class="mt-4 text-sm text-gray-500">Carregando...</div>

    <div v-if="error" class="mt-4 text-sm text-red-500">{{ error }}</div>

    <pre v-if="dashboard" class="mt-6 w-full max-w-2xl overflow-auto text-left text-sm bg-gray-100 p-4 rounded-md">
      {{ dashboard }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { getDashboard } from '@/lib/getDashboard'

const loading = ref(false)
const error = ref('')
const dashboard = ref('')

const loadDashboard = async () => {
  loading.value = true
  error.value = ''
  dashboard.value = ''

  try {
    const result = await getDashboard('4')
    dashboard.value = JSON.stringify(result, null, 2)
  } catch (err: any) {
    console.error(err)
    error.value = 'Erro ao carregar dashboard'
  } finally {
    loading.value = false
  }
}
</script>

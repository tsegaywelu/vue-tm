<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Add Region</h1>
    <RegionForm
      :loading="mutation.isPending.value"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import RegionForm from '../../components/settings/Region/RegionForm.vue'
import { create_region } from '../../api/region.api'
import { useToastStore } from '@/store/toastStore'

const router = useRouter()
const toast = useToastStore()

const mutation = useMutation({
  mutationFn: create_region,
  onSuccess: (res) => {
    if (res.success) {
      toast.success('Region created successfully')
      router.push('/setting/region')
    } else {
      toast.error(res.error || 'Failed to create region')
    }
  },
  onError: (error: any) => {
    toast.error(error.message || 'An unexpected error occurred')
  },
})

const onSubmit = (data: any) => {
  mutation.mutate(data)
}
</script>

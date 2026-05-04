<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Edit Region</h1>
    <div v-if="isLoading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    <RegionForm
      v-else-if="region"
      :initial-data="region"
      :loading="mutation.isPending.value"
      is-edit
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@tanstack/vue-query'
import RegionForm from '../../components/settings/Region/RegionForm.vue'
import { fetch_region_details, update_region } from '../../api/region.api'
import { useToastStore } from '@/store/toastStore'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const id = route.params.id as string

const { data: region, isLoading } = useQuery({
  queryKey: ['region', id],
  queryFn: () => fetch_region_details(id).then(res => res.data),
  enabled: !!id,
})

const mutation = useMutation({
  mutationFn: (data: any) => update_region(id, data),
  onSuccess: (res) => {
    if (res.success) {
      toast.success('Region updated successfully')
      router.push('/setting/region')
    } else {
      toast.error(res.error || 'Failed to update region')
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

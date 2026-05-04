<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FloatingInput
        v-model="form.name"
        label="Name"
        required
      />

      <FloatingInput
        v-model.number="form.odometerRouteToleranceKilometer"
        label="Odometer route tolerance (km)"
        type="number"
      />
    </div>

    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <input
          id="notificationEnabled"
          v-model="form.notificationEnabled"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label for="notificationEnabled" class="text-sm text-gray-700">
          Enable SMS/Notification for this region
        </label>
      </div>

      <div class="flex items-center gap-2">
        <input
          id="enforceOdometerRouteTolerance"
          v-model="form.enforceOdometerRouteTolerance"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label for="enforceOdometerRouteTolerance" class="text-sm text-gray-700">
          Enforce odometer vs route distance tolerance
        </label>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <Button
        type="button"
        variant="secondary"
        @click="router.back()"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        :loading="loading"
      >
        {{ isEdit ? 'Update' : 'Create' }} Region
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import FloatingInput from '@/components/form/FloatingInput.vue'
import Button from '@/components/Button.vue'
import type { Region } from '../../operation.types'

const props = defineProps<{
  initialData?: Partial<Region>
  loading?: boolean
  isEdit?: boolean
}>()

const emit = defineEmits(['submit'])
const router = useRouter()

const form = reactive({
  name: props.initialData?.name || '',
  notificationEnabled: props.initialData?.notificationEnabled || false,
  enforceOdometerRouteTolerance: props.initialData?.enforceOdometerRouteTolerance || false,
  odometerRouteToleranceKilometer: props.initialData?.odometerRouteToleranceKilometer ?? 200,
})

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

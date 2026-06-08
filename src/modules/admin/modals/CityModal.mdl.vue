<template>
  <FormModalParent
    :title="city ? 'Edit City' : 'Add City'"
    :subtitle="city ? `Updating ${city.name}` : 'Create a new city'"
    form-id="cityForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-5">
        <div class="grid grid-cols-2 gap-4">
          <Input
            name="name"
            label="City Name"
            :attributes="{ placeholder: 'e.g. Addis Ababa' }"
            :validation="{ required }"
          />
          <Input
            name="nameAm"
            label="Amharic Name"
            :attributes="{ placeholder: 'e.g. አዲስ አበባ' }"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input
            name="latitude"
            label="Latitude"
            :attributes="{ placeholder: 'e.g. 9.0249', type: 'number', step: 'any' }"
            :validation="{ required, number }"
          />
          <Input
            name="longitude"
            label="Longitude"
            :attributes="{ placeholder: 'e.g. 38.7469', type: 'number', step: 'any' }"
            :validation="{ required, number }"
          />
        </div>

        <div class="flex items-center gap-3">
          <ToggleInput name="isActive" />
          <span class="text-sm font-medium text-grey-700">Active</span>
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" size="md" @click="closeModal(null)">
          Cancel
        </Button>
        <SubmitButton>
          {{ city ? "Update City" : "Add City" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required, number } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { create_city, update_city } from "@/modules/operation/api/city.api";

const props = defineProps<{
  data?: { city?: any };
  close: (res: any) => void;
}>();

const toast = useToastStore();
const city = computed(() => props.data?.city);

const initialValues = computed(() => ({
  name: city.value?.name ?? "",
  nameAm: city.value?.nameAm ?? "",
  latitude: city.value?.gpsLocation?.latitude ?? "",
  longitude: city.value?.gpsLocation?.longitude ?? "",
  isActive: city.value?.isActive ?? true,
}));

const createMutation = useMutation({ mutationFn: (data: any) => create_city(data) });
const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) => update_city(id, data),
});

async function handleSubmit(values: any) {
  const payload = {
    name: values.name,
    nameAm: values.nameAm,
    isActive: values.isActive,
    gpsLocation: {
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    },
  };

  if (city.value) {
    const res: any = await updateMutation.mutateAsync({ id: city.value._id, data: payload });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("City updated successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to update city");
    }
  } else {
    const res: any = await createMutation.mutateAsync(payload);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("City added successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to add city");
    }
  }
}
</script>

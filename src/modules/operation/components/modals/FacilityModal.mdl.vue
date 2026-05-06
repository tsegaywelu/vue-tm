<template>
  <FormModalParent
    :title="facility ? 'Edit Facility' : 'Add New Facility'"
    :subtitle="facility ? 'Update facility details' : 'Add a new facility to a shipper'"
    form-id="facility-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialFormValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-4">
        <div>
          <SelectInput
            name="shipper"
            label="Shipper"
            :options="shipperOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select shipper' }"
          />
        </div>
        <div>
          <Input
            name="name"
            label="Facility Name"
            :validation="{ required }"
            placeholder="e.g. Warehouse A"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <SelectInput
            name="region"
            label="Region"
            :options="regionOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select region' }"
          />
          <Input
            name="city"
            label="City"
            :validation="{ required }"
            placeholder="e.g. Addis Ababa"
          />
        </div>
      </div>
    </template>
    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal(false)">
          Cancel
        </Button>
        <SubmitButton>
          {{ facility ? "Update" : "Create" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { usePagination } from "@/composables/usePagination";
import { add_facility, update_facility } from "../../api/operation.api";
import { useMutation } from "@tanstack/vue-query";

const props = defineProps<{ data?: { facility?: any } }>();

const facility = computed(() => props.data?.facility);

const initialFormValues = computed(() => {
  if (facility.value) {
    return {
      shipper: facility.value.shipper?._id || facility.value.shipper || "",
      name: facility.value.name || "",
      region: facility.value.location?.region || "",
      city: facility.value.location?.city || "",
    };
  }
  return {
    shipper: "",
    name: "",
    region: "",
    city: "",
  };
});

const { response: shippersResponse } = usePagination({
  id: "shippers-list-for-facility",
  url: "/shipper",
  limit: 100,
});

const shipperOptions = computed(() => {
  if (!shippersResponse.value) return [];
  return (shippersResponse.value || []).map((s: any) => ({
    label: s.name,
    value: s._id,
  }));
});

const regionOptions = [
  { label: "Addis Ababa", value: "Addis Ababa" },
  { label: "Afar", value: "Afar" },
  { label: "Amhara", value: "Amhara" },
  { label: "Benishangul-Gumuz", value: "Benishangul-Gumuz" },
  { label: "Dire Dawa", value: "Dire Dawa" },
  { label: "Gambela", value: "Gambela" },
  { label: "Harari", value: "Harari" },
  { label: "Oromia", value: "Oromia" },
  { label: "Sidama", value: "Sidama" },
  { label: "Somali", value: "Somali" },
  {
    label: "Southern Nations, Nationalities, and Peoples' Region (SNNPR)",
    value: "Southern Nations, Nationalities, and Peoples' Region (SNNPR)",
  },
  { label: "Tigray", value: "Tigray" },
];

const toast = useToastStore();

const createMutation = useMutation({
  mutationFn: add_facility,
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) => update_facility(id, data),
});

const handleSubmit = async (values: any) => {
  const payload = {
    name: values.name,
    shipper: values.shipper,
    location: {
      region: values.region,
      city: values.city,
    },
  };

  if (facility.value) {
    const res = await updateMutation.mutateAsync({
      id: facility.value._id,
      data: payload,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Facility updated successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to update facility");
    }
  } else {
    const res = await createMutation.mutateAsync(payload);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Facility created successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to create facility");
    }
  }
};
</script>

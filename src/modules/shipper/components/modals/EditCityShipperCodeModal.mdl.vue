<template>
  <FormModalParent
    title="Edit City Shipper Code"
    subtitle="Update the custom origin/destination codes for this city"
    form-id="edit-city-shipper-code-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="formValues"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <SelectInput
          name="city"
          label="City"
          url="/city"
          value_key="_id"
          label_key="name"
          :display_label_fn="(c: any) => c.code || c.name"
          :initial_labels="cityInitialLabels"
          searchable
          :validation="{ required }"
          :attributes="{ placeholder: 'Select city' }"
        />
        <SelectInput
          name="shipper"
          label="Shipper"
          url="/shipper/contractedShippers"
          :value_key="(item: any) => item.shipper?._id"
          :label_key="(item: any) => item.shipper?.name"
          :initial_labels="shipperInitialLabels"
          searchable
          :validation="{ required }"
          :attributes="{ placeholder: 'Select shipper' }"
        />
        <div class="grid grid-cols-2 gap-4">
          <Input
            name="originCode"
            label="Origin Code"
            :validation="{ required }"
            :attributes="{ placeholder: 'e.g. ADD' }"
          />
          <Input
            name="destinationCode"
            label="Destination Code"
            :validation="{ required }"
            :attributes="{ placeholder: 'e.g. AADC' }"
          />
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal(false)">Cancel</Button>
        <SubmitButton>Save Changes</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { update_city_shipper_code } from "../../api/city-shipper-code.api";

const props = defineProps<{ data?: { item?: any } }>();
const item = computed(() => props.data?.item);

const toast = useToastStore();
const queryClient = useQueryClient();

const cityInitialLabels = computed(() => {
  const city = item.value?.city;
  if (!city?._id) return {};
  return { [city._id]: city.code || city.name };
});

const shipperInitialLabels = computed(() => {
  const shipper = item.value?.shipper;
  if (!shipper?._id) return {};
  return { [shipper._id]: shipper.name };
});

const formValues = ref({
  city: "",
  shipper: "",
  originCode: "",
  destinationCode: "",
});

onMounted(() => {
  nextTick(() => {
    formValues.value = {
      city: item.value?.city?._id || "",
      shipper: item.value?.shipper?._id || "",
      originCode: item.value?.originCode || "",
      destinationCode: item.value?.destinationCode || "",
    };
  });
});

const mutation = useMutation({
  mutationFn: (values: any) =>
    update_city_shipper_code(
      item.value?.shipper?._id || item.value?.shipper,
      item.value?._id,
      values,
    ),
});

const handleSubmit = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("City shipper code updated successfully");
    queryClient.invalidateQueries({ queryKey: ["city-shipper-codes"] });
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to update city shipper code");
  }
};
</script>

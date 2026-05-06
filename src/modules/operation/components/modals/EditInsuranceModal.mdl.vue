<template>
  <FormModalParent
    title="Edit Insurance"
    subtitle="Update the details of an existing insurance record."
    form-id="editInsuranceForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            name="insurer"
            label="Insurer"
            url="/insurance-provider"
            label_key="name"
            value_key="_id"
            :validation="{ required }"
          />
          <SelectInput
            name="vehicle"
            label="Vehicle"
            url="/vehicle"
            label_key="plateNumber"
            value_key="_id"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput
            name="prePaymentDate"
            label="Pre Payment Date"
            :validation="{ required }"
          />
          <DateInput
            name="prePaymentMatureDate"
            label="Pre Payment Mature Date"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="JV"
            label="JV"
            :attributes="{ placeholder: 'Enter JV' }"
          />
          <Input
            name="CPV"
            label="CPV"
            :attributes="{ placeholder: 'Enter CPV' }"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="withHoldTax"
            label="Withhold Tax"
            type="number"
            :attributes="{ placeholder: '0.00', step: '0.01' }"
            :validation="{ required, number }"
          />
          <Input
            name="total"
            label="Total"
            type="number"
            :attributes="{ placeholder: '0.00', step: '0.01' }"
            :validation="{ required, number }"
          />
        </div>

        <InsuranceCategoryInput name="insuranceCategoryAmount" />

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Insurance Documents</label>
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @click="triggerFileInput"
            class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group"
            :class="{ 'border-primary bg-primary/5': isDragging }"
          >
            <input
              type="file"
              class="hidden"
              ref="fileInput"
              multiple
              @change="handleFileChange"
            />
            
            <div v-if="files.length === 0 && !hasExistingDocuments" class="flex flex-col items-center gap-2">
              <div class="size-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <i class="mdi mdi-cloud-upload-outline text-xl text-gray-400 group-hover:text-primary"></i>
              </div>
              <p class="text-xs text-gray-500">
                <span class="font-bold text-primary">Click to upload</span> or drag and drop
              </p>
            </div>

            <div v-else class="w-full space-y-2">
              <!-- Existing documents (just showing count or names, handle if backend supports delete) -->
              <div v-if="hasExistingDocuments" class="text-xs text-gray-500 mb-2">
                Existing documents will be replaced by new uploads if provided.
              </div>
              <div
                v-for="(file, index) in files"
                :key="index"
                class="flex items-center justify-between bg-white p-2 px-3 rounded-lg border border-gray-100 shadow-sm"
              >
                <div class="flex items-center gap-2 overflow-hidden">
                  <i class="mdi mdi-file-document-outline text-primary"></i>
                  <span class="text-xs font-medium text-gray-700 truncate">{{ file.name }}</span>
                </div>
                <button
                  @click.stop="removeFile(index)"
                  class="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                >
                  <i class="mdi mdi-close"></i>
                </button>
              </div>
              
              <div v-if="files.length > 0" class="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                 <p class="text-xs text-gray-500">
                  <span class="font-bold text-primary">Click to add more</span> or drag and drop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="editInsuranceForm"
          :loading="form.state.isSubmitting"
        >
          Update Insurance
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required, number } from "@/utils/validations";
import { update_insurance } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import InsuranceCategoryInput from "../inputs/InsuranceCategoryInput.vue";

const props = defineProps<{
  data: { insurance: any; onSuccess: () => void };
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const files = ref<File[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const parseCategories = (categories: any) => {
  try {
    if (typeof categories === 'string') {
      return JSON.parse(categories);
    }
    return categories || [];
  } catch (e) {
    return [];
  }
};

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const initialValues = {
  insurer: props.data.insurance.insurer?._id || props.data.insurance.insurer,
  vehicle: props.data.insurance.vehicle?._id || props.data.insurance.vehicle,
  prePaymentDate: formatDateForInput(props.data.insurance.prePaymentDate),
  prePaymentMatureDate: formatDateForInput(props.data.insurance.prePaymentMatureDate),
  JV: props.data.insurance.JV || "",
  CPV: props.data.insurance.CPV || "",
  withHoldTax: props.data.insurance.withHoldTax || 0,
  total: props.data.insurance.total || 0,
  insuranceCategoryAmount: parseCategories(props.data.insurance.insuranceCategoryAmount),
};

const hasExistingDocuments = computed(() => {
  return props.data.insurance.insuranceDocuments && props.data.insurance.insuranceDocuments.length > 0;
});

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    files.value.push(...Array.from(target.files));
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    files.value.push(...Array.from(e.dataTransfer.files));
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
};

const handleSubmit = async (values: any) => {
  const formData = new FormData();
  formData.append("insurer", values.insurer);
  formData.append("vehicle", values.vehicle);
  formData.append("prePaymentDate", values.prePaymentDate);
  formData.append("prePaymentMatureDate", values.prePaymentMatureDate);
  if (values.JV) formData.append("JV", values.JV);
  formData.append("CPV", values.CPV);
  formData.append("withHoldTax", values.withHoldTax);
  formData.append("total", values.total);

  // Convert array to string as per legacy pattern
  const categories = (values.insuranceCategoryAmount || []).map((c: any) => ({
    type: c.type,
    amount: Number(c.amount)
  }));
  formData.append("insuranceCategoryAmount", JSON.stringify(categories));

  if (files.value.length > 0) {
    files.value.forEach((file) => {
      formData.append("insuranceDocuments", file);
    });
  }

  try {
    const res = await update_insurance(props.data.insurance._id, formData);
    if (res.status === 200 || res.status === 201) {
      toast.success("Insurance updated successfully");
      props.data.onSuccess();
      props.close(true);
    } else {
      toast.error("Failed to update insurance");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.description || "An error occurred");
  }
};
</script>

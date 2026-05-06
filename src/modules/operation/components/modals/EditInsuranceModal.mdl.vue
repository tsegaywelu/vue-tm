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

        <FileInput
          name="insuranceDocuments"
          label="Insurance Documents"
          multiple
        />
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
import FileInput from "@/components/form/FileInput.vue";
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
  insuranceCategoryAmount: parseCategories(
    props.data.insurance.insuranceCategoryAmount,
  ),
  insuranceDocuments: (props.data.insurance.insuranceDocuments || []).map(
    (doc: any) =>
      typeof doc === "string"
        ? `${import.meta.env.VITE_API_URL}/${doc.replace(/\\/g, "/")}`
        : doc,
  ),
};


const triggerFileInput = () => {
  // Logic handled by component
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

  if (values.insuranceDocuments && values.insuranceDocuments.length > 0) {
    values.insuranceDocuments.forEach((file: any) => {
      if (file instanceof File) {
        formData.append("insuranceDocuments", file);
      }
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

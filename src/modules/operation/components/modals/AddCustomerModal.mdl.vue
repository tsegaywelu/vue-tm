<template>
  <FormModalParent
    :title="customerData ? 'Edit Customer' : 'Add New Customer'"
    :subtitle="customerData ? 'Update customer account' : 'Register a new customer account'"
    form-id="addCustomerForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialFormValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-4">
        <!-- Logo Image Picker -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-grey-700">Logo</label>
          <div class="flex items-center gap-4">
            <div class="size-20 bg-grey-50 rounded-2xl border border-dashed border-grey-200 flex items-center justify-center overflow-hidden">
              <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-cover" />
              <i v-else class="mdi mdi-image-plus text-3xl text-grey-400"></i>
            </div>
            <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleLogoChange" />
            <Button size="sm" variant="outline" @click="triggerFileInput">Choose File</Button>
          </div>
        </div>

        <!-- Two columns for personal / company info -->
        <div class="grid grid-cols-2 gap-4">
          <Input name="name" label="Customer Name" :validation="{ required }" placeholder="Full Name" />
          <Input name="tradeName" label="Trade Name" :validation="{ required }" placeholder="Trade Name" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <Input name="phone" label="Phone" :validation="{ required }" placeholder="911223344" />
          <Input name="email" label="Email" placeholder="customer@example.com" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <Input name="shipperCode" label="Customer Code" :validation="{ required }" placeholder="Code" />
          <Input name="address" label="Address" :validation="{ required }" placeholder="Addis Ababa" />
        </div>
        <div>
          <Input name="tin" label="TIN" placeholder="123456789" />
        </div>

        <!-- Representatives Section -->
        <div class="border-t border-grey-100 pt-4 mt-2">
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-bold text-grey-700">Representatives (Optional)</label>
            <Button size="sm" variant="outline" @click="addRepPhone">+ Add Phone</Button>
          </div>
          <div class="flex flex-col gap-2">
            <div v-for="(rep, idx) in repPhones" :key="idx" class="flex items-center gap-2">
              <CommonInput
                v-model="repPhones[idx]"
                placeholder="e.g. 911223344"
                class="flex-1"
                type="text"
              />
              <Button size="sm" variant="outline" class="text-red-500!" @click="removeRepPhone(idx)">Remove</Button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal(false)">Cancel</Button>
        <SubmitButton>Submit</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import CommonInput from "@/components/common/Input.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const props = defineProps<{ data?: any }>();

const customerData = computed(() => props.data?.customer);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialFormValues = computed(() => {
  if (customerData.value) {
    return {
      name: customerData.value.name || "",
      tradeName: customerData.value.tradeName || "",
      phone: customerData.value.phone?.replace(/^\+251/, "") || "",
      email: customerData.value.email || "",
      shipperCode: customerData.value.shipperCode || customerData.value.customerCode || "",
      address: customerData.value.address || "",
      tin: customerData.value.tin || "",
    };
  }
  return {
    name: "",
    tradeName: "",
    phone: "",
    shipperCode: "",
    address: "",
    email: "",
    tin: "",
  };
});

const fileInput = ref<HTMLInputElement | null>(null);
const logoFile = ref<File | null>(null);
const logoPreview = ref<string | null>(null);
const repPhones = ref<string[]>([]);

const toast = useToastStore();
const api = new ApiService();

onMounted(() => {
  if (customerData.value) {
    if (customerData.value.logo) {
      logoPreview.value = `${API_URL}/${customerData.value.logo.replace(/\\/g, "/")}`;
    }
    if (customerData.value.phoneNumbers) {
      repPhones.value = customerData.value.phoneNumbers.map((num: string) => num.replace(/^\+251/, ""));
    }
  }
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    logoFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const addRepPhone = () => {
  repPhones.value.push("");
};

const removeRepPhone = (idx: number) => {
  repPhones.value.splice(idx, 1);
};

const handleSubmit = async (values: any) => {
  try {
    const fullPhoneNumber = values.phone.startsWith("+") ? values.phone : `+251${values.phone}`;
    const formData = new FormData();

    if (values.tin) formData.append("tin", values.tin);
    formData.append("name", values.name);
    formData.append("tradeName", values.tradeName);
    formData.append("phone", fullPhoneNumber);
    if (values.email) formData.append("email", values.email);
    formData.append("shipperCode", values.shipperCode);
    formData.append("address", values.address);

    if (logoFile.value) {
      formData.append("logo", logoFile.value);
    }

    repPhones.value.forEach((num, index) => {
      if (num && num.trim() !== "") {
        const formattedNumber = num.startsWith("+251") ? num : `+251${num}`;
        formData.append(`phoneNumbers[${index}]`, formattedNumber);
      }
    });

    let res;
    if (customerData.value) {
      // Edit mode (PATCH)
      res = await api
        .addAuthenticationHeader()
        .patch(`/shipper/${customerData.value._id}`, formData);
    } else {
      // Create mode (POST)
      res = await api
        .addAuthenticationHeader()
        .post("/shipper", formData);
    }

    if (res.success || res.status === 200 || res.status === 201) {
      toast.success(customerData.value ? "Customer updated successfully!" : "Customer added successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to submit customer");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.description || "An error occurred");
  }
};
</script>

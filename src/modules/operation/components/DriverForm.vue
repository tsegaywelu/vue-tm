<template>
  <Form :id="formId" :values="normalizedValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <!-- 1. Personal Information -->
      <Colapsable
        title="Personal Information"
        description="Driver's personal details and emergency contact."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="firstName"
            label="First Name"
            :validation="{ required }"
            :attributes="{ placeholder: 'Enter first name' }"
          />

          <Input
            name="middleName"
            label="Middle Name"
            :attributes="{ placeholder: 'Enter middle name' }"
            :validation="{ required }"
          />

          <Input
            name="lastName"
            label="Last Name"
            :attributes="{ placeholder: 'Enter last name' }"
          />

          <DateInput
            name="dateOfBirth"
            label="Date of Birth"
            :attributes="{ placeholder: 'Select date of birth' }"
            :validation="{ dateLessThanOrEqalToToday }"
          />

          <Input
            name="phoneNumber"
            label="Phone Number"
            :validation="{ required }"
            :attributes="{ placeholder: 'Enter phone number' }"
          />

          <Input
            name="email"
            label="Email Address"
            :attributes="{ placeholder: 'Enter email address' }"
          />

          <SelectInput
            name="gender"
            label="Gender"
            :options="[
              { label: 'Male', value: 'MALE' },
              { label: 'Female', value: 'FEMALE' },
            ]"
            label_key="label"
            value_key="value"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select gender' }"
          />

          <SelectInput
            name="region"
            label="Region"
            url="/region/myRegions"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select region' }"
            :options="
              props.initialValues.region?.name
                ? [{ label: props.initialValues.region.name, value: props.initialValues.region._id }]
                : props.labels?.region
                  ? [{ label: props.labels.region, value: props.initialValues.region }]
                  : []
            "
          />
        </div>
      </Colapsable>

      <!-- 2. Emergency Contact -->
      <Colapsable
        title="Emergency Contact"
        description="Emergency contact person's details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="contactPerson.name"
            label="Contact Person Name"
            :attributes="{ placeholder: 'Enter contact name' }"
          />

          <Input
            name="contactPerson.phone"
            label="Contact Person Phone"
            :attributes="{ placeholder: 'Enter contact phone' }"
          />

          <Input
            name="contactPerson.address"
            label="Contact Person Address"
            :attributes="{ placeholder: 'Enter contact address' }"
          />
        </div>
      </Colapsable>

      <!-- 3. Professional & Employment Information -->
      <Colapsable
        title="Employment Information"
        description="Employment details and driver status."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToggleInput name="isEmployed" label="Is Employee?" />

          <Input
            name="employeeNumber"
            label="Employee Number"
            :attributes="{ placeholder: 'e.g. EMP-001' }"
          />

          <DateInput
            name="employmentStartDate"
            label="Employment Start Date"
            :attributes="{ placeholder: 'Select start date' }"
          />

          <DateInput
            name="employmentEndDate"
            label="Employment End Date"
            :attributes="{ placeholder: 'Select end date' }"
          />

          <SelectInput
            name="driverStatus"
            label="Driver Status"
            :options="[
              { label: 'Ready to Dispatch', value: 'ready_to_dispatch' },
              { label: 'Dispatched', value: 'dispatched' },
              { label: 'Vehicle Not Assigned', value: 'vehicle_not_assigned' },
              { label: 'Unavailable', value: 'unavailable' },
              { label: 'Suspended', value: 'suspended' },
              { label: 'Terminated', value: 'terminated' },
              { label: 'Fired', value: 'fired' },
            ]"
            label_key="label"
            value_key="value"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select driver status' }"
          />
        </div>
      </Colapsable>

      <!-- 4. License & Identification -->
      <Colapsable
        title="License & Identification"
        description="Credentials and cross-border identity."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="driverLicenceNumber"
            label="License Number"
            :validation="{ required }"
            :attributes="{ placeholder: 'Enter license number' }"
          />

          <DateInput
            name="drivingLicenceExpirationDate"
            label="License Expiration Date"
            :attributes="{ placeholder: 'Select expiration date' }"
          />

          <Input
            name="tin"
            label="TIN Number"
            :attributes="{ placeholder: 'Enter TIN' }"
          />

          <Input
            name="djiboutiEntranceId"
            label="Djibouti Entrance ID"
            :attributes="{ placeholder: 'Enter Djibouti ID' }"
          />

          <DateInput
            name="djiboutiEntranceIdExpirationDate"
            label="Djibouti ID Expiration Date"
            :attributes="{ placeholder: 'Select Djibouti ID expiration date' }"
          />
        </div>
      </Colapsable>

      <!-- 5. Educational Background -->
      <Colapsable
        title="Educational Background"
        description="Add driver's education records."
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="(edu, index) in educationalBackground"
            :key="index"
            class="p-4 bg-grey-50 rounded-xl border border-grey-100 grid grid-cols-1 md:grid-cols-4 gap-4 relative"
          >
            <BaseSelect
              v-model="edu.type"
              label="Certification/Degree"
              :options="[
                { label: 'Elementary', value: 'ELEMENTARY' },
                { label: 'High School', value: 'HIGH_SCHOOL' },
                { label: 'Preparatory', value: 'PREPARATORY' },
                { label: 'Technical', value: 'TECHNICAL' },
                { label: 'Diploma', value: 'DIPLOMA' },
                { label: 'Vocational', value: 'VOCATIONAL' },
                { label: 'Bachelors', value: 'BACHELORS' },
                { label: 'Masters', value: 'MASTERS' },
                { label: 'Doctorate', value: 'DOCTORATE' },
              ]"
            />

            <BaseInput
              v-model="edu.institutionName"
              label="Institution Name"
              :attributes="{ placeholder: 'e.g. University Name' }"
            />

            <BaseInput v-model="edu.startDate" label="Start Date" type="date" />

            <BaseInput v-model="edu.endDate" label="End Date" type="date" />

            <button
              v-if="educationalBackground.length > 1"
              type="button"
              class="absolute size-5 top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center font-bold"
              @click="removeEdu(index)"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            class="mt-2 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs self-start"
            @click="addEdu"
          >
            <i class="mdi mdi-plus-circle-outline text-lg"></i>
            Add Education Item
          </button>
        </div>
      </Colapsable>

      <!-- 6. Work Experience -->
      <Colapsable
        title="Work Experience"
        description="Add driver's employment history."
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="(work, index) in workExperience"
            :key="index"
            class="p-4 bg-grey-50 rounded-xl border border-grey-100 grid grid-cols-1 md:grid-cols-4 gap-4 relative"
          >
            <BaseInput
              v-model="work.position"
              label="Position"
              :attributes="{ placeholder: 'e.g. Heavy Truck Driver' }"
            />

            <BaseInput
              v-model="work.companyName"
              label="Company Name"
              :attributes="{ placeholder: 'e.g. Logistics Ltd.' }"
            />

            <BaseInput
              v-model="work.startDate"
              label="Start Date"
              type="date"
            />

            <BaseInput v-model="work.endDate" label="End Date" type="date" />

            <button
              v-if="workExperience.length > 1"
              type="button"
              class="absolute size-5 top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center font-bold"
              @click="removeWork(index)"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            class="mt-2 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs self-start"
            @click="addWork"
          >
            <i class="mdi mdi-plus-circle-outline text-lg"></i>
            Add Work Experience
          </button>
        </div>
      </Colapsable>

      <!-- 7. Bank Account Information -->
      <Colapsable
        title="Bank Account Information"
        description="Driver's bank account details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="bankAccount.bank"
            label="Bank Name"
            :attributes="{ placeholder: 'e.g. Commercial Bank of Ethiopia' }"
          />

          <Input
            name="bankAccount.accountNumber"
            label="Account Number"
            :attributes="{ placeholder: 'Enter account number' }"
          />
        </div>
      </Colapsable>

      <!-- 8. Document Uploads -->
      <Colapsable
        title="Document Uploads"
        description="Upload driver files and identity documents."
      >
        <FileInput name="driverDocuments" label="Driver Documents" multiple />
      </Colapsable>

      <div class="pt-10 flex justify-end gap-4">
        <slot name="actions" :form="form"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import Button from "@/components/common/Button.vue";
import BaseInput from "@/components/common/Input.vue";
import BaseSelect from "@/components/common/Select.vue";
import FileInput from "@/components/form/FileInput.vue";
import { dateLessThanOrEqalToToday, required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  labels?: Record<string, string>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const normalizedValues = computed(() => ({
  ...props.initialValues,
  region: props.initialValues.region?._id || props.initialValues.region || "",
}));

const educationalBackground = ref<any[]>([
  { type: "", institutionName: "", startDate: "", endDate: "" },
]);

const workExperience = ref<any[]>([
  { position: "", companyName: "", startDate: "", endDate: "" },
]);

// Initialize arrays on edit mode
watch(
  () => props.initialValues,
  (newVal) => {
    if (newVal?.educationalBackground?.length) {
      educationalBackground.value = newVal.educationalBackground.map(
        (el: any) => ({
          ...el,
          startDate: el.startDate
            ? new Date(el.startDate).toISOString().split("T")[0]
            : "",
          endDate: el.endDate
            ? new Date(el.endDate).toISOString().split("T")[0]
            : "",
        }),
      );
    }
    if (newVal?.workExperience?.length) {
      workExperience.value = newVal.workExperience.map((el: any) => ({
        ...el,
        startDate: el.startDate
          ? new Date(el.startDate).toISOString().split("T")[0]
          : "",
        endDate: el.endDate
          ? new Date(el.endDate).toISOString().split("T")[0]
          : "",
      }));
    }
  },
  { immediate: true },
);

const addEdu = () => {
  educationalBackground.value.push({
    type: "",
    institutionName: "",
    startDate: "",
    endDate: "",
  });
};

const removeEdu = (index: number) => {
  educationalBackground.value.splice(index, 1);
};

const addWork = () => {
  workExperience.value.push({
    position: "",
    companyName: "",
    startDate: "",
    endDate: "",
  });
};

const removeWork = (index: number) => {
  workExperience.value.splice(index, 1);
};

const handleSubmit = (values: any) => {
  // Filter out any empty array items to prevent backend validation errors
  const filteredEdu = educationalBackground.value
    .filter(
      (edu) => edu.type && edu.institutionName && edu.startDate && edu.endDate,
    )
    .map((edu) => ({
      ...edu,
      startDate: new Date(edu.startDate).toISOString(),
      endDate: new Date(edu.endDate).toISOString(),
    }));

  const filteredWork = workExperience.value
    .filter(
      (work) =>
        work.position && work.companyName && work.startDate && work.endDate,
    )
    .map((work) => ({
      ...work,
      startDate: new Date(work.startDate).toISOString(),
      endDate: new Date(work.endDate).toISOString(),
    }));

  // Combine custom fields into a structured values object
  const payload: any = {
    ...values,
    educationalBackground: filteredEdu,
    workExperience: filteredWork,
    bankAccount: values.bankAccount || {},
  };

  // Only pass these array properties if they actually contain data
  if (filteredEdu.length === 0) delete payload.educationalBackground;
  if (filteredWork.length === 0) delete payload.workExperience;

  // Cleanup unwanted fields from payload
  delete payload.djiboutiEntranceId;
  delete payload.djiboutiEntranceIdExpirationDate;
  delete payload.djboutiEntranceId;
  delete payload.djboutiEntranceIdExpirationDate;
  if (payload.contactPerson) {
    delete payload.contactPerson.phone;
    delete payload.contactPerson.phoneNumber;
  }

  // Cleanup bank account fields
  if (
    payload.bankAccount &&
    !payload.bankAccount.bank &&
    !payload.bankAccount.accountNumber
  ) {
    delete payload.bankAccount;
  }

  if (values.driverDocuments && values.driverDocuments.length > 0) {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        if (typeof payload[key] === "object") {
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          formData.append(key, payload[key]);
        }
      }
    });

    values.driverDocuments.forEach((file: any) => {
      if (file instanceof File) {
        formData.append("driverDocuments", file);
      }
    });

    props.onSubmit(formData);
  } else {
    props.onSubmit(payload);
  }
};
</script>

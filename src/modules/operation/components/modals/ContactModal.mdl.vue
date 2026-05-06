<template>
  <FormModalParent
    :title="contact ? 'Edit Contact' : 'Add New Contact'"
    :subtitle="contact ? 'Update contact details' : 'Add a new contact profile'"
    form-id="contact-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialFormValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-4">
        <FileInput
          name="profilePicture"
          label="Profile Picture"
          imageOnly
          accept="image/*"
        />

        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Input
              name="name"
              label="Full Name"
              :validation="{ required }"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <Input
              name="email"
              label="Email"
              placeholder="e.g. john@example.com"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <Input
              name="phone"
              label="Phone"
              :validation="{ required }"
              placeholder="e.g. 0912345678"
            />
          </div>
          <div>
            <SelectInput
              name="group"
              label="Group"
              :options="groupOptions"
              :validation="{ required }"
              :attributes="{ placeholder: 'Select group' }"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <Input
              name="jobTitle"
              label="Job Title"
              placeholder="e.g. Driver Coordinator"
            />
          </div>
          <div>
            <Input
              name="employeeNumber"
              label="Employee Number"
              placeholder="e.g. EMP123"
            />
          </div>
        </div>

        <div>
          <Input name="dateOfBirth" label="Date of Birth" type="date" />
        </div>

        <!-- Hidden inputs based on form values using Subscribe -->
        <component
          :is="form.Subscribe"
          :selector="
            (state: any) => [state.values.group, state.values.loginAccess]
          "
        >
          <template #default="[group, loginAccess]">
            <!-- Driver Specifics -->
            <div
              v-if="group === 'DRIVER'"
              class="border border-grey-100 p-4 rounded-xl bg-grey-25 mt-2 flex flex-col gap-4"
            >
              <h4 class="font-bold text-grey-900 text-sm">
                Driver Specific Information
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    name="driverLicenceNumber"
                    label="Licence Number"
                    placeholder="e.g. DL12345"
                  />
                </div>
                <div>
                  <Input
                    name="drivingLicenceExpirationDate"
                    label="Licence Expiry Date"
                    type="date"
                  />
                </div>
              </div>
              <div>
                <SelectInput
                  name="driverType"
                  label="Driver Type"
                  :options="driverTypeOptions"
                  :attributes="{ placeholder: 'Select type' }"
                />
              </div>
            </div>

            <!-- Mechanic Specifics -->
            <div
              v-if="group === 'MECHANIC'"
              class="border border-grey-100 p-4 rounded-xl bg-grey-25 mt-2 flex flex-col gap-4"
            >
              <h4 class="font-bold text-grey-900 text-sm">
                Mechanic Specific Information
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    name="certification"
                    label="Certification"
                    placeholder="e.g. ASE Certified"
                  />
                </div>
                <div>
                  <Input
                    name="experience"
                    label="Experience (Years)"
                    type="number"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            </div>

            <!-- Login Access -->
            <div
              class="border border-grey-100 p-4 rounded-xl bg-grey-25 mt-2 flex flex-col gap-4"
            >
              <div class="flex items-center gap-2">
                <component :is="form.Field" name="loginAccess">
                  <template #default="{ field }">
                    <input
                      type="checkbox"
                      :id="field.name"
                      :name="field.name"
                      :checked="field.state.value"
                      @change="(e: any) => field.handleChange(e.target.checked)"
                      class="h-4 w-4 rounded border-grey-300 text-primary focus:ring-primary select-none cursor-pointer"
                    />
                  </template>
                </component>
                <label
                  for="loginAccess"
                  class="font-bold text-grey-700 text-sm select-none cursor-pointer"
                >
                  Enable User Login
                </label>
              </div>

              <div v-if="loginAccess" class="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    name="username"
                    label="Username"
                    :validation="{ required }"
                    placeholder="e.g. johndoe"
                  />
                </div>
                <div>
                  <Input
                    name="password"
                    label="Password"
                    type="password"
                    :validation="{ required }"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div v-if="group === 'OTHER'" class="col-span-2">
                  <SelectInput
                    name="role"
                    label="Role"
                    :options="roleOptions"
                    :validation="{ required }"
                    :attributes="{ placeholder: 'Select role' }"
                  />
                </div>
              </div>
            </div>
          </template>
        </component>
      </div>
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal(false)">
          Cancel
        </Button>
        <SubmitButton>
          {{ contact ? "Update" : "Create" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import FileInput from "@/components/form/FileInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { add_contact, update_contact } from "../../api/operation.api";
import { fetch_roles } from "../../api/settings.api";
import { useMutation, useQuery } from "@tanstack/vue-query";

const props = defineProps<{ data?: { contact?: any } }>();

const contact = computed(() => props.data?.contact);

const API_URL = import.meta.env.VITE_API_URL;

const triggerFileInput = () => {
  // Logic handled by component
};

const { data: rolesResponse } = useQuery({
  queryKey: ["roles"],
  queryFn: () => fetch_roles({ limit: 100 }),
});

const roleOptions = computed(() => {
  const rawRoles =
    rolesResponse.value?.data?.result || rolesResponse.value?.data || [];
  return Array.isArray(rawRoles)
    ? rawRoles.map((r: any) => ({ label: r.name, value: r._id }))
    : [];
});

const initialFormValues = computed(() => {
  if (contact.value) {
    return {
      name: contact.value.name || "",
      email: contact.value.email || "",
      phone: contact.value.phone || "",
      group: contact.value.group || "OTHER",
      jobTitle: contact.value.jobTitle || "",
      employeeNumber: contact.value.employeeNumber || "",
      dateOfBirth: contact.value.dateOfBirth
        ? contact.value.dateOfBirth.split("T")[0]
        : "",
      driverLicenceNumber: contact.value.driver?.driverLicenceNumber || "",
      drivingLicenceExpirationDate: contact.value.driver
        ?.drivingLicenceExpirationDate
        ? contact.value.driver.drivingLicenceExpirationDate.split("T")[0]
        : "",
      driverType: contact.value.driver?.driverType || "",
      certification: contact.value.mechanic?.certification || "",
      experience: contact.value.mechanic?.experience || "",
      loginAccess: contact.value.loginAccess || false,
      username: contact.value.username || "",
      password: "",
      role: contact.value.role || "",
      profilePicture: contact.value.profilePicture
        ? `${API_URL}/${contact.value.profilePicture.replace(/\\/g, "/")}`
        : null,
    };
  }
  return {
    name: "",
    email: "",
    phone: "",
    group: "OTHER",
    jobTitle: "",
    employeeNumber: "",
    dateOfBirth: "",
    driverLicenceNumber: "",
    drivingLicenceExpirationDate: "",
    driverType: "",
    certification: "",
    experience: "",
    loginAccess: false,
    username: "",
    password: "",
    role: "",
  };
});

const groupOptions = [
  { label: "Driver", value: "DRIVER" },
  { label: "Mechanic", value: "MECHANIC" },
  { label: "Other", value: "OTHER" },
];

const driverTypeOptions = [
  { label: "Long-haul", value: "long-haul" },
  { label: "Short-haul", value: "short-haul" },
];

const toast = useToastStore();

const createMutation = useMutation({
  mutationFn: add_contact,
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    update_contact(id, data),
});

const handleSubmit = async (values: any) => {
  const payload: any = {
    name: values.name,
    email: values.email,
    phone: values.phone,
    group: values.group,
    jobTitle: values.jobTitle,
    employeeNumber: values.employeeNumber,
    dateOfBirth: values.dateOfBirth || null,
    loginAccess: values.loginAccess || false,
  };

  if (values.group === "DRIVER") {
    payload.driver = {
      driverLicenceNumber: values.driverLicenceNumber,
      drivingLicenceExpirationDate: values.drivingLicenceExpirationDate || null,
      driverType: values.driverType,
    };
  }

  if (values.group === "MECHANIC") {
    payload.mechanic = {
      certification: values.certification,
      experience: values.experience ? Number(values.experience) : null,
    };
  }

  if (values.loginAccess) {
    payload.username = values.username;
    if (values.password) {
      payload.password = values.password;
    }
    if (values.group === "OTHER" && values.role) {
      payload.role = values.role;
    }
  }

  // To support profile picture upload, we pass as FormData if a picture is selected
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    if (typeof payload[key] === "object" && payload[key] !== null) {
      formData.append(key, JSON.stringify(payload[key]));
    } else if (payload[key] !== null && payload[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  });

  if (values.profilePicture && values.profilePicture instanceof File) {
    formData.append("profilePicture", values.profilePicture);
  }

  if (contact.value) {
    const res = await updateMutation.mutateAsync({
      id: contact.value._id,
      data: formData,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Contact updated successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to update contact");
    }
  } else {
    const res = await createMutation.mutateAsync(formData);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Contact created successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to create contact");
    }
  }
};
</script>

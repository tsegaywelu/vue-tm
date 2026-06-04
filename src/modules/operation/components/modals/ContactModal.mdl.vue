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
      <!-- Loading state while fetching full contact details for edit -->
      <div v-if="contact && isLoadingContact" class="flex justify-center py-10">
        <i class="mdi mdi-loading mdi-spin text-2xl text-primary"></i>
      </div>

      <div v-else class="flex flex-col gap-4">
        <!-- Profile picture (hidden for Path B — contact info comes from the driver) -->
        <FileInput
          v-if="!isPathB"
          name="profilePicture"
          label="Profile Picture"
          imageOnly
          accept="image/*"
        />

        <!-- Name + Group row -->
        <div class="grid grid-cols-2 gap-4">
          <div v-if="!isPathB">
            <Input
              name="name"
              label="Full Name"
              :validation="{ required }"
              placeholder="e.g. John Doe"
            />
          </div>
          <div :class="{ 'col-span-2': isPathB }">
            <SelectInput
              name="group"
              label="Group"
              :options="groupOptions"
              :validation="{ required }"
              :attributes="{ placeholder: 'Select group' }"
            />
          </div>
        </div>

        <!-- Basic fields (hidden for Path B) -->
        <template v-if="!isPathB">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Input
                name="email"
                label="Email"
                placeholder="e.g. john@example.com"
              />
            </div>
            <div>
              <Input
                name="phone"
                label="Phone"
                :validation="{ required }"
                placeholder="e.g. 0912345678"
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

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Input name="dateOfBirth" label="Date of Birth" type="date" />
            </div>
            <div>
              <SelectInput
                name="region"
                label="Region"
                url="/region/myRegions"
                label_key="name"
                value_key="_id"
                :attributes="{ placeholder: 'Select region' }"
              />
            </div>
          </div>
        </template>

        <!-- Dynamic sections -->
        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.group, state.values.loginAccess]"
        >
          <template #default="[group, loginAccess]">
            <!-- Driver Specifics -->
            <div
              v-if="group === 'DRIVER'"
              class="border border-grey-100 p-4 rounded-xl bg-grey-25 mt-2 flex flex-col gap-4"
            >
              <h4 class="font-bold text-grey-900 text-sm">Driver Specific Information</h4>

              <!-- Is Employee toggle (only for create, not edit) -->
              <div v-if="!contact" class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEmployedToggle"
                  :checked="isEmployed"
                  @change="(e: any) => onIsEmployedChange(e.target.checked)"
                  class="h-4 w-4 rounded border-grey-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label for="isEmployedToggle" class="font-bold text-grey-700 text-sm cursor-pointer">Is Employee?</label>
              </div>

              <!-- Driver form fields (employee path OR Path A: new non-employee) -->
              <template v-if="isEmployed || (!isEmployed && !isExistingDriver)">
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
              </template>

              <!-- Non-employee secondary choice -->
              <template v-if="!isEmployed && !contact">
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isExistingDriverToggle"
                    :checked="isExistingDriver"
                    @change="(e: any) => onIsExistingDriverChange(e.target.checked)"
                    class="h-4 w-4 rounded border-grey-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label for="isExistingDriverToggle" class="font-bold text-grey-700 text-sm cursor-pointer">Driver already in system?</label>
                </div>

                <!-- Path B: search and pick existing driver -->
                <div v-if="isExistingDriver" class="flex flex-col gap-3">
                  <div class="relative">
                    <label class="block text-xs font-bold text-grey-700 mb-1">Search Driver</label>
                    <input
                      type="text"
                      v-model="driverSearchQuery"
                      @input="onDriverSearch"
                      placeholder="Type driver name..."
                      class="w-full border border-grey-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <div v-if="isSearchingDrivers" class="absolute right-3 top-7">
                      <i class="mdi mdi-loading mdi-spin text-primary text-sm"></i>
                    </div>

                    <!-- Results dropdown -->
                    <div
                      v-if="driverSearchResults.length > 0"
                      class="absolute z-10 w-full mt-1 bg-white border border-grey-100 rounded-xl shadow-lg overflow-hidden"
                    >
                      <div
                        v-for="driver in driverSearchResults"
                        :key="driver._id"
                        @click="selectSearchedDriver(driver)"
                        class="flex flex-col gap-0.5 px-3 py-2 hover:bg-grey-50 cursor-pointer border-b border-grey-50 last:border-0"
                      >
                        <span class="text-sm font-bold text-grey-900">{{ driver.name }}</span>
                        <div class="flex gap-3">
                          <span class="text-xs text-grey-500">{{ driver.phoneNumber }}</span>
                          <span class="text-xs text-grey-400">{{ driver.driverLicenceNumber }}</span>
                        </div>
                      </div>
                    </div>

                    <p
                      v-if="driverSearchQuery.length >= 2 && !isSearchingDrivers && driverSearchResults.length === 0 && !selectedDriver"
                      class="text-xs text-grey-400 mt-1"
                    >
                      No unlinked drivers found.
                    </p>
                  </div>

                  <!-- Selected driver chip -->
                  <div
                    v-if="selectedDriver"
                    class="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p class="text-sm font-bold text-grey-900">{{ selectedDriver.name }}</p>
                      <p class="text-xs text-grey-500">{{ selectedDriver.phoneNumber }} · {{ selectedDriver.driverLicenceNumber }}</p>
                    </div>
                    <button
                      type="button"
                      @click="selectedDriver = null; driverSearchQuery = ''"
                      class="text-xs text-error-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </template>
            </div>

            <!-- Mechanic Specifics -->
            <div
              v-if="group === 'MECHANIC'"
              class="border border-grey-100 p-4 rounded-xl bg-grey-25 mt-2 flex flex-col gap-4"
            >
              <h4 class="font-bold text-grey-900 text-sm">Mechanic Specific Information</h4>
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
                <div class="space-y-1">
                  <Input
                    name="password"
                    label="Password"
                    :attributes="{ type: showPassword ? 'text' : 'password' }"
                    :validation="{ required }"
                    placeholder="Min 6 characters"
                  >
                    <template #right_component>
                      <div class="flex items-center gap-1 pr-1">
                        <button
                          type="button"
                          class="size-7 grid place-items-center text-gray-400 hover:text-primary rounded-full transition-colors"
                          @click="copyPassword(form)"
                          title="Copy password"
                        >
                          <i class="mdi mdi-content-copy text-base"></i>
                        </button>
                        <button
                          type="button"
                          class="size-7 grid place-items-center text-gray-400 hover:text-primary rounded-full transition-colors"
                          @click="showPassword = !showPassword"
                          title="Toggle visibility"
                        >
                          <i class="size-5 block" v-html="showPassword ? icons.eye : icons.eyeClose"></i>
                        </button>
                      </div>
                    </template>
                  </Input>
                  <button
                    type="button"
                    @click="generatePassword(form)"
                    class="text-[10px] text-primary font-bold hover:underline ml-1"
                  >
                    Generate Random
                  </button>
                </div>

                <!-- Region field: only for Path B (existing non-employee driver) -->
                <div v-if="isPathB" class="col-span-2">
                  <SelectInput
                    name="region"
                    label="Region"
                    url="/region/myRegions"
                    label_key="name"
                    value_key="_id"
                    :attributes="{ placeholder: 'Select region' }"
                  />
                </div>

                <!-- Role field: only for OTHER group -->
                <div v-if="group === 'OTHER'" class="col-span-2">
                  <SelectInput
                    name="role"
                    label="Role"
                    url="/role"
                    label_key="name"
                    value_key="_id"
                    :validation="{ required }"
                    :attributes="{ placeholder: 'Select role' }"
                  />
                </div>
              </div>
            </div>
          </template>
        </component>
      </div><!-- end v-else -->
    </template>

    <template #bottom>
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
import { computed, ref, watch } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import FileInput from "@/components/form/FileInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import {
  add_contact,
  update_contact,
  fetch_contact_by_id,
  fetch_unlinked_drivers,
  link_driver_to_contact,
} from "../../api/operation.api";
import { useMutation, useQuery } from "@tanstack/vue-query";

const props = defineProps<{ data?: { contact?: any } }>();
const contact = computed(() => props.data?.contact);

// Fetch full contact details on edit so driver/mechanic sub-docs are populated
const { data: fullContactResponse, isLoading: isLoadingContact } = useQuery({
  queryKey: computed(() => ["contact", contact.value?._id]),
  queryFn: () => fetch_contact_by_id(contact.value!._id),
  enabled: computed(() => !!contact.value?._id),
});

const fullContact = computed(() => {
  if (!contact.value) return null;
  const res = fullContactResponse.value as any;
  return res?.data?.result || res?.data || contact.value;
});
const API_URL = import.meta.env.VITE_API_URL;
const showPassword = ref(false);

// ── Non-employee driver flow state ──────────────────────────
const isEmployed = ref(true);
const isExistingDriver = ref(false);
const selectedDriver = ref<any>(null);
const driverSearchQuery = ref("");
const driverSearchResults = ref<any[]>([]);
const isSearchingDrivers = ref(false);

// Path B = non-employee + existing driver in system
const isPathB = computed(() => !isEmployed.value && isExistingDriver.value);

const onIsEmployedChange = (checked: boolean) => {
  isEmployed.value = checked;
  if (checked) {
    isExistingDriver.value = false;
    selectedDriver.value = null;
    driverSearchQuery.value = "";
    driverSearchResults.value = [];
  }
};

const onIsExistingDriverChange = (checked: boolean) => {
  isExistingDriver.value = checked;
  selectedDriver.value = null;
  driverSearchQuery.value = "";
  driverSearchResults.value = [];
};

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const onDriverSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    const query = driverSearchQuery.value.trim();
    if (query.length < 2) {
      driverSearchResults.value = [];
      return;
    }
    isSearchingDrivers.value = true;
    try {
      const res = await fetch_unlinked_drivers(query);
      if (res.success) {
        const data = res.data as any;
        driverSearchResults.value = Array.isArray(data)
          ? data
          : data?.result || data?.data || [];
      }
    } finally {
      isSearchingDrivers.value = false;
    }
  }, 400);
};

const selectSearchedDriver = (driver: any) => {
  selectedDriver.value = driver;
  driverSearchResults.value = [];
  driverSearchQuery.value = "";
};

// ── Form helpers ─────────────────────────────────────────────
function copyPassword(form: any) {
  const password = form.getFieldValue("password");
  if (password) navigator.clipboard.writeText(password);
}

function generatePassword(form: any) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const password = Array(10)
    .fill(0)
    .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
    .join("");
  form.setFieldValue("password", password);
}

// Sync isEmployed when full contact loads
watch(fullContact, (fc) => {
  if (fc?.group === "DRIVER" && fc?.driverInfo) {
    isEmployed.value = fc.driverInfo.isEmployed !== false;
  }
});

// ── Initial form values ───────────────────────────────────────
const initialFormValues = computed(() => {
  const fc = fullContact.value;
  if (fc) {
    const driverInfo = typeof fc.driver === "object" ? fc.driver : fc.driverInfo;
    const mechanicInfo = typeof fc.mechanic === "object" ? fc.mechanic : fc.mechanicInfo;
    return {
      name: fc.name || "",
      email: fc.email || "",
      phone: fc.phone || "",
      group: fc.group || "OTHER",
      jobTitle: fc.jobTitle || "",
      employeeNumber: fc.employeeNumber || "",
      dateOfBirth: fc.dateOfBirth ? fc.dateOfBirth.split("T")[0] : "",
      driverLicenceNumber: driverInfo?.driverLicenceNumber || "",
      drivingLicenceExpirationDate: driverInfo?.drivingLicenceExpirationDate
        ? driverInfo.drivingLicenceExpirationDate.split("T")[0]
        : "",
      driverType: driverInfo?.driverType || "",
      certification: mechanicInfo?.certification || "",
      experience: mechanicInfo?.experience || "",
      loginAccess: fc.loginAccess || false,
      username: fc.username || "",
      password: "",
      role: fc.role?._id || fc.role || "",
      region: fc.region?._id || fc.region || "",
      profilePicture: fc.profilePicture
        ? `${API_URL}/${fc.profilePicture.replace(/\\/g, "/")}`
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
    region: "",
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

const createMutation = useMutation({ mutationFn: add_contact });
const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    update_contact(id, data),
});
const linkMutation = useMutation({
  mutationFn: ({ driverId, data }: { driverId: string; data: any }) =>
    link_driver_to_contact(driverId, data),
});

// ── Submit handler ────────────────────────────────────────────
const handleSubmit = async (values: any) => {
  // ── Path B: link an existing non-employee driver ──────────
  if (isPathB.value) {
    if (!selectedDriver.value) {
      toast.error("Please select a driver from the search results");
      return;
    }
    const body: any = { loginAccess: values.loginAccess || false };
    if (values.loginAccess) {
      body.username = values.username;
      body.password = values.password;
      if (values.region) body.region = values.region;
    }
    const res = await linkMutation.mutateAsync({
      driverId: selectedDriver.value._id,
      data: body,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Contact created and linked to driver successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to link driver contact");
    }
    return;
  }

  // ── Path A (new non-employee) or Employee: POST /contact ──
  const payload: any = {
    name: values.name,
    email: values.email,
    phone: values.phone,
    group: values.group,
    jobTitle: values.jobTitle,
    employeeNumber: values.employeeNumber,
    dateOfBirth: values.dateOfBirth || null,
    loginAccess: values.loginAccess || false,
    ...(values.region && { region: values.region }),
  };

  if (values.group === "DRIVER") {
    payload.driverInfo = {
      driverLicenceNumber: values.driverLicenceNumber,
      drivingLicenceExpirationDate:
        values.drivingLicenceExpirationDate || null,
      driverType: values.driverType,
      isEmployed: isEmployed.value,
    };
  }

  if (values.group === "MECHANIC") {
    payload.mechanicInfo = {
      certification: values.certification,
      experience: values.experience ? Number(values.experience) : null,
    };
  }

  if (values.loginAccess) {
    payload.username = values.username;
    if (values.password) payload.password = values.password;
    if (values.group === "OTHER" && values.role) payload.role = values.role;
  }

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

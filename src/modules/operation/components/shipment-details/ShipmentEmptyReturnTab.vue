<template>
  <div class="flex flex-col gap-6 p-4">
    <!-- Loader -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center p-12 min-h-[300px] bg-surface rounded-2xl border border-gray-100 shadow-sm"
    >
      <div
        class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- Read & List View -->
    <div v-else-if="!isAdding && !isEditing" class="flex flex-col gap-6">
      <!-- Empty State / Create Header -->
      <div
        class="flex justify-between items-center bg-surface p-4 rounded-2xl border border-gray-100 shadow-sm"
      >
        <div class="flex flex-col">
          <h3 class="font-bold text-gray-900 text-base leading-tight">
            Empty Return Details
          </h3>
          <p class="text-xs text-gray-400">Empty container return tracking</p>
        </div>
        <Button
          v-if="emptyReturnsList.length === 0"
          @click="initAdd"
          variant="primary"
          size="md"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-plus text-lg"></i> Add Empty Return
        </Button>
      </div>

      <!-- No Data Recorded -->
      <div
        v-if="emptyReturnsList.length === 0"
        class="flex flex-col items-center justify-center p-12 min-h-[250px] bg-surface rounded-2xl border border-gray-100 shadow-sm gap-4 text-center select-none"
      >
        <div
          class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/80"
        >
          <i class="mdi mdi-truck-delivery-outline text-3xl"></i>
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-base font-semibold text-gray-900">
            No Empty Return Recorded
          </h3>
          <p class="text-sm text-gray-500 max-w-sm">
            No return journey has been logged for this shipment yet.
          </p>
        </div>
      </div>

      <!-- List Display -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="item in emptyReturnsList"
          :key="item._id"
          class="bg-surface rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-5 select-none hover:border-gray-200 transition"
        >
          <div
            class="flex justify-between items-start border-b border-gray-50 pb-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"
              >
                <i class="mdi mdi-truck-delivery-outline text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800 text-sm leading-tight">
                  Return Date
                </h4>
                <p class="text-xs text-gray-400">{{ formatDate(item.date) }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <Button
                @click="initEdit(item)"
                variant="outline"
                size="sm"
                class="flex items-center gap-1 border border-gray-200 text-primary-700 hover:bg-primary-50 rounded-xl"
              >
                <i class="mdi mdi-pencil"></i> Edit
              </Button>
              <Button
                @click="handleDelete(item._id)"
                variant="outline"
                size="sm"
                class="flex items-center gap-1 border border-gray-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl"
              >
                <i class="mdi mdi-delete"></i> Delete
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold text-gray-400">From</span>
              <span class="font-bold text-gray-800">{{
                item.from || "-"
              }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold text-gray-400">To</span>
              <span class="font-bold text-gray-800">{{ item.to || "-" }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-semibold text-gray-400"
                >Distance (Km)</span
              >
              <span class="font-bold text-gray-800"
                >{{ item.distance || "-" }} km</span
              >
            </div>
          </div>

          <div
            v-if="item.remark"
            class="flex flex-col gap-1 pt-1 border-t border-gray-50 mt-1"
          >
            <span class="text-xs font-semibold text-gray-400"
              >Remark / Notes</span
            >
            <p
              class="text-sm font-medium text-gray-600 bg-gray-50/50 p-3 rounded-xl min-h-[50px] border border-gray-100/60"
            >
              {{ item.remark }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Form Mode -->
    <div
      v-else
      class="bg-surface rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-5 select-none h-fit w-full"
    >
      <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          :class="
            isEditing
              ? 'bg-orange-50 text-orange-600'
              : 'bg-primary-50 text-primary-600'
          "
        >
          <i
            class="mdi text-xl"
            :class="isEditing ? 'mdi-circle-edit-outline' : 'mdi-plus'"
          ></i>
        </div>
        <div>
          <h3 class="font-bold text-gray-900 text-base leading-tight">
            {{ isEditing ? "Edit Empty Return" : "Add Empty Return" }}
          </h3>
          <p class="text-xs text-gray-400">
            {{
              isEditing
                ? "Modify return details"
                : "Create a return journey record"
            }}
          </p>
        </div>
      </div>

      <Form
        id="emptyReturnActionForm"
        :values="formValues"
        @submit="handleSave"
        class_name="flex flex-col gap-5"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput name="date" label="Date" :validation="{ required }" />

          <Input
            name="distance"
            label="Distance (Km)"
            type="number"
            step="0.01"
            placeholder="e.g. 150.5"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="from"
            label="From Location"
            placeholder="e.g. Origin point"
            :validation="{ required }"
          />

          <Input
            name="to"
            label="To Location"
            placeholder="e.g. Destination point"
            :validation="{ required }"
          />
        </div>

        <TextareaInput
          name="remark"
          label="Remark"
          :attributes="{
            placeholder: 'Any additional notes...',
            rows: 3,
          }"
        />

        <div class="flex justify-end pt-3 border-t border-gray-50 gap-3 mt-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            @click="cancelForm"
            class="px-5 border border-gray-200"
          >
            Cancel
          </Button>
          <SubmitButton
            :loading="isSaving"
            variant="primary"
            size="md"
            form="emptyReturnActionForm"
          >
            {{ isEditing ? "Update" : "Save" }}
          </SubmitButton>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";
import type { Shipment } from "../../operation.types";

import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { required } from "@/utils/validations";

import {
  fetch_empty_returns_by_shipment,
  create_empty_return,
  update_empty_return,
  delete_empty_return,
} from "../../api/emptyReturn.api";

const props = defineProps<{
  shipment: Shipment;
}>();

const emit = defineEmits(["refresh"]);
const toast = useToastStore();

const isAdding = ref(false);
const isEditing = ref(false);
const selectedReturnId = ref<string | null>(null);

const {
  data: fetchResponse,
  isLoading,
  refetch,
} = useQuery({
  queryKey: ["empty-return", props.shipment._id],
  queryFn: () => fetch_empty_returns_by_shipment(props.shipment._id),
  enabled: !!props.shipment?._id,
});

const emptyReturnsList = computed(() => {
  if (!fetchResponse.value?.data) return [];
  return Array.isArray(fetchResponse.value.data)
    ? fetchResponse.value.data
    : [fetchResponse.value.data];
});

const formValues = ref({
  date: "",
  distance: "",
  from: "",
  to: "",
  remark: "",
});

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toISOString().split("T")[0];
}

function initAdd() {
  isAdding.value = true;
  isEditing.value = false;
  selectedReturnId.value = null;

  // Prefill defaults using the route destination and origin returning trip
  formValues.value = {
    date: new Date().toISOString().split("T")[0],
    distance: String(props.shipment?.waypointDistance || 0),
    from: props.shipment?.route?.destination || "",
    to: props.shipment?.route?.origin || "",
    remark: "",
  };
}

function initEdit(item: any) {
  isEditing.value = true;
  isAdding.value = false;
  selectedReturnId.value = item._id;

  formValues.value = {
    date: item.date ? item.date.split("T")[0] : "",
    distance: String(item.distance || ""),
    from: item.from || "",
    to: item.to || "",
    remark: item.remark || "",
  };
}

function cancelForm() {
  isAdding.value = false;
  isEditing.value = false;
  selectedReturnId.value = null;
  formValues.value = { date: "", distance: "", from: "", to: "", remark: "" };
}

const createMutation = useMutation({
  mutationFn: (data: any) => create_empty_return(data),
});

const updateMutation = useMutation({
  mutationFn: (data: any) =>
    update_empty_return(selectedReturnId.value as string, data),
});

const isSaving = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value,
);

async function handleSave(values: any) {
  const payload = {
    date: values.date,
    distance: parseFloat(values.distance),
    from: values.from,
    to: values.to,
    remark: values.remark || "",
    shipment: props.shipment._id,
  };

  let res: any;
  if (isEditing.value && selectedReturnId.value) {
    res = await updateMutation.mutateAsync(payload);
  } else {
    res = await createMutation.mutateAsync(payload);
  }

  if (res.success || res.status === 200 || res.status === 201) {
    toast.success(
      isEditing.value
        ? "Empty return updated successfully"
        : "Empty return created successfully",
    );
    refetch();
    cancelForm();
    emit("refresh");
  } else {
    toast.error(res.error || "Failed to save empty return details");
  }
}

async function handleDelete(id: string) {
  const confirm = await openModal("ConfirmationModal", {
    title: "Delete Empty Return",
    message:
      "Are you sure you want to delete this empty return record? This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  });

  if (confirm) {
    const res = await delete_empty_return(id);
    if (res.success || res.status === 200 || res.status === 204) {
      toast.success("Empty return deleted successfully");
      refetch();
      emit("refresh");
    } else {
      toast.error(res.error || "Failed to delete empty return details");
    }
  }
}
</script>

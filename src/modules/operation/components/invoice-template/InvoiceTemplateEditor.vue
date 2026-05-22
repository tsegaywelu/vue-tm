<template>
  <div class="flex flex-col h-full gap-4">
    <!-- Header bar -->
    <div class="flex flex-wrap items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
      <!-- Shipper selector — carrier admin only -->
      <div v-if="props.ownerType !== 'shipper'" class="flex flex-col gap-1 flex-1 min-w-[240px]">
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Shipper</label>
        <BaseSelect
          name="shipper"
          v-model="selectedShipperId"
          url="/shipper/contractedShippers"
          label_key="shipper.name"
          value_key="shipper._id"
          searchable
          :display_value="shipperDisplayLabel"
          :attributes="{ placeholder: 'Search and select shipper...' }"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Product Type</label>
        <select
          v-model="template.productType"
          class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="IN_BOUND">In Bound</option>
          <option value="OUT_BOUND">Out Bound</option>
          <option value="ALL">All</option>
        </select>
      </div>

      <div class="flex items-end gap-2 ml-auto">
        <button
          class="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          @click="router.back()"
        >Cancel</button>
        <button
          class="text-sm px-5 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          :disabled="saving || (props.ownerType !== 'shipper' && !selectedShipperId)"
          @click="save"
        >
          {{ saving ? "Saving..." : (isEdit ? "Update Template" : "Save Template") }}
        </button>
      </div>
    </div>

    <!-- Three-panel editor -->
    <div class="flex-1 grid grid-cols-1 xl:grid-cols-[280px_1fr_300px] gap-4 min-h-0 overflow-auto">
      <!-- Left: Column builder -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Columns</h3>
        <div class="overflow-y-auto">
          <TemplateColumnBuilder v-model="template.columns" />
        </div>
      </div>

      <!-- Center: Preview -->
      <div class="flex flex-col gap-2 min-w-0">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Preview</h3>
        <TemplatePreview :template="template" />
      </div>

      <!-- Right: Style editor -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Styles & Options</h3>
        <div class="overflow-y-auto">
          <TemplateStyleEditor v-model="template" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import {
  fetch_invoice_template,
  create_invoice_template,
  update_invoice_template,
} from "../../api/invoice-template.api";
import { fetch_shipper_profile } from "@/modules/shipper/api/shipper.api";
import { makeDefaultTemplate } from "./constants";
import type { InvoiceTemplate, MetadataRow, TotalRowConfig } from "@/utils/invoice-template-export";
import TemplateColumnBuilder from "./TemplateColumnBuilder.vue";
import TemplateStyleEditor from "./TemplateStyleEditor.vue";
import TemplatePreview from "./TemplatePreview.vue";
import BaseSelect from "@/components/common/Select.vue";

const props = defineProps<{ ownerType?: "shipper" | "carrier" }>();

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();

const templateId = route.params.id as string | undefined;
const isEdit = !!templateId;
const saving = ref(false);
const template = ref<InvoiceTemplate>(makeDefaultTemplate());

const selectedShipperId = ref<string>("");
const shipperDisplayLabel = ref<string>("");

// Keep template.ownerId in sync with the shipper selector and auto-generate a name
watch(selectedShipperId, async (val) => {
  template.value.ownerId = val;
  template.value.ownerType = "shipper";
  if (val && props.ownerType !== "shipper") {
    const res = await fetch_shipper_profile(val);
    const shipperName =
      (res as any)?.data?.shipper?.name ||
      (res as any)?.data?.name ||
      val;
    shipperDisplayLabel.value = shipperName;
    template.value.name = `${shipperName} - ${template.value.productType}`;
  }
});

function migrateLoaded(data: any): InvoiceTemplate {
  if (!Array.isArray(data.metadataRows)) {
    const old = data.metadataRows || {};
    data.metadataRows = [
      { id: "meta_1", labelText: "Transporter Name", valueSource: "transporterName", enabled: !!old.transporterName, colspanLabel: 3, colspanValue: 0 },
      { id: "meta_2", labelText: "REQUESTING MONTH", valueSource: "month", enabled: !!old.month, colspanLabel: 3, colspanValue: 0 },
      { id: "meta_3", labelText: "INVOICE NO", valueSource: "invoiceNo", enabled: !!old.invoiceNo, colspanLabel: 3, colspanValue: 0 },
      { id: "meta_4", labelText: "PO Number", valueSource: "poNumber", enabled: !!old.poNumber, colspanLabel: 3, colspanValue: 0 },
    ] as MetadataRow[];
  }
  if (!Array.isArray(data.totalRows)) {
    data.totalRows = data.showTotalRow
      ? [{ id: "total_1", label: "TOTAL", columns: data.totalColumns || [] }] as TotalRowConfig[]
      : [] as TotalRowConfig[];
  }
  return data as InvoiceTemplate;
}

onMounted(async () => {
  if (isEdit && templateId) {
    const res = await fetch_invoice_template(templateId);
    if (res.success && res.data) {
      template.value = migrateLoaded(res.data);
      const ownerId = template.value.ownerId;
      if (ownerId) {
        selectedShipperId.value = ownerId;
        // Fetch shipper name so the selector shows the label instead of raw ID
        if (props.ownerType !== "shipper") {
          const shipperRes = await fetch_shipper_profile(ownerId);
          shipperDisplayLabel.value =
            (shipperRes as any)?.data?.shipper?.name ||
            (shipperRes as any)?.data?.name ||
            "";
        }
      }
    }
  } else {
    template.value.ownerType = "shipper";
    if (props.ownerType === "shipper") {
      // Shipper user — auto-fill their own ID
      selectedShipperId.value = authStore.shipperId ?? "";
    }
    // Carrier admin — leave selectedShipperId empty; user must pick from the selector
  }
});

const save = async () => {
  if (props.ownerType !== "shipper" && !selectedShipperId.value) {
    toast.error("Please select a shipper for this template");
    return;
  }
  saving.value = true;
  try {
    const payload = { ...template.value };
    const res = isEdit
      ? await update_invoice_template(templateId!, payload)
      : await create_invoice_template(payload);
    if (res.success) {
      toast.success(isEdit ? "Template updated!" : "Template created!");
      router.back();
    } else {
      toast.error(res.error || "Failed to save template");
    }
  } finally {
    saving.value = false;
  }
};
</script>

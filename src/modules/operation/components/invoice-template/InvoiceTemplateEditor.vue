<template>
  <div class="flex flex-col h-full gap-4">
    <!-- Header bar -->
    <div
      class="flex flex-wrap items-end gap-3 bg-surface rounded-2xl px-5 py-4 shadow-sm border border-line"
    >
      <div class="grid grid-cols-2 w-full gap-4">
        <div v-if="props.ownerType !== 'shipper'">
          <BaseSelect
            name="shipper"
            label="Shipper"
            v-model="selectedShipperId"
            url="/shipper/contractedShippers"
            label_key="shipper.name"
            value_key="shipper._id"
            searchable
            :display_value="shipperDisplayLabel"
            :attributes="{ placeholder: 'Search and select shipper...' }"
            :class="shipperError ? '[&_.input-focus]:border-red-400' : ''"
          />
          <span v-if="shipperError" class="text-xs text-red-500"
            >Shipper is required</span
          >
        </div>
        <BaseSelect
          label="Product Type"
          v-model="template.productType"
          :options="[
            { label: 'In Bound', value: 'IN_BOUND' },
            { label: 'Out Bound', value: 'OUT_BOUND' },
            { label: 'All', value: 'ALL' },
          ]"
        />
      </div>

      <!-- Actions: full width on mobile (draft left, buttons right), compact on desktop -->
      <div class="flex items-center w-full sm:w-auto sm:ml-auto gap-2">
        <span v-if="lastDraftSaved" class="text-[10px] shrink-0 text-gray-400"
          >Draft saved {{ lastDraftSaved }}</span
        >
        <div class="ml-auto sm:ml-0 flex items-center gap-2">
          <button
            class="text-sm px-4 py-2 rounded-xl border border-line text-gray-600 hover:bg-surface-hover transition-colors"
            @click="router.back()"
          >
            Cancel
          </button>
          <button
            class="text-sm px-4 py-2 rounded-xl border border-primary-300 text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-50"
            :disabled="
              saving || (props.ownerType !== 'shipper' && !selectedShipperId)
            "
            @click="save(false)"
          >
            {{ saving === "save" ? "Saving…" : "Save" }}
          </button>
          <button
            class="text-sm px-5 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            v-if="
              !!saving || (props.ownerType !== 'shipper' && !selectedShipperId)
            "
            @click="save(true)"
          >
            {{
              saving === "submit" ? "Submitting…" : isEdit ? "Update" : "Submit"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Three-panel editor — stacked on mobile, side-by-side on xl+ -->
    <div
      class="flex-1 grid grid-cols-1 xl:grid-cols-[280px_1fr_300px] gap-4 min-h-0 overflow-auto"
    >
      <!-- Columns — cards scroll horizontally inside builder -->
      <div class="flex flex-col gap-2">
        <h3
          class="text-xs font-bold text-gray-500 uppercase tracking-wider px-1"
        >
          Columns
        </h3>
        <TemplateColumnBuilder v-model="template.columns" />
      </div>

      <!-- Preview -->
      <div class="flex flex-col gap-2 min-w-0">
        <h3
          class="text-xs font-bold text-gray-500 uppercase tracking-wider px-1"
        >
          Preview
        </h3>
        <TemplatePreview :template="template" />
      </div>

      <!-- Styles & Options — content scrolls horizontally -->
      <div class="flex flex-col gap-2">
        <h3
          class="text-xs font-bold text-gray-500 uppercase tracking-wider px-1"
        >
          Styles & Options
        </h3>
        <div class="overflow-x-auto overflow-y-auto">
          <TemplateStyleEditor v-model="template" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
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
import type {
  InvoiceTemplate,
  MetadataRow,
  TotalRowConfig,
} from "@/utils/invoice-template-export";
import TemplateColumnBuilder from "./TemplateColumnBuilder.vue";
import TemplateStyleEditor from "./TemplateStyleEditor.vue";
import TemplatePreview from "./TemplatePreview.vue";
import BaseSelect from "@/components/common/Select.vue";

const props = defineProps<{ ownerType?: "shipper" | "carrier" }>();

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();

// Edit mode is detected by the presence of both shipperId + productType in route params
const routeShipperId = route.params.shipperId as string | undefined;
const routeProductType = route.params.productType as string | undefined;
const isEdit = !!(routeShipperId && routeProductType);

const saving = ref<false | "save" | "submit">(false);
const template = ref<InvoiceTemplate>(makeDefaultTemplate());
const lastDraftSaved = ref<string>("");
const shipperError = ref(false);

const DRAFT_KEY = isEdit
  ? `tms-invoice-template-draft-edit-${routeShipperId}-${routeProductType}`
  : `tms-invoice-template-draft-${props.ownerType ?? "carrier"}`;

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(template.value));
    const now = new Date();
    lastDraftSaved.value = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {}
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

const selectedShipperId = ref<string>("");
const shipperDisplayLabel = ref<string>("");

watch(selectedShipperId, async (val) => {
  shipperError.value = false;
  template.value.ownerId = val;
  template.value.ownerType = "shipper";
  if (val && props.ownerType !== "shipper") {
    const res = await fetch_shipper_profile(val);
    const shipperName =
      (res as any)?.data?.shipper?.name || (res as any)?.data?.name || val;
    shipperDisplayLabel.value = shipperName;
    template.value.name = `${shipperName} - ${template.value.productType}`;
  }
});

function migrateLoaded(data: any): InvoiceTemplate {
  if (!Array.isArray(data.metadataRows)) {
    const old = data.metadataRows || {};
    data.metadataRows = [
      {
        id: "meta_1",
        labelText: "Transporter Name",
        valueSource: "transporterName",
        enabled: !!old.transporterName,
        colspanLabel: 3,
        colspanValue: 0,
      },
      {
        id: "meta_2",
        labelText: "REQUESTING MONTH",
        valueSource: "month",
        enabled: !!old.month,
        colspanLabel: 3,
        colspanValue: 0,
      },
      {
        id: "meta_3",
        labelText: "INVOICE NO",
        valueSource: "invoiceNo",
        enabled: !!old.invoiceNo,
        colspanLabel: 3,
        colspanValue: 0,
      },
      {
        id: "meta_4",
        labelText: "PO Number",
        valueSource: "poNumber",
        enabled: !!old.poNumber,
        colspanLabel: 3,
        colspanValue: 0,
      },
    ] as MetadataRow[];
  }
  if (!Array.isArray(data.totalRows)) {
    data.totalRows = data.showTotalRow
      ? ([
          { id: "total_1", label: "TOTAL", columns: data.totalColumns || [] },
        ] as TotalRowConfig[])
      : ([] as TotalRowConfig[]);
  }
  return data as InvoiceTemplate;
}

onMounted(async () => {
  if (isEdit && routeShipperId && routeProductType) {
    const res = await fetch_invoice_template(routeShipperId, routeProductType);
    if (res.success && res.data) {
      const raw = res.data as any;
      const parsed =
        typeof raw.content === "string"
          ? JSON.parse(raw.content)
          : (raw.content ?? raw);
      template.value = migrateLoaded(parsed);
      template.value.productType = (raw.productType || routeProductType) as any;
      if (props.ownerType !== "shipper") {
        shipperDisplayLabel.value = raw.shipperId?.name || "";
        if (!shipperDisplayLabel.value) {
          const shipperRes = await fetch_shipper_profile(routeShipperId);
          shipperDisplayLabel.value =
            (shipperRes as any)?.data?.shipper?.name ||
            (shipperRes as any)?.data?.name ||
            "";
        }
      }
      // Set value AFTER display label so Select.vue's watcher already has display_value
      selectedShipperId.value = routeShipperId;
    }
    // Overlay with any unsaved local draft (newer than what's on the server)
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        template.value = migrateLoaded(JSON.parse(saved));
        lastDraftSaved.value = "restored";
      }
    } catch {}
  } else {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        template.value = migrateLoaded(JSON.parse(saved));
        lastDraftSaved.value = "restored";
      }
    } catch {}

    template.value.ownerType = "shipper";
    if (props.ownerType === "shipper") {
      selectedShipperId.value = authStore.shipperId ?? "";
    }
  }

  autoSaveTimer = setInterval(saveDraft, 10_000);
});

onUnmounted(() => {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
});

const save = async (andSubmit: boolean) => {
  if (props.ownerType !== "shipper" && !selectedShipperId.value) {
    shipperError.value = true;
    toast.error("Please select a shipper for this template");
    return;
  }
  saving.value = andSubmit ? "submit" : "save";
  try {
    const content = JSON.stringify(template.value);
    const res =
      isEdit && routeShipperId && routeProductType
        ? await update_invoice_template(
            routeShipperId,
            routeProductType,
            content,
          )
        : await create_invoice_template({
            shipperId: selectedShipperId.value,
            productType: template.value.productType,
            content,
          });
    if (res.success) {
      if (andSubmit) {
        clearDraft();
        toast.success(isEdit ? "Template updated!" : "Template created!");
        router.back();
      } else {
        toast.success("Template saved!");
      }
    } else {
      toast.error((res as any).error || "Failed to save template");
    }
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <Form
    id="shipment-filter"
    @change="
      (values) => {
        emit('change', {
          ...values,
          routeOrigin: values.routeOrigin?.length
            ? values.routeOrigin.join(',')
            : undefined,
          routeDestination: values.routeDestination?.length
            ? values.routeDestination.join(',')
            : undefined,
        });
      }
    "
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Origin"
      multiple
      parent_class_name=""
      size="xs"
      :params="
        (values) => {
          return {
            sort: 'shipmentCount',
            q: undefined,
            ...(values.search
              ? {
                  routeName: {
                    regexAny: values.search,
                  },
                }
              : {}),
          };
        }
      "
      name="routeOrigin"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{
        placeholder: 'Please Search and Selct a City',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Destination"
      searchable
      multiple
      parent_class_name=""
      size="xs"
      :params="
        (values) => {
          return {
            sort: 'shipmentCount',
            q: undefined,
            ...(values.search
              ? {
                  routeName: {
                    regexAny: values.search,
                  },
                }
              : {}),
          };
        }
      "
      name="routeDestination"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{
        placeholder: 'Please Search and Selct a City',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      searchable
      name="status"
      size="xs"
      :options="ShipmentStatus"
      :attributes="{
        placeholder: 'Please Select a Status',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Product Type"
      name="productType"
      size="xs"
      :options="ProductT"
      :attributes="{
        placeholder: 'Please Select a Product Type',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Trip Type"
      name="tripType"
      size="xs"
      :options="Triptype"
      :attributes="{
        placeholder: 'Please Select a Trip Type',
      }"
    />

    <SelectInput
      :show_validation_status="false"
      label="Vehicle Ownership"
      name="vehicleOwnership"
      size="xs"
      :options="VehicleOwnership"
      :attributes="{
        placeholder: 'Select a Vehicle Ownership',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Damage"
      name="damage"
      size="xs"
      :options="Damage"
      :attributes="{
        placeholder: 'Please Select a Damage',
      }"
    />

    <SelectInput
      :show_validation_status="false"
      label="Documented Uploads"
      name="documentedUploads"
      size="xs"
      :options="DocumentedUploads"
      :attributes="{
        placeholder: 'Select a Documented Uploads',
      }"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Shipper"
      size="xs"
      name="shipper"
      value_key="shipper._id"
      label_key="shipper.name"
      :url="`/shipper/contractedShippers`"
      :attributes="{
        placeholder: 'Please Search and Selct a Shipper',
      }"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Agent"
      size="xs"
      name="agent"
      value_key="_id"
      label_key="name"
      :url="`/agent/shipper/carrier`"
      :attributes="{
        placeholder: 'Please Search and Selct a Agent',
      }"
    />
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";
import {
  Damage,
  DocumentedUploads,
  ShipmentStatus,
  Triptype,
  VehicleOwnership,
  ProductT,
} from "@/utils/utils";

const props = defineProps<{
  calendarType?: "english" | "ethiopian";
  outputCalendarType?: "english" | "ethiopian";
}>();

const emit = defineEmits(["change"]);
</script>

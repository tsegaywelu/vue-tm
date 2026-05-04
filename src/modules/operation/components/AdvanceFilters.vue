<template>
  <Form
    id="advance-filter"
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
        placeholder: 'Search Origin',
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
        placeholder: 'Search Destination',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      searchable
      name="status"
      size="xs"
      :options="AdvanceStatusOptions"
      :attributes="{
        placeholder: 'Select Status',
      }"
    />
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";
import { TransactionStatus } from "../operation.types";

const emit = defineEmits(["change"]);

const AdvanceStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Paid", value: "PAID" },
  { label: "Success", value: "SUCCESS" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Failed", value: "FAILED" },
];
</script>

<template>
  <Table :columns="columns" :rows="filteredContacts">
    <template #cell-username="{ row }">
      <span class="font-bold text-grey-900">{{ row.username }}</span>
    </template>
    <template #cell-roleName="{ row }">
      <span class="text-grey-600">{{ row.role?.name || "-" }}</span>
    </template>
    <template #cell-roleType="{ row }">
      <span class="text-grey-600">{{ row.role?.type || "-" }}</span>
    </template>
    <template #cell-phone="{ row }">
      <span class="text-grey-600">{{ row.contact?.phone || "-" }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useAuthStore } from "@/store/authStore";
import Table from "@/components/common/Table.vue";
import ApiService from "@/api/ApiService";

const authStore = useAuthStore();
const shipperId = computed(
  () => authStore.current_user?.user?.shipper?._id || "",
);
const api = new ApiService();

const { data: usersRes } = useQuery({
  queryKey: ["shipper-contacts", shipperId.value],
  queryFn: () => api.addAuthenticationHeader().get("/auth/users"),
});

const filteredContacts = computed(() => {
  const allUsers = usersRes.value?.data || [];
  return allUsers.filter(
    (user: any) =>
      user.shipper?._id === shipperId.value ||
      user.role?.shipper === shipperId.value,
  );
});

const columns: TableColumn<any>[] = [
  { key: "username", label: "Name", field: "username" },
  { key: "roleName", label: "Role", field: "role.name" },
  { key: "roleType", label: "Type", field: "role.type" },
  { key: "phone", label: "Phone", field: "contact.phone" },
];
</script>

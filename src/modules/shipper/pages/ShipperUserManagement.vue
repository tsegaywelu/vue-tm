<template>
  <div class="flex flex-col h-full">
    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        v-if="activeTab === 'users'"
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="handleAddUser"
      >
        <i v-html="icons.plus" />
        Add User
      </Button>
      <Button
        v-if="activeTab === 'roles'"
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="handleAddRole"
      >
        <i v-html="icons.plus" />
        Add Role
      </Button>
    </Teleport>

    <!-- Tab Content -->
    <div class="flex-1 min-h-0 p-6">
      <UsersTable
        v-if="activeTab === 'users'"
        ref="usersTableRef"
        @action="handleUserAction"
      />
      <RolesTable
        v-else-if="activeTab === 'roles'"
        ref="rolesTableRef"
        @action="handleRoleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import UsersTable from "../components/UserManagement/UsersTable.vue";
import RolesTable from "../components/UserManagement/RolesTable.vue";
import { openModal } from "@customizer/modal-x";
import { icons } from "@/utils/icons";
import { delete_user, delete_role } from "../api/shipper.api";
import { useToastStore } from "@/store/toastStore";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const activeTab = computed(() => (route.query.tab as string) || "users");

const usersTableRef = ref();
const rolesTableRef = ref();

const handleAddUser = async () => {
  const res = await openModal("ShipperUserModal", {});
  if (res) usersTableRef.value?.refetch();
};

const handleAddRole = async () => {
  router.push("/shipper/users/role/add");
};

const handleUserAction = async ({ action, row }: any) => {
  if (action === "edit") {
    const res = await openModal("ShipperUserModal", { user: row });
    if (res) usersTableRef.value?.refetch();
  } else if (action === "delete") {
    const confirmed = await openModal("ConfirmationModal", {
      title: "Delete User",
      message: `Are you sure you want to delete user "${row.username}"?`,
      confirmText: "Delete",
      action: "delete",
    });

    if (confirmed) {
      try {
        const res = await delete_user(row._id);
        if (res.success) {
          toast.success("User deleted successfully");
          usersTableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete user");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};

const handleRoleAction = async ({ action, row }: any) => {
  if (action === "edit") {
    router.push(`/shipper/users/role/edit/${row._id}`);
  } else if (action === "delete") {
    const confirmed = await openModal("ConfirmationModal", {
      title: "Delete Role",
      message: `Are you sure you want to delete role "${row.name}"?`,
      confirmText: "Delete",
      action: "delete",
    });

    if (confirmed) {
      try {
        const res = await delete_role(row._id);
        if (res.success) {
          toast.success("Role deleted successfully");
          rolesTableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete role");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>

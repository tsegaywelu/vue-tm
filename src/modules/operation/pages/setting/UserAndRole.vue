<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="currentTab === 'user' ? 'USER:create' : 'ROLE:create'"
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="handleAdd"
    >
      <i v-html="icons.plus" />
      Add {{ currentTab === "user" ? "User" : "Role" }}
    </Button>
  </Teleport>

  <!-- Tab Content -->
  <div class="flex-1 min-h-0">
    <UserTable
      v-if="currentTab === 'user'"
      ref="userTableRef"
      @action="(data) => handleAction(data, 'user')"
    />
    <RoleTable
      v-else
      ref="roleTableRef"
      @action="(data) => handleAction(data, 'role')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserTable from "../../components/settings/UserTable.vue";
import RoleTable from "../../components/settings/RoleTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_user, delete_role } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const userTableRef = ref();
const roleTableRef = ref();

const currentTab = computed(() => {
  const tab = (route.query.tab as string) || "user";
  return tab;
});

watch(currentTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const handleAdd = () => {
  if (currentTab.value === "user") {
    router.push("/setting/user-and-role/user/add");
  } else {
    router.push("/setting/user-and-role/role/add");
  }
};

const handleAction = async ({ row, action }: any, type: "user" | "role") => {
  if (action === "edit") {
    router.push(`/setting/user-and-role/${type}/edit/${row._id}`);
  } else if (action === "reset" && type === "user") {
    router.push(`/setting/user-and-role/user/reset-password/${row._id}`);
  } else if (action === "delete") {
    const name = type === "user" ? row.username : row.name;
    if (confirm(`Are you sure you want to delete ${type} "${name}"?`)) {
      try {
        const res =
          type === "user"
            ? await delete_user(row._id)
            : await delete_role(row._id);
        if (res.success) {
          toast.success(
            `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
          );
          if (type === "user") userTableRef.value?.refetch();
          else roleTableRef.value?.refetch();
        } else {
          toast.error(res.error || `Failed to delete ${type}`);
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>

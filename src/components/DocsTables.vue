<script setup lang="ts">
import { ref, computed, watch } from "vue";
import store from "@/store/index";
import { useRoute } from "vue-router";
import ReadOnlyTable from "@/components/ReadOnlyTable.vue";
import type { Item } from "vue3-easy-data-table";

const route = useRoute();

const tab = ref<string>();

const selectedType = ref<any>();
const selectedItem = ref<Item>();

const projectDataSource = ref<string>("");

const meta = computed<any>(() => store.state.meta);

watch(
  route,
  () => {
    if (route.name !== "docs") return;
    initialize();
  },
  { deep: true }
);

const initialize = () => {
  if (!meta.value) return;

  const type = route.params.type;
  selectedType.value = meta.value.find((m: any) => m.key === type);

  const projectId = route.params.project;
  projectDataSource.value = selectedType.value.dataSource + projectId;

  selectedItem.value = undefined;
};

const mainTableRowClicked = (item: any) => {
  selectedItem.value = item;
};

initialize();
</script>

<template v-if="selectedType">
  <v-tabs bg-color="primary">
    <v-tab>{{ selectedType.name }}</v-tab>
  </v-tabs>
  <ReadOnlyTable
    :headers="selectedType.headers"
    :dataSource="projectDataSource"
    @rowClicked="mainTableRowClicked"
  />

  <template v-if="selectedItem">
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab
        v-for="child in selectedType.children"
        :key="child.key"
        :value="child.key"
      >
        {{ child.name }}
      </v-tab>
    </v-tabs>
    <v-window v-if="selectedItem" v-model="tab">
      <v-window-item
        v-for="child in selectedType.children"
        :key="child.key"
        :value="child.key"
      >
        <ReadOnlyTable
          :headers="meta.find((m: any) => m.key === child.key).headers"
          :data-source="child.dataSource + selectedItem.id"
        />
      </v-window-item>
    </v-window>
  </template>
</template>

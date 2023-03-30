<script setup lang="ts">
import RequirementTable from "@/components/RequirementTable.vue";
import DiagramTable from "@/components/DiagramTable.vue";

import { ref } from "vue";

const tab = ref(null);
</script>

<template>
  <h1 class="text-center my-5">Design your software product</h1>

  <v-card>
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab :value="1">Requirements</v-tab>
      <v-tab :value="2">Diagrams</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <RequirementTable />
      </v-window-item>
      <v-window-item :value="2">
        <DiagramTable />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type GraphParameters from "@/types/GraphParameters";

const propsForm = defineProps<{
  project: string;
}>();

const emit = defineEmits<{
  (e: "confirm", parameters: GraphParameters): void;
}>();

const dialog = ref<boolean>(false);

const rules = [
  (v: any) =>
    v === undefined || v === null || (v.length && v.length === 0)
      ? "This field is required"
      : true,
];

const parameters = ref<GraphParameters>({});

const submit = async (event: SubmitEvent): Promise<void> => {
  const results: any = await event;
  if (!results.valid) {
    return;
  }

  emit("confirm", { project: propsForm.project, ...parameters.value });
  close();
};

const close = (): void => {
  parameters.value = {};
  dialog.value = false;
};
</script>

<template>
  <v-dialog v-model="dialog" @keydown.esc="close" width="600">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary">Generate graph</v-btn>
    </template>

    <v-form validate-on="submit" @submit.prevent="submit">
      <v-card>
        <v-card-title>Generate relationship graph</v-card-title>

        <v-card-text>
          <v-text-field
            :model-value="propsForm.project"
            :rules="rules"
            label="Project"
            required
            readonly
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn type="submit" color="primary">Submit</v-btn>
          <v-btn color="primary" @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

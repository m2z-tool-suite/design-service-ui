<script setup lang="ts">
import { ref } from "vue";
import type ReportParameters from "@/types/ReportParameters";
import type ClassType from "@/types/ClassType";

const propsForm = defineProps<{
  project: string;
  classTypes: ClassType[];
}>();

const emit = defineEmits<{
  (e: "confirm", parameters: ReportParameters): void;
}>();

const dialog = ref<boolean>(false);

const rules = [
  (v: any) =>
    v === undefined || v === null || (v.length && v.length === 0)
      ? "This field is required"
      : true,
];

const parameters = ref<ReportParameters>({});

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
      <v-btn v-bind="props" color="primary">Generate report</v-btn>
    </template>

    <v-form validate-on="submit" @submit.prevent="submit">
      <v-card>
        <v-card-title>Generate method list report</v-card-title>

        <v-card-text>
          <v-text-field
            :model-value="propsForm.project"
            :rules="rules"
            label="Project"
            required
            readonly
          ></v-text-field>

          <v-select
            v-model="parameters.classType"
            :rules="rules"
            :items="propsForm.classTypes"
            item-title="name"
            item-value="id"
            label="Class type"
            required
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-btn type="submit" color="primary">Submit</v-btn>
          <v-btn color="primary" @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

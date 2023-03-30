<script setup lang="ts">
import { ref } from "vue";
import type Requirement from "@/types/Requirement";
import type RequirementType from "@/types/RequirementType";
import type RequirementPriority from "@/types/RequirementPriority";
import type RequirementRisk from "@/types/RequirementRisk";
import type RequirementStatus from "@/types/RequirementStatus";

const propsForm = defineProps<{
  action: string;
  icon: string;
  requirement?: Requirement;
  types: RequirementType[];
  priorities: RequirementPriority[];
  risks: RequirementRisk[];
  statuses: RequirementStatus[];
}>();

const emit = defineEmits<{ (e: "confirm", requirement: Requirement): void }>();

const dialog = ref<boolean>(false);

const rules = [
  (v: any) =>
    v === undefined || v === null || (v.length && v.length === 0)
      ? "This field is required"
      : true,
];

const requirement = ref<Requirement>({
  ...propsForm.requirement,
});

const submit = async (event: SubmitEvent): Promise<void> => {
  const results: any = await event;
  if (!results.valid) {
    return;
  }

  emit("confirm", { ...requirement.value });
  close();
};

const close = (): void => {
  requirement.value = {};
  dialog.value = false;
};
</script>

<template>
  <v-dialog v-model="dialog" @keydown.esc="close" width="600">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" :icon="propsForm.icon" size="x-large"></v-icon>
    </template>

    <v-form validate-on="submit" @submit.prevent="submit">
      <v-card>
        <v-card-title>{{ propsForm.action }} requirement</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="requirement.title"
            :rules="rules"
            label="Title"
            required
          ></v-text-field>

          <v-textarea
            v-model="requirement.description"
            :rules="rules"
            label="Description"
            required
          ></v-textarea>

          <v-select
            v-model="requirement.type"
            :rules="rules"
            :items="propsForm.types"
            label="Type"
            return-object
            required
          ></v-select>

          <v-select
            v-model="requirement.priority"
            :rules="rules"
            :items="propsForm.priorities"
            label="Priority"
            return-object
            required
          ></v-select>

          <v-text-field
            v-model="requirement.stakeholders"
            :rules="rules"
            label="Stakeholders"
            required
          ></v-text-field>

          <v-select
            v-model="requirement.risk"
            :rules="rules"
            :items="propsForm.risks"
            label="Risk"
            return-object
            required
          ></v-select>

          <v-select
            v-model="requirement.status"
            :rules="rules"
            :items="propsForm.statuses"
            label="Status"
            return-object
            required
          ></v-select>

          <v-text-field
            v-model="requirement.effortAssessment"
            :rules="rules"
            label="Effort assessment"
            required
          ></v-text-field>

          <v-card-actions class="text-right">
            <v-btn type="submit" color="primary">Submit</v-btn>
            <v-btn color="primary" @click="close">Cancel</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
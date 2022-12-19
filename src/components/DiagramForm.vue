<script setup lang="ts">
import { ref } from "vue";
import type Diagram from "@/types/Diagram";

const propsForm = defineProps<{
  action: string;
  icon: string;
  diagram?: Diagram;
}>();

const emit = defineEmits<{ (e: "confirm", diagram: Diagram): void }>();

const dialog = ref<boolean>(false);
const diagram = ref<Diagram>({ ...propsForm.diagram });

const confirm = (): void => {
  const newTitle: string | undefined = diagram.value.title;
  const newDescription: string | undefined = diagram.value.description;
  if (
    newTitle === undefined ||
    newTitle.length === 0 ||
    newDescription === undefined ||
    newDescription.length === 0
  ) {
    return;
  }

  emit("confirm", { ...diagram.value });
  close();
};

const close = (): void => {
  diagram.value = {};
  dialog.value = false;
};
</script>

<template>
  <v-dialog v-model="dialog" width="600">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" :icon="propsForm.icon" size="x-large"></v-icon>
    </template>

    <v-card>
      <v-card-title>{{ propsForm.action }} diagram</v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            v-model="diagram.title"
            label="Title"
            required
          ></v-text-field>

          <v-textarea
            v-model="diagram.description"
            label="Description"
            required
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions class="text-right">
        <v-btn color="primary" @click="confirm">Confirm</v-btn>
        <v-btn color="primary" @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const propsForm = defineProps({
  action: String,
  icon: String,
  diagram: Object,
});

const emit = defineEmits(["confirm"]);

const dialog = ref(false);

const diagram = ref({ ...propsForm.diagram });

const requiredRule = [(x: string) => !!x];

const confirm = () => {
  const newTitle = diagram.value.title;
  const newDescription = diagram.value.description;
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

const close = () => {
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
            :rules="requiredRule"
            label="Title"
            required
          ></v-text-field>

          <v-textarea
            v-model="diagram.description"
            :rules="requiredRule"
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

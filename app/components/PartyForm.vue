<script setup lang="ts">
import z from 'zod';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const schema = z.object({
  name: z.string().min(1, 'Party name is required'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Bind the name field to vee-validate
const { value: name, errorMessage: nameError } = useField('name');

const emit = defineEmits<{
  submit: [values: { name: string }],
}>();

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values);
});
</script>

<template>
  <VForm @submit.prevent="onSubmit">
    <VTextField
      v-model="name"
      name="name"
      label="Party Name"
      placeholder="Enter your party name"
      variant="outlined"
      class="mb-4"
      :error-messages="nameError"
    />
    
    <VBtn
      type="submit"
      color="primary"
      size="large"
      block
      :loading="isSubmitting"
      :disabled="isSubmitting"
      class="text-none"
    >
      <VIcon start>mdi-party-popper</VIcon>
      Start the party!
    </VBtn>
  </VForm>
</template>

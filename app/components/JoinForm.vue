<script setup lang="ts">
import z from 'zod';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const props = defineProps<{
  error?: string;
  initialCode?: string;
}>();

const schema = z.object({
  joinCode: z.string().length(6, 'Join code must be exactly 6 characters'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    joinCode: props.initialCode || '',
  },
});

// Bind the joinCode field to vee-validate
const { value: joinCode, errorMessage: joinCodeError } = useField('joinCode');

const emit = defineEmits<{
  submit: [values: { joinCode: string }],
}>();

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values);
});
</script>

<template>
  <VForm @submit.prevent="onSubmit">
    <!-- Error Alert -->
    <VAlert
      v-if="props.error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
    >
      {{ props.error }}
    </VAlert>

    <VTextField
      v-model="joinCode"
      name="joinCode"
      label="Join Code"
      placeholder="Enter 6-character code"
      variant="outlined"
      class="mb-4"
      :error-messages="joinCodeError"
      maxlength="6"
      counter
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
      <VIcon start>mdi-login</VIcon>
      Join Party!
    </VBtn>
  </VForm>
</template>

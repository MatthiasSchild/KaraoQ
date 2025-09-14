<script setup lang="ts">
import z from 'zod';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const schema = z.object({
  singer: z.string().min(1, 'Singer name is required'),
  song: z.string().min(1, 'Song title is required'),
  artist: z.string().min(1, 'Artist name is required'),
});

export type FormData = z.infer<typeof schema>;

const { handleSubmit, isSubmitting, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Bind the fields to vee-validate
const { value: singer, errorMessage: singerError } = useField('singer');
const { value: song, errorMessage: songError } = useField('song');
const { value: artist, errorMessage: artistError } = useField('artist');

// Remember singer checkbox (not part of form validation)
const rememberSinger = ref(false);

const emit = defineEmits<{
  submit: [values: FormData, rememberSinger: boolean],
}>();

const onSubmit = handleSubmit(async (values) => {
  emit('submit', values, rememberSinger.value);
});

// Method to clear form (called from parent)
const clearForm = () => {
  if (rememberSinger.value) {
    // Only clear song and artist, keep singer name
    setFieldValue('song', '');
    setFieldValue('artist', '');
  } else {
    // Clear all fields
    resetForm();
  }
};

// Expose clearForm method to parent
defineExpose({ clearForm });
</script>

<template>
  <VForm @submit.prevent="onSubmit">
    <VCard class="pa-4">
      <VCardTitle class="text-h5 text-primary mb-4">
        Add Song to Queue
      </VCardTitle>
      
      <VRow>
        <VCol cols="12">
          <VTextField
            v-model="singer"
            name="singer"
            label="Singer Name"
            placeholder="Enter your name"
            variant="outlined"
            :error-messages="singerError"
            required
          />
        </VCol>
        <VCol cols="12">
          <VCheckbox
            v-model="rememberSinger"
            label="Remember the singer"
            color="primary"
            hide-details
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="song"
            name="song"
            label="Song Title"
            placeholder="Enter song title"
            variant="outlined"
            :error-messages="songError"
            required
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="artist"
            name="artist"
            label="Artist"
            placeholder="Enter artist name"
            variant="outlined"
            :error-messages="artistError"
            required
          />
        </VCol>
        <VCol cols="12" class="d-flex justify-end">
          <VBtn 
            type="submit" 
            color="primary" 
            size="large"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="text-none"
          >
            <VIcon start>mdi-plus</VIcon>
            Add to Queue
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
  </VForm>
</template>
<script setup lang="ts">
import type { SingerDto } from '../../shared/types/dto.d';

const props = defineProps<{
  singers: SingerDto[];
  isLoading?: boolean;
  currentSessionId?: string;
}>();

const emit = defineEmits<{
  delete: [singerId: string],
}>();

const handleDelete = (singerId: string) => {
  emit('delete', singerId);
};

const isMyEntry = (singer: SingerDto) => {
  const isMySinger = props.currentSessionId && singer.session === props.currentSessionId;
  // Temporary debugging - remove this after testing
  if (props.currentSessionId) {
    console.log(`Checking singer "${singer.singer}": session="${singer.session}", current="${props.currentSessionId}", isMine=${isMySinger}`);
  }
  return isMySinger;
};
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center">
      <VIcon start>mdi-queue-music</VIcon>
      Singing Queue
      <VSpacer />
      <VChip color="primary" variant="outlined">
        {{ singers.length }} {{ singers.length === 1 ? 'singer' : 'singers' }}
      </VChip>
    </VCardTitle>
    
    <VCardText>
      <VList v-if="singers.length > 0" class="pa-0">
        <VListItem
          v-for="(singer, index) in singers"
          :key="singer.id"
          class="px-0"
        >
          <template #prepend>
            <VAvatar color="primary" variant="tonal">
              {{ index + 1 }}
            </VAvatar>
          </template>
          
          <VListItemTitle class="text-h6">
            {{ singer.singer }}
          </VListItemTitle>
          
          <VListItemSubtitle class="text-body-1">
            {{ singer.song }}
          </VListItemSubtitle>
          
          <VListItemSubtitle class="text-caption">
            by {{ singer.artist }}
          </VListItemSubtitle>
          
          <template #append>
            <div class="d-flex align-center gap-2">
              <VChip
                v-if="singer.skipped"
                color="error"
                size="small"
                variant="tonal"
              >
                Skipped
              </VChip>
              
              <VBtn
                v-if="isMyEntry(singer)"
                @click="handleDelete(singer.id)"
                icon
                size="small"
                color="error"
                variant="text"
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </div>
          </template>
        </VListItem>
      </VList>
      
      <VEmptyState
        v-else-if="!isLoading"
        title="No songs in queue"
        text="Be the first to add a song to the queue!"
        icon="mdi-music-note-off"
      />
      
      <VProgressCircular
        v-if="isLoading"
        indeterminate
        color="primary"
        class="mx-auto d-block"
      />
    </VCardText>
  </VCard>
</template>

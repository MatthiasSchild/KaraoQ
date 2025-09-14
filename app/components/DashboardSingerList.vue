<template>
  <VCard class="pa-4" elevation="2">
    <VCardTitle class="d-flex align-center mb-4">
      <VIcon start>mdi-queue-music</VIcon>
      Singer Queue
    </VCardTitle>
    
    <div v-if="isLoading" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" />
      <p class="mt-2 text-body-2">Loading singers...</p>
    </div>
    
    <div v-else-if="singers.length === 0" class="text-center py-8">
      <VIcon size="48" color="grey">mdi-music-off</VIcon>
      <p class="mt-2 text-body-2 text-grey">No singers in queue</p>
    </div>
    
    <div v-else class="singer-list">
      <!-- Current Singer (Large Display) -->
      <div v-if="currentSinger" class="current-singer mb-4">
        <VCard 
          color="primary" 
          variant="tonal" 
          class="pa-4"
          elevation="3"
        >
          <div class="text-center">
            <VIcon size="32" class="mb-2">mdi-microphone</VIcon>
            <h3 class="text-h5 mb-2">{{ currentSinger.singer }}</h3>
            <p class="text-body-2 mb-0">{{ currentSinger.song }}</p>
            <p class="text-caption text-grey">{{ currentSinger.artist }}</p>
            <div class="d-flex align-center justify-center gap-2 mt-2 flex-wrap">
              <VBtn
                color="primary"
                size="small"
                variant="elevated"
                @click="$emit('skip', currentSinger.id)"
              >
                <VIcon start>mdi-skip-next</VIcon>
                Skip
              </VBtn>
              <VBtn
                color="success"
                size="small"
                variant="elevated"
                @click="$emit('finish', currentSinger.id)"
              >
                <VIcon start>mdi-check</VIcon>
                Finished
              </VBtn>
              <VBtn
                color="red"
                size="small"
                variant="elevated"
                :href="getYouTubeUrl(currentSinger.artist, currentSinger.song)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <VIcon start>mdi-youtube</VIcon>
                YouTube
              </VBtn>
            </div>
          </div>
        </VCard>
      </div>
      
      <!-- Skipped Singers (Small Info List) -->
      <div v-if="skippedSingers.length > 0" class="skipped-singers mb-4">
        <VCard variant="outlined" class="pa-3">
          <div class="d-flex align-center mb-2">
            <VIcon size="16" color="warning" class="mr-2">mdi-skip-next</VIcon>
            <span class="text-caption text-grey">Skipped Singers</span>
          </div>
          <div class="d-flex flex-wrap gap-1">
            <VChip
              v-for="singer in skippedSingers"
              :key="singer.id"
              size="small"
              color="warning"
              variant="tonal"
              class="text-caption"
            >
              {{ singer.singer }} - {{ singer.song }}
            </VChip>
          </div>
        </VCard>
      </div>
      
      <!-- Upcoming Singers (Limited to 6) -->
      <div v-if="upcomingSingers.length > 0" class="upcoming-singers">
        <h4 class="text-h6 mb-3">Up Next</h4>
        <VList density="compact">
          <VListItem
            v-for="(singer, index) in upcomingSingers"
            :key="singer.id"
            class="singer-item"
          >
            <template #prepend>
              <VAvatar color="primary" size="small">
                <span class="text-caption">{{ index + 1 }}</span>
              </VAvatar>
            </template>
            
            <VListItemTitle class="text-body-1">
              {{ singer.singer }}
            </VListItemTitle>
            
            <VListItemSubtitle class="text-body-2">
              {{ singer.song }} - {{ singer.artist }}
            </VListItemSubtitle>
            
            <template #append>
              <VBtn
                icon="mdi-skip-next"
                size="small"
                variant="text"
                color="primary"
                @click="$emit('skip', singer.id)"
              />
            </template>
          </VListItem>
        </VList>
      </div>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import type { SingerDto } from '~/shared/types/dto.d'

interface Props {
  singers: SingerDto[]
  isLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  skip: [singerId: string]
  finish: [singerId: string]
}>()

// Get non-skipped singers (singers without skipped date)
const nonSkippedSingers = computed(() => {
  const nonSkipped = props.singers.filter(singer => !singer.skipped)
  
  // If all singers are skipped, treat all as non-skipped
  if (nonSkipped.length === 0 && props.singers.length > 0) {
    return props.singers
  }
  
  return nonSkipped
})

// Get skipped singers (singers with skipped date)
const skippedSingers = computed(() => {
  const skipped = props.singers.filter(singer => singer.skipped)
  
  // If all singers are skipped, show none as skipped (they're treated as normal)
  if (skipped.length === props.singers.length && props.singers.length > 0) {
    return []
  }
  
  return skipped
})

// Get current singer (first non-skipped singer)
const currentSinger = computed(() => {
  return nonSkippedSingers.value.length > 0 ? nonSkippedSingers.value[0] : null
})

// Get upcoming singers (next 5 non-skipped singers, excluding current)
const upcomingSingers = computed(() => {
  return nonSkippedSingers.value.slice(1, 6) // Limit to 5 upcoming singers
})

// Generate YouTube search URL
const getYouTubeUrl = (artist: string, song: string): string => {
  const searchQuery = `${artist} ${song} karaoke`
  const encodedQuery = encodeURIComponent(searchQuery)
  return `https://www.youtube.com/results?search_query=${encodedQuery}`
}
</script>

<style scoped>
.singer-list {
  min-height: 400px;
}

.current-singer {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.singer-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.singer-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.skipped-singers {
  opacity: 0.8;
}

.skipped-singers .v-card {
  background-color: rgba(var(--v-theme-warning), 0.05);
  border-color: rgba(var(--v-theme-warning), 0.2);
}
</style>

<template>
  <div class="qr-code-container">
    <VCard class="pa-4" elevation="2">
      <VCardTitle class="text-center mb-4">
        <VIcon start>mdi-qrcode</VIcon>
        Join Party
      </VCardTitle>
      
      <div class="qr-code-wrapper">
        <canvas ref="qrCanvas" class="qr-canvas"></canvas>
      </div>
      
      <VCardText class="text-center mt-4">
        <p class="text-body-2 mb-2">Scan to join the party</p>
        <VChip 
          color="primary" 
          variant="outlined" 
          size="large"
          class="join-code-chip"
        >
          Code: {{ joinCode }}
        </VChip>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

interface Props {
  joinCode: string
  partyName?: string
}

const props = defineProps<Props>()

const qrCanvas = ref<HTMLCanvasElement>()

const generateQRCode = async () => {
  if (!qrCanvas.value || !props.joinCode) return
  
  const joinUrl = `${window.location.origin}/join?code=${props.joinCode}`
  
  try {
    await QRCode.toCanvas(qrCanvas.value, joinUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

onMounted(() => {
  generateQRCode()
})

watch(() => props.joinCode, () => {
  generateQRCode()
})
</script>

<style scoped>
.qr-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.qr-code-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.qr-canvas {
  max-width: 100%;
  height: auto;
}

.join-code-chip {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 1.5rem !important;
  padding: 12px 20px !important;
}
</style>

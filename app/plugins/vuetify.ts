import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#2196F3',
            secondary: '#424242',
            accent: '#FF4081',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            background: '#121212',
            surface: '#1E1E1E',
            'on-primary': '#000000',
            'on-secondary': '#FFFFFF',
            'on-surface': '#FFFFFF',
            'on-background': '#FFFFFF',
          }
        }
      }
    }
  })
  app.vueApp.use(vuetify)
})

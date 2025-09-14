// Dark theme configuration
export const themeConfig = {
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

// Theme utility (simplified since we only have dark theme)
export const useTheme = () => {
  const currentTheme = ref('dark')
  
  const setTheme = (themeName: keyof typeof themeConfig) => {
    currentTheme.value = themeName
    // You can also persist theme preference in localStorage
    if (process.client) {
      localStorage.setItem('theme', themeName)
    }
  }
  
  return {
    currentTheme: readonly(currentTheme),
    setTheme
  }
}

export default defineNuxtPlugin(() => {})
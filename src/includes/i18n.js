import { createI18n } from 'vue-i18n' // This creates a plugin for the package

// Import specificc language files
import en from '@/languages/en.json'
import fr from '@/languages/fr.json'

export default createI18n({
  locale: 'en', // Default language
  fallbackLocale: 'en', // If the language is not found, this will be used
  messages: {
    en,
    fr
  },
  numberFormats: {
    en: {
      // Instruct i18n to use the 'currency' style for numbers (we could use other styles like 'decimal', 'percent', etc.)
      currency: {
        style: 'currency', // This can be 'decimal', 'currency', 'time', 'percent', etc.
        currency: 'USD' // This is the currency code
      }
    },
    jp: {
      currency: {
        style: 'currency',
        currency: 'JPY',
        currencyDisplay: 'symbol'
      }
    }
  }
})

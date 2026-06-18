---
name: language-policy
description: Bilingual EN/RU policy with i18n, default English
type: preference
---
App is bilingual: English (default) and Russian. Use react-i18next with strings in `src/i18n/locales/{en,ru}.json`. A LanguageToggle (EN/RU pill) is visible from Splash and in HeaderBar; selection persists to localStorage key `meanwhile.lang`. All new user-facing strings must be added to both locale files and rendered via `useTranslation()`.

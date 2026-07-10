import { I18n } from 'i18n-js';

import { useAppStore } from '../state/useAppStore';
import { SUPPORTED_LANGUAGES, translations, type Language } from './translations';

export { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type Language } from './translations';

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export type TFunc = (key: string, options?: Record<string, unknown>) => string;

// Hook that returns a translate function bound to the current language.
// Subscribing to `language` re-renders consumers when it changes.
export function useT(): TFunc {
  const language = useAppStore((s) => s.language);
  i18n.locale = language;
  return (key, options) => i18n.t(key, options);
}

export function isSupportedLanguage(code: string | null | undefined): code is Language {
  return !!code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

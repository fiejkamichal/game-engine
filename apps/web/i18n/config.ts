/**
 * Locale configuration shared by the i18n request config and the
 * locale-switching server actions.
 *
 * Polish is the default to match the live UI and the slide deck
 * (presentation/index.html). Adding a language = drop a new
 * `messages/<locale>.json` catalog and extend `locales` below.
 */

export const locales = ["pl", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pl";

/** Cookie that persists the visitor's locale choice across requests. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { setUserLocale } from "@/lib/locale";

// PL ⇄ EN switch, mirroring the slide deck's toolbar control (presentation/
// index.html). Persists the choice in a cookie and refreshes so both Server
// and Client Components re-render with the new catalog — no full reload.
export function LanguageToggle() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const current: Locale = isLocale(locale) ? locale : defaultLocale;
  const next: Locale = current === "pl" ? "en" : "pl";

  function switchTo(target: Locale) {
    startTransition(async () => {
      await setUserLocale(target);
      router.refresh();
    });
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if (event.key !== "l" && event.key !== "L") return;
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }
      event.preventDefault();
      switchTo(current === "pl" ? "en" : "pl");
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // `current` is intentionally captured per render so the shortcut always
    // toggles relative to the locale shown to the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <button
      type="button"
      onClick={() => switchTo(next)}
      disabled={pending}
      className="icon-btn"
      aria-label={t("toggle")}
      title={t("title")}
    >
      <span aria-hidden="true">{current.toUpperCase()}</span>
    </button>
  );
}

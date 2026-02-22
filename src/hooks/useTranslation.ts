"use client";

import { useAppStore } from "@/lib/store";
import { t as translate, TranslationKey } from "@/lib/i18n";

export function useTranslation() {
  const locale = useAppStore((s) => s.locale);

  return {
    t: (key: TranslationKey) => translate(locale, key),
    locale,
  };
}

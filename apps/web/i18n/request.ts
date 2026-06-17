import { getRequestConfig } from "next-intl/server";

import { getUserLocale } from "@/lib/locale";

// Resolves the active locale (from the cookie) and loads the matching message
// catalog for every Server Component render. next-intl calls this within a
// request scope whenever a translation API is used.
export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

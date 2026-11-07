import { useAuth } from "@/lib/auth-context"

export type TitleLanguage = "romaji" | "english" | "native"

/**
 * Given an object with title variants, returns the preferred title and sub-title
 * based on the selected language preference.
 *
 * - `title` is always the Romaji title in our data
 * - `titleJp` is the native (JP) title
 * - `titleEn` is the English title
 *
 * For any language, the sub-title is whichever title is NOT the primary.
 */
export function resolveTitle(
  item: { title: string; titleJp?: string; titleEn?: string },
  lang: TitleLanguage
): { primary: string; secondary: string } {
  const romaji = item.title
  const native = item.titleJp || ""
  const english = item.titleEn || romaji

  switch (lang) {
    case "english":
      return { primary: english, secondary: native || romaji }
    case "native":
      return { primary: native || romaji, secondary: romaji }
    case "romaji":
    default:
      return { primary: romaji, secondary: native }
  }
}

/**
 * Hook that reads the user's title language preference from auth context
 * and returns a resolver function.
 */
export function useTitleLanguage() {
  const { user } = useAuth()
  const lang: TitleLanguage = (user?.titleLanguage as TitleLanguage) || "romaji"

  function getTitle(item: { title: string; titleJp?: string; titleEn?: string }) {
    return resolveTitle(item, lang)
  }

  return { lang, getTitle }
}

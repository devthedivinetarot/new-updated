import { useLanguageStore } from '@/store/languageStore'
import { getTranslationSync, loadTranslations } from '@/lib/i18n/loader'
import { useEffect, useState } from 'react'

export function useTranslation() {
  const { language } = useLanguageStore()

  const [dynamicTranslations, setDynamicTranslations] =
    useState<Record<string, string>>({})

  useEffect(() => {
    loadTranslations(language)
  }, [language])

  function t(path: string, vars?: Record<string, string>) {
    let value = getTranslationSync(path, language)
    const isActuallyMissing = value === path

    if (isActuallyMissing && !dynamicTranslations[path]) {
      const keys = path.split('.')
      const readable = keys[keys.length - 1]
        .replace(/([A-Z])/g, ' ')
        .replace(/[_-]/g, ' ')
        .toLowerCase()
      const humanized = readable.charAt(0).toUpperCase() + readable.slice(1)
      setDynamicTranslations((prev) => ({
        ...prev,
        [path]: humanized,
      }))
      value = humanized
    }

    if (!isActuallyMissing) {
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          value = value.replace('{' + k + '}', v)
        })
      }
      return value
    }

    if (vars && dynamicTranslations[path]) {
      let result = dynamicTranslations[path]
      Object.entries(vars).forEach(([k, v]) => {
        result = result.replace('{' + k + '}', v)
      })
      return result
    }

    return dynamicTranslations[path] || value
  }

  return { t, language }
}

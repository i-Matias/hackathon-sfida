import { useLanguageStore } from "../stores/useLanguageStore";
import { translations, TranslationKey } from "../localization/translations";

export const useTranslation = () => {
  const { language } = useLanguageStore();

  const t = (key: TranslationKey) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t, language };
};

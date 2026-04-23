import { defineStore } from "pinia";
import { ref } from "vue";
import langData from "@/utils/lang.json";

export type LanguageCode = "en" | "am";

type Paths<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : {
      [K in keyof T & string]: Paths<
        T[K],
        Prefix extends "" ? K : `${Prefix}.${K}`
      >;
    }[keyof T & string];

export type TranslationKey = Paths<typeof langData.en>;

const getInitialLanguage = (): LanguageCode => {
  const saved = localStorage.getItem("language") as LanguageCode;
  if (saved === "en" || saved === "am") return saved;
  return import.meta.env.DEV ? "en" : "am";
};

export const useLangStore = defineStore("lang", () => {
  const language = ref<LanguageCode>(getInitialLanguage());

  const setLanguage = (lang: LanguageCode) => {
    localStorage.setItem("language", lang);
    language.value = lang;
  };

  const t = (keyPath: TranslationKey, params?: Record<string, any>): string => {
    if (!keyPath) return "";
    const keys = (keyPath as string).split(".");
    const data: any = (langData as any).default || langData;
    let current: any = data[language.value];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return keyPath as string; // Return key path if not found
      }
    }

    let result = typeof current === "string" ? current : (keyPath as string);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(
          new RegExp(`\\$\\{${key}\\}`, "g"),
          String(value),
        );
      });
    }

    return result;
  };

  return { language, setLanguage, t };
});

export const t = (key: TranslationKey, params?: Record<string, any>) =>
  useLangStore().t(key, params);

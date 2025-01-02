import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './resource_en.json';
import translationZh from './resource_zh.json';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: translationEn,
        },
        zh: {
            translation: translationZh,
        },
    },
    lng: 'en', // 默认语言
    fallbackLng: 'zh', // 找不到翻译时的回退语言
    interpolation: {
        escapeValue: false, // React 已经在处理 XSS
    },
});

export default i18n;
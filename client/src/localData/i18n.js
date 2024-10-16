import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import translationEN from './en/trans.json'
import translationVIE from './vie/trans.json'
const resources={
    en:{
        translation:translationEN
    },
    vie:{
        translation:translationVIE
    }
}
i18next
.use(initReactI18next)
.use(LanguageDetector)
.use(Backend)
.init({
    debug:true,
    fallbackLng:'en',
    resources:resources,
    ns:['translation'],
    defaultNS:'translation',
})
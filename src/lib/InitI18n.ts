import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import commonEn from '../translations/en/common.json';
import commonDe from '../translations/de/common.json';
import commonNl from '../translations/nl/common.json';
import commonFr from '../translations/fr/common.json';
import commonIt from '../translations/it/common.json';

export default function InitI18n() {
    i18n.use(initReactI18next).init({
        lng: 'en',
        interpolation: { escapeValue: false },  // React already does escaping
        resources: {
            de: {common: commonDe},
            en: {common: commonEn},
            fr: {common: commonFr},
            it: {common: commonIt},
            nl: {common: commonNl}
        }
    });
}

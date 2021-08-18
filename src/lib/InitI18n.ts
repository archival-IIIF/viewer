import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const commonEn = require('../translations/en/common.json');
const commonDe = require('../translations/de/common.json');
const commonNl = require('../translations/nl/common.json');
const commonFr = require('../translations/fr/common.json');
const commonIt = require('../translations/it/common.json');

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

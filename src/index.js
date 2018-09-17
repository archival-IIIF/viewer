import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import common_de from './translations/de/common.json';
import common_en from './translations/en/common.json';

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    fallbackLng: 'en',
    resources: {
        en: {
            common: common_en
        },
        de: {
            common: common_de
        }
    },
});

ReactDOM.render(
    <I18nextProvider i18n={i18next}>
        <App />
    </I18nextProvider>,
    document.getElementById('root'));
registerServiceWorker();

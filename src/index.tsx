import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
const commonEn = require('./translations/en/common.json');
const commonDe = require('./translations/de/common.json');

i18next.init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },  // React already does escaping
    resources: {
        de: {
            common: commonDe
        },
        en: {
            common: commonEn
        }
    }
});

ReactDOM.render(
    <I18nextProvider i18n={i18next}>
        <App />
    </I18nextProvider>,
    document.getElementById('root'));
registerServiceWorker();

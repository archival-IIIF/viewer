import * as React from 'react';
import App from './App';
import IConfigParameter from './interface/IConfigParameter';
import i18n from "i18next";
import { createRoot } from 'react-dom/client';

export default class Init {

    constructor(config: IConfigParameter) {
        const container = document.getElementById(config.id);
        const root = createRoot(container!);
        root.render(<App config={config}/>);
    }


    changeLanguage(code: string) {
        i18n.changeLanguage(code).then(r => {});
    }
}

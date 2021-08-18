import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import IConfigParameter from './interface/IConfigParameter';
import i18n from "i18next";

export default class Init {

    constructor(config: IConfigParameter) {

        ReactDOM.render(
            <App config={config}/>,
            document.getElementById(config.id)
        );
        serviceWorker.unregister();
    }


    changeLanguage(code: string) {
        i18n.changeLanguage(code);
    }

}

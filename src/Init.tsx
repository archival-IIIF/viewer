import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import IConfigParameter from './interface/IConfigParameter';

class Init {

    constructor(config: IConfigParameter) {

        ReactDOM.render(
            <App config={config}/>,
            document.getElementById(config.id)
        );
        registerServiceWorker();
    }
}

export default Init;

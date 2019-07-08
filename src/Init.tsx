import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import IConfigParameter from './interface/IConfigParameter';

class Init {

    constructor(config: IConfigParameter) {

        ReactDOM.render(
            <App config={config}/>,
            document.getElementById(config.id)
        );
        serviceWorker.unregister();
    }
}

export default Init;

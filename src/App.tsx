import React from 'react';
import TopBar from './TopBar/TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import Alert from './Alert';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import i18n  from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
import TreeView from "./TreeView";
import Splitter from "./Splitter";
import Content from "./Content";
const commonEn = require('./translations/en/common.json');
const commonDe = require('./translations/de/common.json');
const commonNl = require('./translations/nl/common.json');

require('./css/App.css');



interface IProps {
    config: IConfigParameter;
}

declare let global: {
    config: Config;
};


class App extends React.Component<IProps, {}> {

    constructor(props: IProps) {

        super(props);

        global.config = new Config(this.props.config);

        i18n.use(initReactI18next).init({
            lng: global.config.getLanguage(),
            fallbackLng: global.config.getFallbackLanguage(),
            interpolation: { escapeValue: false },  // React already does escaping
            resources: {
                de: {
                    common: commonDe
                },
                en: {
                    common: commonEn
                },
                nl: {
                    common: commonNl
                }
            }
        });
    }

    render() {
        return (
            <I18nextProvider i18n={i18n}>
                <Alert />
                <Login/>
                <TopBar/>
                <Splitter
                    a={<TreeView />}
                    b={<Content />}
                    direction="vertical"
                />
            </I18nextProvider>
        );
    }

    componentDidMount() {

        window.addEventListener('popstate', function(event) {
            ManifestHistory.goBack();
        });
    }

}

export default App;

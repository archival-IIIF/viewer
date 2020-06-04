import React from 'react';
import TopBar from './TopBar/TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import Alert from './Alert';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import i18n  from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
import TreeView from "./treeView/TreeView";
import Splitter from "./splitter/Splitter";
import Content from "./Content";
import './css/App.css';

const commonEn = require('./translations/en/common.json');
const commonDe = require('./translations/de/common.json');
const commonNl = require('./translations/nl/common.json');

interface IProps {
    config: IConfigParameter;
}

declare let global: {
    config: Config;
};

interface IState {
    showNavBar: boolean;
}

class App extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        global.config = new Config(this.props.config);

        this.state = {showNavBar: true}

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

        this.toggleTreeViewBar = this.toggleTreeViewBar.bind(this);
    }

    render() {
        return (
            <I18nextProvider i18n={i18n}>
                <Alert />
                <Login/>
                <TopBar toggleTreeViewBar={this.toggleTreeViewBar}/>
                {this.renderMain()}
            </I18nextProvider>
        );
    }

    renderMain() {
        if (this.state.showNavBar) {
            return <Splitter
                a={<TreeView />}
                b={<Content />}
                direction="vertical"
            />;
        } else {
            return <Content />;
        }
    }

    componentDidMount() {

        window.addEventListener('popstate', function(event) {
            ManifestHistory.goBack();
        });
    }

    toggleTreeViewBar() {
        this.setState({showNavBar: !this.state.showNavBar});
    }

}

export default App;

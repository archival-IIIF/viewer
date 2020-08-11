import React from 'react';
import TopBar from './TopBar/TopBar';
import ManifestHistory from './lib/ManifestHistory';
import Login from './Login';
import Alert from './Alert';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import i18n  from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
import Splitter from "./splitter/Splitter";
import Content from "./Content";
import './css/App.css';
import Cache from "./lib/Cache";
import IManifestData from "./interface/IManifestData";
import PresentationApi from "./fetch/PresentationApi";
import TreeBuilder from "./navigation/treeView/TreeBuilder";
import ITree from "./interface/ITree";
import ManifestData from "./entity/ManifestData";
import Navigation from "./navigation/Navigation";
import {getLocalized} from "./lib/ManifestHelpers";

const commonEn = require('./translations/en/common.json');
const commonDe = require('./translations/de/common.json');
const commonNl = require('./translations/nl/common.json');
const commonFr = require('./translations/fr/common.json');
const commonIt = require('./translations/it/common.json');

interface IProps {
    config: IConfigParameter;
}

declare let global: {
    config: Config;
};

interface IState {
    currentManifest?: IManifestData;
    currentFolder?: IManifestData;
    tree?: ITree;
    authDate: number;
}

class App extends React.Component<IProps, IState> {

    private q: string | null;

    constructor(props: IProps) {

        super(props);

        Cache.ee.setMaxListeners(100);

        global.config = new Config(this.props.config);
        this.q = PresentationApi.getGetParameter('q', window.location.href);

        this.state = {authDate: 0};

        i18n.use(initReactI18next).init({
            lng: global.config.getLanguage(),
            fallbackLng: global.config.getFallbackLanguage(),
            interpolation: { escapeValue: false },  // React already does escaping
            resources: {
                de: {common: commonDe},
                en: {common: commonEn},
                fr: {common: commonFr},
                it: {common: commonIt},
                nl: {common: commonNl}
            }
        });

        this.setCurrentManifest = this.setCurrentManifest.bind(this);
        this.tokenReceived = this.tokenReceived.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    render() {
        return (
            <I18nextProvider i18n={i18n}>
                <Alert />
                <Login setCurrentManifest={this.setCurrentManifest}/>
                <TopBar key={this.state.authDate} currentManifest={this.state.currentManifest} />
                {this.renderMain()}
            </I18nextProvider>
        );
    }

    renderMain() {

        if (!this.state.currentManifest || !this.state.currentFolder) {
            return;
        }

        return <Splitter
            id="main"
            a={<Navigation
                tree={this.state.tree}
                currentManifest={this.state.currentManifest}
                currentFolder={this.state.currentFolder}
                setCurrentManifest={this.setCurrentManifest}
                q={this.q}
            />}
            b={<Content
                key={this.state.currentManifest.id}
                currentManifest={this.state.currentManifest}
                currentFolder={this.state.currentFolder}
                setCurrentManifest={this.setCurrentManifest}
                authDate={this.state.authDate}
            />}
            direction="vertical"
        />;
    }

    componentDidMount() {
        const t = this;
        window.addEventListener('popstate', function(event) {
            const backId = ManifestHistory.goBack();
            if (backId) {
                t.setCurrentManifest(backId)
            }
        });
        this.setCurrentManifest();
        Cache.ee.addListener('token-changed', this.tokenReceived);
        i18n.on('languageChanged', this.refresh);
    }

    componentWillUnmount() {
        Cache.ee.removeListener('token-changed', this.tokenReceived);
        i18n.off('languageChanged', this.refresh);
    }

    setCurrentManifest(id?: string) {
        const t = this;

        if (!id) {
            id = PresentationApi.getIdFromCurrentUrl();
        }
        if (!id) {
            return;
        }
        const url = id;

        PresentationApi.get(
            url,
            (currentManifest: IManifestData) =>  {
                ManifestHistory.pageChanged(
                    currentManifest.request ?? currentManifest.id,
                    getLocalized(currentManifest.label)
                );

                if (currentManifest.type === 'Collection') {
                    const currentFolder = currentManifest;
                    TreeBuilder.get(currentFolder.id, undefined, (tree) => {
                        t.setState({currentManifest, currentFolder, tree});
                    });
                } else if (currentManifest.parentId) {
                    PresentationApi.get(
                        currentManifest.parentId,
                        (currentFolder: IManifestData) => {
                            TreeBuilder.get(currentFolder.id, undefined, (tree) => {
                                t.setState({currentManifest, currentFolder, tree});
                            });
                        }
                    )
                } else {
                    const currentFolder = new ManifestData();
                    currentFolder.type = 'Manifest';
                    t.setState({currentManifest, currentFolder});
                }

                document.title = getLocalized(currentManifest.label);
            }
        );
    }

    tokenReceived() {
        this.setState({authDate: Date.now()});
        this.setCurrentManifest();
    }

    refresh() {
        this.setCurrentManifest();
    }
}

export default App;
